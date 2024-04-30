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
  const [polygonName, setPolygonName] = useState(selectedPolygon?.poly_name);
  const [plantStartDate, setPlantStartDate] = useState(selectedPolygon?.plantstart);
  const [plantEndDate, setPlantEndDate] = useState(selectedPolygon?.plantend);
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState(selectedPolygon?.num_trees);
  const [estimatedArea] = useState<number>(selectedPolygon?.est_area || 0);
  const t = useT();
  const { setIsPolygonDataUpdated } = useSitePolygonData();

  useEffect(() => {
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
        num_trees: treesPlanted,
        est_area: estimatedArea
      };
      await fetchPutV2TerrafundSitePolygonUuid({
        body: updatedPolygonData,
        pathParams: { uuid: selectedPolygon.uuid }
      });
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
        label="Estimated Area"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Input Estimated Area"
        type="text"
        format="number"
        disabled
        name=""
        value={estimatedArea.toFixed(2) + " ha"}
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
            setIsPolygonDataUpdated(true);
          }}
        >
          {t("Save")}
        </Button>
      </div>
    </div>
  );
};

export default AttributeInformation;
