import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { fetchPutV2TerrafundSitePolygonUuid, useGetV2TerrafundPolygonUuid } from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

import Text from "../Text/Text";

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

const AttributeInformation = () => {
  const t = useT();
  const { editPolygon } = useMapAreaContext();
  const [polygonData, setPolygonData] = useState<SitePolygon>();
  const [polygonName, setPolygonName] = useState<string>();
  const [plantStartDate, setPlantStartDate] = useState<string>();
  const [plantEndDate, setPlantEndDate] = useState<string>();
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState<number>(0);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);
  const [formattedArea, setFormattedArea] = useState<string>();
  const { data: sitePolygonData } = useGetV2TerrafundPolygonUuid<{
    site_polygon: SitePolygon;
  }>({
    pathParams: {
      uuid: editPolygon.uuid ?? ""
    }
  });

  useEffect(() => {
    if (sitePolygonData) {
      setPolygonData(sitePolygonData?.site_polygon);
    }
  }, [sitePolygonData]);

  useEffect(() => {
    if (polygonData) {
      setPolygonName(polygonData.poly_name);
      setPlantStartDate(polygonData.plantstart);
      setPlantEndDate(polygonData.plantend);
      setTreesPlanted(polygonData.num_trees ?? 0);
      setCalculatedArea(polygonData.calc_area ?? 0);
      const restorationPracticeArray = polygonData?.practice
        ? polygonData?.practice.split(",").map(function (item) {
            return item.trim();
          })
        : [];
      setRestorationPractice(restorationPracticeArray);

      const targetLandUseSystemArray = polygonData?.target_sys
        ? polygonData?.target_sys.split(",").map(function (item) {
            return item.trim();
          })
        : [];
      setTargetLandUseSystem(targetLandUseSystemArray);

      const treeDistributionArray = polygonData?.distr
        ? polygonData?.distr.split(",").map(function (item) {
            return item.trim();
          })
        : [];
      setTreeDistribution(treeDistributionArray);
    }
  }, [polygonData]);

  useEffect(() => {
    const format =
      calculatedArea?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "";
    setFormattedArea(format ?? "");
  }, [calculatedArea]);

  const savePolygonData = async () => {
    if (polygonData?.uuid) {
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
          pathParams: { uuid: polygonData.uuid }
        });
        // reloadSiteData?.();
      } catch (error) {
        console.error("Error updating polygon data:", error);
      }
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
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder={t("Input Plant Start Date")}
          value={plantStartDate}
          onChange={e => setPlantStartDate(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-2">
        <Text variant="text-14-light" className="text-white">
          {t("Plant End Date")}
        </Text>
        <input
          type="date"
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder={t("Input Plant Start Date")}
          value={plantEndDate}
          onChange={e => setPlantEndDate(e.target.value)}
        />
      </label>
      <Dropdown
        multiSelect
        label={t("Restoration Practice")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Restoration Practice")}
        options={dropdownOptionsRestoration}
        value={restorationPractice}
        onChange={e => setRestorationPractice(e as string[])}
        className="bg-white"
      />
      <Dropdown
        label={t("Target Land Use System")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Target Land Use System")}
        options={dropdownOptionsTarget}
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
        options={dropdownOptionsTree}
        value={treeDistribution}
        onChange={e => setTreeDistribution(e as string[])}
        className="bg-white"
      />
      <Input
        label={t("Trees Planted")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Trees Planted")}
        type="text"
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
