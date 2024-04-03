import Dropdown from "../../Inputs/Dropdown/Dropdown";
import Text from "../../Text/Text";

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
const PolygonStatus = () => {
  return (
    <div className="flex h-fit flex-col gap-5 rounded-lg bg-white p-3 shadow">
      <Text variant="text-14-light" className="opacity-60">
        Polygon Status
      </Text>
      <Dropdown
        placeholder="Planting Complete"
        options={dropdownOptions}
        value={["Planting Complete"]}
        onChange={() => {}}
      />
    </div>
  );
};

export default PolygonStatus;
