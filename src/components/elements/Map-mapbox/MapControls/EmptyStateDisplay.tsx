import { useT } from "@transifex/react";

import Text from "../../Text/Text";

const EmptyStateDisplay = () => {
  const t = useT();
  return (
    <div className="absolute left-[56%] top-[43%] z-30 grid gap-2" id="emptystatedisplay">
      <div className="rounded-lg bg-[#ffffff26] py-3 px-11 text-center text-white backdrop-blur-md">
        <Text variant="text-10-light">
          {t("Polygons have not been")}
          <br />
          {t("created for this site")}
        </Text>
      </div>
    </div>
  );
};

export default EmptyStateDisplay;
