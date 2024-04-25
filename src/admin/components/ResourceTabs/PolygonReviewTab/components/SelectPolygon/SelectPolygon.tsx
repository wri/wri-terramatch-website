import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Text from "@/components/elements/Text/Text";
import { toArray } from "@/utils/array";

const dropdownPolygonOptions = [
  {
    title: "Aerobic Agroforestry",
    value: "1",
    meta: "Approved"
  },
  {
    title: "Mexico_FONCET_ANP_FRAILESCAN",
    value: "2",
    meta: "Submitted"
  },
  {
    title: "Philippines_CI_Philippines",
    value: "3",
    meta: "Submitted"
  },
  {
    title: "Portugal_ReForest_Action_(Proenca-a-Nova)",
    value: "4",
    meta: "Needs More Info"
  },
  {
    title: "Spain_ReForest_Action_(Palencia)",
    value: "5",
    meta: "Approved"
  }
];

const SelectPolygon = () => {
  return (
    <div className="flex h-fit flex-col gap-2">
      <Text variant="text-16-bold">Select Polygon</Text>
      <Dropdown
        optionsClassName="max-w-full"
        defaultValue={toArray(dropdownPolygonOptions[0].value)}
        placeholder="Select Polygon"
        options={dropdownPolygonOptions}
        onChange={() => {}}
      />
    </div>
  );
};

export default SelectPolygon;
