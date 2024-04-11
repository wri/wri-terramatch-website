import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";

const dropdownOptions = [
  {
    title: "All Polygons",
    value: 1
  },
  {
    title: "All Polygons2",
    value: 2
  }
];
const AttributeInformation = () => {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Polygon ID"
        labelClassname="capitalize"
        labelVariant="text-14-light"
        placeholder="Planting Complete"
        type="text"
        name=""
      />
      <Dropdown
        label="Restoration Practice*"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Planting Complete"
        options={dropdownOptions}
        value={["Planting Complete"]}
        onChange={() => {}}
      />
      <Dropdown
        label="Target Land Use System"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Planting Complete"
        options={dropdownOptions}
        value={["Planting Complete"]}
        onChange={() => {}}
      />
      <Dropdown
        label="Tree Distribution"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Planting Complete"
        options={dropdownOptions}
        value={["Planting Complete"]}
        onChange={() => {}}
      />
      <Dropdown
        label="Source"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Planting Complete"
        options={dropdownOptions}
        value={["Planting Complete"]}
        onChange={() => {}}
      />
    </div>
  );
};

export default AttributeInformation;
