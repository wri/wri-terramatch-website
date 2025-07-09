import { ReactNode } from "react";

import Text from "@/components/elements/Text/Text";
import { currencyInput, formatLargeNumber } from "@/utils/financialReport";

type CardFinancialProps = {
  title: string;
  data: string | ReactNode;
  description: string;
  currency?: string;
};

const CardFinancial = ({ title, data, description, currency }: CardFinancialProps) => {
  const formatData = (dataValue: string | ReactNode): string => {
    if (typeof dataValue !== "string") {
      return String(dataValue);
    }

    if (dataValue.startsWith("+") || dataValue.startsWith("-") || dataValue === "0") {
      const currencySymbol = currency ? currencyInput[currency] || "" : "";

      if (dataValue === "0") {
        return `${currencySymbol}0`;
      }

      const isPositive = dataValue.startsWith("+");
      const numericValue = parseFloat(dataValue.replace(/^[+-]/, ""));

      if (isNaN(numericValue)) {
        return dataValue;
      }

      const formattedNumber = formatLargeNumber(Math.abs(numericValue), currencySymbol);
      const sign = isPositive ? "" : "-";

      return `${sign}${formattedNumber}`;
    }

    return dataValue;
  };

  const formattedValue = formatData(data);

  return (
    <div className="flex flex-col justify-center gap-1 rounded-lg p-5 shadow-all">
      <Text variant="text-16-bold" className="truncate text-blueCustom-900" title={title}>
        {title}
      </Text>
      <Text variant="text-40-bold" className="truncate text-blueCustom" title={formattedValue}>
        {formattedValue}
      </Text>
      <Text variant="text-16-light" className="truncate text-blueCustom-900" title={description}>
        {description}
      </Text>
    </div>
  );
};

export default CardFinancial;
