import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { usePutV2TerrafundSitePolygonUuid } from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

const dropdownOptionsRestoration = [
  {
    title: "Tree Planting",
    value: "tree-planting"
  },
  {
    title: "Direct Seeding",
    value: "direct-seeding"
  },
  {
    title: "Assisted Natural Regeneration",
    value: "assisted-natural-regeneration"
  }
];
const dropdownOptionsTarget = [
  {
    title: "Agroforest",
    value: "agroforest"
  },
  {
    title: "Natural Forest",
    value: "natural-forest"
  },
  {
    title: "Mangrove",
    value: "mangrove"
  },
  {
    title: "Peatland",
    value: "peatland"
  },
  {
    title: "Riparian Area or Wetland",
    value: "riparian-area-or-wetland"
  },
  {
    title: "Silvopasture",
    value: "silvopasture"
  },
  {
    title: "Woodlot or Plantation",
    value: "woodlot-or-plantation"
  },
  {
    title: "Urban Forest",
    value: "urban-forest"
  }
];

const dropdownOptionsTree = [
  {
    title: "Single Line",
    value: "single-line"
  },
  {
    title: "Partial",
    value: "partial"
  },
  {
    title: "Full Coverage",
    value: "full"
  }
];
const AttributeInformation = ({ selectedPolygon }: { selectedPolygon: SitePolygon }) => {
  const [polygonName, setPolygonName] = useState<string>();
  const [plantStartDate, setPlantStartDate] = useState<string>();
  const [plantEndDate, setPlantEndDate] = useState<string>();
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState(selectedPolygon?.num_trees);
  const [calculatedArea, setCalculatedArea] = useState<number>(selectedPolygon?.calc_area ?? 0);
  const [formattedArea, setFormattedArea] = useState<string>();
  const contextSite = useSitePolygonData();
  const reloadSiteData = contextSite?.reloadSiteData;
  const { mutate: sendSiteData } = usePutV2TerrafundSitePolygonUuid();
  const contextMapArea = useMapAreaContext();
  const { setpolygonNotificationStatus } = contextMapArea;
  const t = useT();

  useEffect(() => {
    setPolygonName(selectedPolygon?.poly_name ?? "");
    setPlantStartDate(selectedPolygon?.plantstart ?? "");
    setPlantEndDate(selectedPolygon?.plantend ?? "");
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

  const displayNotification = (message: string, type: "success" | "error" | "warning", title: string) => {
    setpolygonNotificationStatus({
      open: true,
      message,
      type,
      title
    });
    setTimeout(() => {
      setpolygonNotificationStatus({
        open: false,
        message: "",
        type: "success",
        title: ""
      });
    }, 3000);
  };

  const savePolygonData = async () => {
    if (selectedPolygon?.uuid) {
      const restorationPracticeToSend = restorationPractice.join(", ");
      const landUseSystemToSend = targetLandUseSystem.join(", ");
      const treeDistributionToSend = treeDistribution.join(", ");
      const updatedPolygonData = {
        poly_name: polygonName,
        plantstart: plantStartDate,
        plantend: plantEndDate,
        practice: restorationPracticeToSend,
        target_sys: landUseSystemToSend,
        distr: treeDistributionToSend,
        num_trees: treesPlanted
      };
      try {
        sendSiteData(
          {
            body: updatedPolygonData,
            pathParams: { uuid: selectedPolygon.uuid }
          },
          {
            onSuccess: () => {
              reloadSiteData?.();
              displayNotification(t("Polygon data updated successfully"), "success", t("Success!"));
            },
            onError: error => {
              displayNotification(t("Error updating polygon data"), "error", t("Error!"));
            }
          }
        );
      } catch (error) {
        console.error("Error updating polygon data:", error);
      }
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
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder="Input Plant Start Date"
          value={plantStartDate}
          onChange={e => setPlantStartDate(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-2">
        <Text variant="text-14-light">Plant End Date</Text>
        <input
          type="date"
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder="Input Plant Start Date"
          value={plantEndDate}
          onChange={e => setPlantEndDate(e.target.value)}
        />
      </label>
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
      <Input
        label="Trees Planted"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Input Trees Planted"
        type="text"
        format="number"
        name=""
        value={treesPlanted}
        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => setTreesPlanted(Number(e.target.value))}
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
        <Button variant="semi-red" className="w-full">
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
