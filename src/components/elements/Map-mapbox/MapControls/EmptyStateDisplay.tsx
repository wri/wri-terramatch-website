import { useT } from "@transifex/react";

import Text from "../../Text/Text";

const EmptyStateDisplay = () => {
  const t = useT();
  return (
    <div className="grid gap-2" id="emptystatedisplay">
      <div className="rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
        <Text variant="text-10-light">{t("Polygons have not been created for this site")}</Text>
      </div>
    </div>
  );
};

export default EmptyStateDisplay;
