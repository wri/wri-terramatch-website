import { useT } from "@transifex/react";
import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import { formatNumberUS } from "@/utils/dashboardUtils";

export interface ValueNumberDashboardProps {
  value: number;
  unit?: string;
  totalValue?: number;
}

const ValueNumberDashboard: FC<ValueNumberDashboardProps> = ({ value, unit, totalValue }) => {
  const t = useT();

  return (
    <div className="flex items-baseline">
      <Text variant="text-32-bold" className="text-blueCustom">
        {value === 0 ? "-" : formatNumberUS(value)}
      </Text>
      <Text variant="text-32-bold" className="text-blueCustom">
        {t(unit)}
      </Text>
      {totalValue != null && totalValue > 0 && (
        <Text variant="text-20" className="ml-2 text-darkCustom opacity-50">
          {t("out of {totalValue}{unit}", { totalValue: formatNumberUS(totalValue), unit: t(unit) })}
        </Text>
      )}
    </div>
  );
};

export default ValueNumberDashboard;
