import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { fetchPutV2TerrafundSitePolygonUuid } from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

const dropdownOptionsRestoration = [
  {
    title: "Tree Planting",
    value: "Tree Planting"
  },
  {
    title: "Direct Seeding",
    value: "Direct Seeding"
  },
  {
    title: "Assisted Natural Regeneration",
    value: "Assisted Natural Regeneration"
  }
];
const dropdownOptionsTarget = [
  {
    title: "Agroforest",
    value: "Agroforest"
  },
  {
    title: "Natural Forest",
    value: "Natural Forest"
  },
  {
    title: "Mangrove",
    value: "Mangrove"
  },
  {
    title: "Peatland",
    value: "Peatland"
  },
  {
    title: "Riparian Area or Wetland",
    value: "Riparian Area or Wetland"
  },
  {
    title: "Silvopasture",
    value: "Silvopasture"
  },
  {
    title: "Woodlot or Plantation",
    value: "Woodlot or Plantation"
  },
  {
    title: "Urban Forest",
    value: "Urban Forest"
  }
];

const dropdownOptionsTree = [
  {
    title: "Single Line",
    value: "Single Line"
  },
  {
    title: "Partial",
    value: "Partial"
  },
  {
    title: "Full Coverage",
    value: "Full Coverage"
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
      calculatedArea !== null && calculatedArea !== undefined
        ? calculatedArea.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "";
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
        plantend: plantEndDate,
        practice: restorationPracticeToSend,
        target_sys: landUseSystemToSend,
        distr: treeDistributionToSend,
        num_trees: treesPlanted
      };
      try {
        await fetchPutV2TerrafundSitePolygonUuid({
          body: updatedPolygonData,
          pathParams: { uuid: selectedPolygon.uuid }
        });
        reloadSiteData?.();
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
