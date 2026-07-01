import { useT } from "@transifex/react";
import { FC } from "react";

import Text from "@/components/elements/Text/Text";

interface FinancialDescriptionsItemProps {
  label: string;
  description: string;
}

const FinancialDescriptionsItem: FC<FinancialDescriptionsItemProps> = ({ label, description }) => {
  const t = useT();
  return (
    <div className="flex flex-col gap-1">
      <Text variant="text-16-bold" className="text-blueCustom-900">
        {label}
      </Text>
      <Text variant="text-16-light" className="w-full text-left text-blueCustom-900">
        {description != "" ? description : t("None Available")}
      </Text>
    </div>
  );
};

export default FinancialDescriptionsItem;
