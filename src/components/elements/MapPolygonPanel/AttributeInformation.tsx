import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import { createVersionWithAttributes } from "@/connections/SitePolygons";
import {
  dropdownOptionsRestoration,
  dropdownOptionsTarget,
  dropdownOptionsTree
} from "@/constants/polygonDropdownOptions";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygon } from "@/generated/apiSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import Text from "../Text/Text";
import { useTranslatedOptions } from "./hooks/useTranslatedOptions";

const AttributeInformation = ({ handleClose }: { handleClose: () => void }) => {
  const t = useT();
  const { editPolygon, setShouldRefetchPolygonData } = useMapAreaContext();
  const [polygonData, setPolygonData] = useState<SitePolygon | SitePolygonLightDto>();
  const [polygonName, setPolygonName] = useState<string>();
  const [plantStartDate, setPlantStartDate] = useState<string>();
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState<number>(0);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);
  const [formattedArea, setFormattedArea] = useState<string>();

  const context = useSitePolygonData();
  const sitePolygonDataV3 = context?.sitePolygonData;
  const translatedRestorationOptions = useTranslatedOptions(dropdownOptionsRestoration);
  const translatedTargetOptions = useTranslatedOptions(dropdownOptionsTarget);
  const translatedTreeOptions = useTranslatedOptions(dropdownOptionsTree);
  const { openNotification } = useNotificationContext();

  useEffect(() => {
    if (sitePolygonDataV3 && editPolygon.uuid) {
      const activePolygon = sitePolygonDataV3.find(p => p.polygonUuid === editPolygon.uuid);

      if (activePolygon) {
        setPolygonData(activePolygon);
      } else {
        Log.warn("Active polygon not found in context. Polygon UUID:", editPolygon.uuid);
        Log.warn(
          "Available polygons:",
          sitePolygonDataV3.map(p => ({ uuid: p.uuid, polygonUuid: p.polygonUuid, name: p.name }))
        );
      }
    }
  }, [sitePolygonDataV3, editPolygon.uuid]);

  useEffect(() => {
    if (polygonData) {
      const isV3 = "polygonUuid" in polygonData;

      if (isV3) {
        const v3Data = polygonData as SitePolygonLightDto;
        setPolygonName(v3Data.name ?? "");
        setPlantStartDate(v3Data.plantStart ?? "");
        setTreesPlanted(v3Data.numTrees ?? 0);
        setCalculatedArea(v3Data.calcArea ?? 0);

        setRestorationPractice(v3Data.practice ?? []);
        setTreeDistribution(v3Data.distr ?? []);

        const targetSysArray = v3Data.targetSys ? v3Data.targetSys.split(",").map(item => item.trim()) : [];
        setTargetLandUseSystem(targetSysArray);
      } else {
        const v2Data = polygonData as SitePolygon;
        setPolygonName(v2Data.poly_name);
        setPlantStartDate(v2Data.plantstart);
        setTreesPlanted(v2Data.num_trees ?? 0);
        setCalculatedArea(v2Data.calc_area ?? 0);

        const restorationPracticeArray = v2Data?.practice
          ? (v2Data.practice as unknown as string[]).map(function (item: string) {
              return item.trim();
            })
          : [];
        setRestorationPractice(restorationPracticeArray);

        const targetLandUseSystemArray = v2Data?.target_sys
          ? v2Data.target_sys.split(",").map(function (item: string) {
              return item.trim();
            })
          : [];
        setTargetLandUseSystem(targetLandUseSystemArray);

        const treeDistributionArray = v2Data?.distr
          ? (v2Data.distr as unknown as string[]).map(function (item: string) {
              return item.trim();
            })
          : [];
        setTreeDistribution(treeDistributionArray);
      }
    }
  }, [polygonData]);

  useEffect(() => {
    const format =
      calculatedArea?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "";
    setFormattedArea(format ?? "");
  }, [calculatedArea]);

  const savePolygonData = async () => {
    const isV3 = polygonData && "polygonUuid" in polygonData;
    const primaryUuid = isV3
      ? (polygonData as SitePolygonLightDto).primaryUuid
      : (polygonData as SitePolygon)?.primary_uuid;
    const polygonUuidForCache = isV3
      ? (polygonData as SitePolygonLightDto).polygonUuid
      : (polygonData as SitePolygon)?.poly_id;

    if (!primaryUuid) {
      openNotification("error", t("Error!"), t("Missing polygon information"));
      return;
    }

    try {
      await createVersionWithAttributes(primaryUuid, "Updated polygon attributes", {
        polyName: polygonName,
        plantStart: plantStartDate,
        practice: restorationPractice,
        targetSys: targetLandUseSystem.join(", "),
        distr: treeDistribution,
        numTrees: treesPlanted
      });

      if (polygonUuidForCache) {
        ApiSlice.pruneCache("sitePolygons", [polygonUuidForCache]);
      }

      setShouldRefetchPolygonData(true);
      openNotification("success", t("Success!"), t("Polygon version created successfully"));
    } catch (error) {
      Log.error("Error creating polygon version:", error);
      openNotification("error", t("Error!"), t("Error creating polygon version"));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={t("Polygon Name")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Polygon Name")}
        type="text"
        name=""
        value={polygonName}
        onChangeCapture={e => setPolygonName((e.target as HTMLInputElement).value)}
      />
      <label className="flex flex-col gap-2">
        <Text variant="text-14-light" className="text-white">
          {t("Plant Start Date")}
        </Text>
        <input
          type="date"
          lang="en-GB"
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder={t("Input Plant Start Date")}
          value={plantStartDate}
          onChange={e => setPlantStartDate(e.target.value)}
        />
      </label>
      <Dropdown
        multiSelect
        label={t("Restoration Practice")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Restoration Practice")}
        options={translatedRestorationOptions}
        value={restorationPractice}
        onChange={e => setRestorationPractice(e as string[])}
        className="bg-white"
      />
      <Dropdown
        label={t("Target Land Use System")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Target Land Use System")}
        options={translatedTargetOptions}
        value={targetLandUseSystem}
        onChange={e => setTargetLandUseSystem(e as string[])}
        className="bg-white"
      />
      <Dropdown
        multiSelect
        label={t("Tree Distribution")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Tree Distribution")}
        options={translatedTreeOptions}
        value={treeDistribution}
        onChange={e => setTreeDistribution(e as string[])}
        className="bg-white"
      />
      <Input
        label={t("Trees Planted")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Trees Planted")}
        type="number"
        format="number"
        name=""
        value={treesPlanted}
        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => setTreesPlanted(Number(e.target.value))}
      />
      <Input
        label={t("Estimated Area")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Estimated Area")}
        type="text"
        name=""
        value={formattedArea + " ha"}
        readOnly
      />
      <div className="mt-auto flex items-center justify-end gap-5">
        <Button variant="semi-red" className="w-full" onClick={handleClose}>
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
