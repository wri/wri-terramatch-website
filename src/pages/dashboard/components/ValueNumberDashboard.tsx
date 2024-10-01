import { useT } from "@transifex/react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

export interface ValueNumberDashboardProps {
  value: string;
  unit?: string;
}

const ValueNumberDashboard = ({ value, unit }: ValueNumberDashboardProps) => {
  const t = useT();

  return (
    <div className="flex items-baseline">
      <Text variant="text-32-bold" className="text-blueCustom">
        {t(value)}
      </Text>
      <Text variant="text-32-bold" className="text-blueCustom">
        {t(unit)}
      </Text>
      <When condition={unit}>
        <Text variant="text-20" className="ml-2 text-darkCustom opacity-50">
          {t("out of 20M")}
        </Text>
      </When>
    </div>
  );
};

export default ValueNumberDashboard;
