import { useT } from "@transifex/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useShowContext } from "react-admin";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import {
  dropdownOptionsRestoration,
  dropdownOptionsTarget,
  dropdownOptionsTree
} from "@/constants/polygonDropdownOptions";
import { useNotificationContext } from "@/context/notification.provider";
import {
  fetchGetV2SitePolygonUuid,
  fetchGetV2SitePolygonUuidVersions,
  usePostV2TerrafundNewSitePolygonUuidNewVersion
} from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import Log from "@/utils/log";

const AttributeInformation = ({
  selectedPolygon,
  updateSingleSitePolygonData,
  setSelectedPolygonData,
  setStatusSelectedPolygon,
  refetchPolygonVersions,
  isLoadingVersions,
  setSelectedPolygonToDrawer,
  selectedPolygonIndex,
  setPolygonFromMap,
  setIsLoadingDropdownVersions,
  setIsOpenPolygonDrawer
}: {
  selectedPolygon: SitePolygon;
  updateSingleSitePolygonData: (poly_id: string, updatedData: any) => void | undefined;
  setSelectedPolygonData: any;
  setStatusSelectedPolygon: any;
  refetchPolygonVersions: () => void;
  isLoadingVersions: boolean;
  setSelectedPolygonToDrawer?: Dispatch<SetStateAction<{ id: string; status: string; label: string; uuid: string }>>;
  selectedPolygonIndex?: string;
  setPolygonFromMap: Dispatch<SetStateAction<{ isOpen: boolean; uuid: string }>>;
  setIsLoadingDropdownVersions: Dispatch<SetStateAction<boolean>>;
  setIsOpenPolygonDrawer: Dispatch<SetStateAction<boolean>>;
}) => {
  const [polygonName, setPolygonName] = useState<string>();
  const [plantStartDate, setPlantStartDate] = useState<string>();
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState<number>(selectedPolygon?.num_trees ?? 0);
  const [calculatedArea, setCalculatedArea] = useState<number>(selectedPolygon?.calc_area ?? 0);
  const [formattedArea, setFormattedArea] = useState<string>();
  const { mutate: sendSiteData } = usePostV2TerrafundNewSitePolygonUuidNewVersion();
  const [isLoadingDropdown, setIsLoadingDropdown] = useState<boolean>(true);
  const { openNotification } = useNotificationContext();

  const t = useT();
  const { refetch } = useShowContext();

  useEffect(() => {
    setIsLoadingDropdown(true);
    const refreshEntity = async () => {
      if (selectedPolygon?.uuid) {
        setIsLoadingDropdown(false);
      }
    };
    refreshEntity();
    setPolygonName(selectedPolygon?.poly_name ?? "");
    setPlantStartDate(selectedPolygon?.plantstart ?? "");
    setTreesPlanted(selectedPolygon?.num_trees ?? 0);
    setCalculatedArea(selectedPolygon?.calc_area ?? 0);
    const restorationPracticeArray = selectedPolygon?.practice
      ? selectedPolygon?.practice.split(",").map(function (item) {
          return item.trim();
        })
      : [];
    setRestorationPractice(restorationPracticeArray);

    const targetLandUseSystemArray = selectedPolygon?.target_sys
      ? selectedPolygon?.target_sys.split(",").map(function (item) {
          return item.trim();
        })
      : [];
    setTargetLandUseSystem(targetLandUseSystemArray);

    const treeDistributionArray = selectedPolygon?.distr
      ? selectedPolygon?.distr.split(",").map(function (item) {
          return item.trim();
        })
      : [];
    setTreeDistribution(treeDistributionArray);
  }, [selectedPolygon]);

  useEffect(() => {
    const format =
      calculatedArea?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "";
    setFormattedArea(format ?? "");
  }, [calculatedArea]);

  const savePolygonData = async () => {
    if (selectedPolygon?.uuid) {
      const restorationPracticeToSend = restorationPractice.join(", ");
      const landUseSystemToSend = targetLandUseSystem.join(", ");
      const treeDistributionToSend = treeDistribution.join(", ");
      const updatedPolygonData = {
        poly_name: polygonName,
        plantstart: plantStartDate,
        practice: restorationPracticeToSend,
        target_sys: landUseSystemToSend,
        distr: treeDistributionToSend,
        num_trees: treesPlanted,
        adminUpdate: true
      };
      try {
        setIsLoadingDropdownVersions(true);
        sendSiteData(
          {
            body: updatedPolygonData,
            pathParams: { uuid: selectedPolygon.uuid }
          },
          {
            onSuccess: async () => {
              await refetchPolygonVersions();
              await refetch();
              const polygonVersionData = (await fetchGetV2SitePolygonUuidVersions({
                pathParams: { uuid: selectedPolygon.primary_uuid as string }
              })) as SitePolygonsDataResponse;
              const polygonActive = polygonVersionData?.find(item => item.is_active);
              if (selectedPolygon.uuid) {
                await updateSingleSitePolygonData?.(selectedPolygon.uuid, polygonActive);
              }

              setSelectedPolygonData(polygonActive);
              setSelectedPolygonToDrawer?.({
                id: selectedPolygonIndex as string,
                status: polygonActive?.status as string,
                label: polygonActive?.poly_name as string,
                uuid: polygonActive?.poly_id as string
              });
              setPolygonFromMap({ isOpen: true, uuid: polygonActive?.poly_id ?? "" });
              setStatusSelectedPolygon(polygonActive?.status ?? "");
              setIsLoadingDropdownVersions(false);
              openNotification("success", t("Success!"), t("Polygon version created successfully"));
            },
            onError: error => {
              openNotification("error", t("Error!"), t("Error creating polygon version"));
              setIsLoadingDropdownVersions(false);
            }
          }
        );
      } catch (error) {
        Log.error("Error creating polygon version:", error);
      }
    }
    const response = (await fetchGetV2SitePolygonUuid({
      pathParams: { uuid: selectedPolygon.uuid as string }
    })) as SitePolygon;
    setSelectedPolygonData(response);
    setStatusSelectedPolygon(response?.status ?? "");
  };

  const handleCloseDrawer = () => {
    setIsOpenPolygonDrawer(false);
  };
  const handleChangeTreesPlanted = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }

    if (/^\d*$/.test(value)) {
      setTreesPlanted(Number(value));
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Polygon Name"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Input Polygon Name"
        type="text"
        name=""
        value={polygonName}
        onChangeCapture={e => setPolygonName((e.target as HTMLInputElement).value)}
      />
      <label className="flex flex-col gap-2">
        <Text variant="text-14-light">Plant Start Date</Text>
        <input
          type="date"
          lang="en-GB"
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder="Input Plant Start Date"
          value={plantStartDate}
          onChange={e => setPlantStartDate(e.target.value)}
        />
      </label>
      <When condition={!isLoadingVersions && !isLoadingDropdown}>
        <Dropdown
          label="Restoration Practice"
          labelClassName="capitalize"
          labelVariant="text-14-light"
          placeholder="Select Restoration Practice"
          multiSelect
          value={restorationPractice}
          onChange={e => setRestorationPractice(e as string[])}
          options={dropdownOptionsRestoration}
        />
        <Dropdown
          label="Target Land Use System"
          labelClassName="capitalize"
          labelVariant="text-14-light"
          placeholder="Select Target Land Use System"
          options={dropdownOptionsTarget}
          value={targetLandUseSystem}
          onChange={e => setTargetLandUseSystem(e as string[])}
        />
        <Dropdown
          multiSelect
          label="Tree Distribution"
          labelClassName="capitalize"
          labelVariant="text-14-light"
          placeholder="Select Tree Distribution"
          options={dropdownOptionsTree}
          value={treeDistribution}
          onChange={e => setTreeDistribution(e as string[])}
        />
      </When>
      <Input
        label="Trees Planted"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Input Trees Planted"
        type="text"
        name=""
        value={treesPlanted}
        onChangeCapture={handleChangeTreesPlanted}
      />
      <Input
        label="Calculated Area"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Input Calculated Area"
        type="text"
        format="number"
        disabled
        name=""
        value={formattedArea + " ha"}
        readOnly
      />
      <div className="mt-auto flex items-center justify-end gap-5">
        <Button variant="semi-red" className="w-full" onClick={handleCloseDrawer}>
          {t("Close")}
        </Button>
        <Button
          variant="semi-black"
          className="w-full"
          onClick={() => {
            savePolygonData();
          }}
        >
          {t("Save")}
        </Button>
      </div>
    </div>
  );
};

export default AttributeInformation;
