import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";

export interface ValueNumberDashboardProps {
  value: number;
  type: string;
}

const ValueNumberDashboard = ({ value, type }: ValueNumberDashboardProps) => {
  const t = useT();

  return (
    <div>
      <Text variant="text-32-bold" className="text-darkCustom">
        {value}
      </Text>
      <Text variant="text-32-bold" className="">
        {type}
      </Text>
      <Text variant="text-20" className="">
        {t("out of 20M")}
      </Text>
    </div>
  );
};

export default ValueNumberDashboard;
