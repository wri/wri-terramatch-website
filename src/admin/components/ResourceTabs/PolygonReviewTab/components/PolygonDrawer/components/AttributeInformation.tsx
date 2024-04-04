import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Text from "@/components/elements/Text/Text";

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
      <div className="flex h-fit flex-col gap-1">
        <Text variant="text-14-light" className="opacity-60">
          Polygon ID
        </Text>
        <Dropdown
          placeholder="Planting Complete"
          options={dropdownOptions}
          value={["Planting Complete"]}
          onChange={() => {}}
        />
      </div>
      <div className="flex h-fit flex-col gap-1">
        <Text variant="text-14-light" className="opacity-60">
          Restoration Practice*
        </Text>
        <Dropdown
          placeholder="Planting Complete"
          options={dropdownOptions}
          value={["Planting Complete"]}
          onChange={() => {}}
        />
      </div>
      <div className="flex h-fit flex-col gap-1">
        <Text variant="text-14-light" className="opacity-60">
          Target Land Use System
        </Text>
        <Dropdown
          placeholder="Planting Complete"
          options={dropdownOptions}
          value={["Planting Complete"]}
          onChange={() => {}}
        />
      </div>
      <div className="flex h-fit flex-col gap-1">
        <Text variant="text-14-light" className="opacity-60">
          Tree Distribution
        </Text>
        <Dropdown
          placeholder="Planting Complete"
          options={dropdownOptions}
          value={["Planting Complete"]}
          onChange={() => {}}
        />
      </div>
      <div className="flex h-fit flex-col gap-1">
        <Text variant="text-14-light" className="opacity-60">
          Source
        </Text>
        <Dropdown
          placeholder="Planting Complete"
          options={dropdownOptions}
          value={["Planting Complete"]}
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default AttributeInformation;
