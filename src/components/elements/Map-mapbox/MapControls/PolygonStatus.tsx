import Dropdown from "../../Inputs/Dropdown/Dropdown";
import Text from "../../Text/Text";

const dropdownOptions = [
  {
    title: "Site Approved",
    value: 1
  },
  {
    title: "Polygons Submitted",
    value: 2
  }
];
const PolygonStatus = () => {
  return (
    <div className="flex h-fit flex-col gap-1 rounded-lg bg-white p-3 shadow">
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
