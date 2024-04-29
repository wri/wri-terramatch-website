import { useEffect, useState } from "react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
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
    value: 1
  },
  {
    title: "Partial",
    value: 2
  },
  {
    title: "Full",
    value: 3
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
  const [estimatedArea, setEstimatedArea] = useState<number>(selectedPolygon?.est_area || 0);

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
        type="number"
        format="number"
        name=""
        value={estimatedArea}
        onChangeCapture={e => setEstimatedArea(Number((e.target as HTMLInputElement).value))}
      />
    </div>
  );
};

export default AttributeInformation;
