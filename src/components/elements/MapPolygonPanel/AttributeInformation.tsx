import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";

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
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Polygon Name"
        labelClassname="capitalize text-white"
        labelVariant="text-14-light"
        placeholder="Input Polygon Name"
        type="text"
        name=""
      />
      <TextArea
        label="Plant Start Date"
        labelClassname="capitalize text-white"
        labelVariant="text-14-light"
        placeholder="Input Plant Start Date"
        className="max-h-72 !min-h-0 resize-none"
        name=""
        containerClassName="w-full"
        rows={1}
      />
      <TextArea
        label="Plant End Date"
        labelClassname="capitalize text-white"
        labelVariant="text-14-light"
        className="max-h-72 !min-h-0 resize-none"
        placeholder="Input Plant Start Date"
        name=""
        containerClassName="w-full"
        rows={1}
      />
      <Dropdown
        label="Restoration Practice*"
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder="Select Restoration Practice"
        options={dropdownOptionsRestoration}
        value={["Planting Complete"]}
        onChange={() => {}}
        className="bg-white"
      />
      <Dropdown
        label="Target Land Use System"
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder="Select Target Land Use System"
        options={dropdownOptionsTarget}
        value={["Planting Complete"]}
        onChange={() => {}}
        className="bg-white"
      />
      <Dropdown
        label="Tree Distribution"
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder="Select Tree Distribution"
        options={dropdownOptionsTree}
        value={["Planting Complete"]}
        onChange={() => {}}
        className="bg-white"
      />
      <Input
        label="Trees Planted"
        labelClassname="capitalize text-white"
        labelVariant="text-14-light"
        placeholder="Input Trees Planted"
        type="text"
        name=""
      />
      <Input
        label="Estimated Area"
        labelClassname="capitalize text-white"
        labelVariant="text-14-light"
        placeholder="Input Estimated Area"
        type="text"
        name=""
      />
    </div>
  );
};

export default AttributeInformation;
