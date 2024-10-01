import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";

const TooltipGraphicDashboard = () => {
  const t = useT();

  return (
    <div>
      <Text variant="text-8-bold" className="text-darkCustom">
        {t("Number of Trees in 2024")}
      </Text>
    </div>
  );
};
export default TooltipGraphicDashboard;
