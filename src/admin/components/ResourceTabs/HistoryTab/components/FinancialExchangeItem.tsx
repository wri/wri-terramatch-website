import { FC } from "react";

import Text from "@/components/elements/Text/Text";

interface FinancialExchangeItemProps {
  label: string;
  exchangeRate: number;
}

const FinancialExchangeItem: FC<FinancialExchangeItemProps> = ({ label, exchangeRate }) => {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="text-16-bold" className="text-blueCustom-900">
        {label}
      </Text>
      <Text variant="text-16-light" className="w-full text-left text-blueCustom-900">
        {exchangeRate ?? "None Available"}
      </Text>
    </div>
  );
};

export default FinancialExchangeItem;
