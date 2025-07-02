import { FC } from "react";

import Text from "@/components/elements/Text/Text";

interface FinancialDescriptionsItemProps {
  label: string;
  description: string;
}

const FinancialDescriptionsItem: FC<FinancialDescriptionsItemProps> = ({ label, description }) => {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="text-16-bold" className="text-blueCustom-900">
        {label}
      </Text>
      <Text variant="text-16-light" className="w-full text-left text-blueCustom-900">
        {description ?? "N/A"}
      </Text>
    </div>
  );
};

export default FinancialDescriptionsItem;
