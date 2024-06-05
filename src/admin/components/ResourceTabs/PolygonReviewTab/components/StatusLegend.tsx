import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";

const StatusLegend = () => {
  const t = useT();
  return (
    <div className="flex flex-col px-2">
      <Text variant="text-16-bold" className="text-darkCustom">
        {t("Status Legend")}
      </Text>
      <div>
        <Text variant="text-14-semibold" className="flex items-center gap-2 py-2 text-darkCustom">
          <div className="aspect-square h-3 w-3 rounded-sm bg-pinkCustom" /> {t("Status Legend")}
        </Text>
        <Text variant="text-14-semibold" className="flex items-center gap-2 py-2 text-darkCustom">
          <div className="aspect-square h-3 w-3 rounded-sm bg-blue" /> {t("Submitted")}
        </Text>
        <Text variant="text-14-semibold" className="flex items-center gap-2 py-2 text-darkCustom">
          <div className="aspect-square h-3 w-3 rounded-sm bg-green" /> {t("Approved")}
        </Text>
        <Text variant="text-14-semibold" className="flex items-center gap-2 py-2 text-darkCustom">
          <div className="aspect-square h-3 w-3 rounded-sm bg-tertiary-600" /> {t("Needs More Info")}
        </Text>
      </div>
    </div>
  );
};

export default StatusLegend;
