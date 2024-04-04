import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
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
const VersionHistory = () => {
  const t = useT();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-fit flex-col gap-1">
        <Text variant="text-14-light" className="opacity-60">
          Polygon Version
        </Text>
        <Dropdown
          placeholder="Planting Complete"
          options={dropdownOptions}
          value={["Planting Complete"]}
          onChange={() => {}}
        />
      </div>
      <div className="mt-auto flex items-center justify-end gap-5">
        <Button variant="semi-red" className="w-full">
          {t("Delete")}
        </Button>
        <Button variant="semi-black" className="w-full">
          {t("Create")}
        </Button>
      </div>
    </div>
  );
};

export default VersionHistory;
