import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";

const dropdownOptions = [
  {
    title: "1213023412",
    value: 1
  },
  {
    title: "1213023414",
    value: 2
  }
];
const VersionHistory = () => {
  const t = useT();
  return (
    <div className="flex flex-col gap-4">
      <Dropdown
        label="Polygon Version"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        placeholder="Planting Complete"
        options={dropdownOptions}
        defaultValue={[1]}
        onChange={() => {}}
      />
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
