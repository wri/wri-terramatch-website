import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";

const dropdownOptionsRestoration = [
  {
    title: "Tree Planting",
    value: "1x"
  },
  {
    title: "Direct Seeding",
    value: "2x"
  },
  {
    title: "Assisted Natural Regeneration",
    value: "3x"
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
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Polygon Name"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Input Polygon Name"
        type="text"
        name=""
      />
      <label className="flex flex-col gap-2">
        <Text variant="text-14-light">Plant Start Date</Text>
        <input
          type="date"
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder="Input Plant Start Date"
        />
      </label>
      <label className="flex flex-col gap-2">
        <Text variant="text-14-light">Plant End Date</Text>
        <input
          type="date"
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder="Input Plant Start Date"
        />
      </label>
      <Dropdown
        label="Restoration Practice"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Select Restoration Practice"
        multiSelect
        onChange={() => {}}
        options={dropdownOptionsRestoration}
      />
      <Dropdown
        label="Target Land Use System"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Select Target Land Use System"
        options={dropdownOptionsTarget}
        onChange={() => {}}
      />
      <Dropdown
        multiSelect
        label="Tree Distribution"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Select Tree Distribution"
        options={dropdownOptionsTree}
        onChange={() => {}}
      />
      <Input
        label="Trees Planted"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Input Trees Planted"
        type="text"
        format="number"
        name=""
      />
      <Input
        label="Estimated Area"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Input Estimated Area"
        type="text"
        format="number"
        name=""
      />
    </div>
  );
};

export default AttributeInformation;
