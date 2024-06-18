import { useT } from "@transifex/react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";

import Text from "../Text/Text";

const dropdownOptionsRestoration = [
  {
    title: "Tree Planting",
    value: 1
  },
  {
    title: "Direct Seeding",
    value: 2
  },
  {
    title: "Assisted Natural Regeneration",
    value: 3
  }
];
const dropdownOptionsTarget = [
  {
    title: "Agroforest",
    value: 1
  },
  {
    title: "Natural Forest",
    value: 2
  },
  {
    title: "Mangrove",
    value: 3
  },
  {
    title: "Peatland",
    value: 4
  },
  {
    title: "Riparian Area or Wetland",
    value: 5
  },
  {
    title: "Silvopasture",
    value: 6
  },
  {
    title: "Woodlot or Plantation",
    value: 7
  },
  {
    title: "Urban Forest",
    value: 8
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
const AttributeInformation = () => {
  const t = useT();

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={t("Polygon Name")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Polygon Name")}
        type="text"
        name=""
      />
      <label className="flex flex-col gap-2">
        <Text variant="text-14-light" className="text-white">
          {t("Plant Start Date")}
        </Text>
        <input
          type="date"
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder={t("Input Plant Start Date")}
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
        />
      </label>
      <Dropdown
        multiSelect
        label={t("Restoration Practice")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Restoration Practice")}
        options={dropdownOptionsRestoration}
        value={[t("Planting Complete")]}
        onChange={() => {}}
        className="bg-white"
      />
      <Dropdown
        label={t("Target Land Use System")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Target Land Use System")}
        options={dropdownOptionsTarget}
        value={[t("Planting Complete")]}
        onChange={() => {}}
        className="bg-white"
      />
      <Dropdown
        multiSelect
        label={t("Tree Distribution")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Tree Distribution")}
        options={dropdownOptionsTree}
        value={[t("Planting Complete")]}
        onChange={() => {}}
        className="bg-white"
      />
      <Input
        label={t("Trees Planted")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Trees Planted")}
        type="text"
        name=""
      />
      <Input
        label={t("Estimated Area")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Estimated Area")}
        type="text"
        name=""
      />
    </div>
  );
};

export default AttributeInformation;
