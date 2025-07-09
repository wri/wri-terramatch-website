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

  return (
    <div className="flex flex-col justify-center gap-1 rounded-lg p-5 shadow-all">
      <Text variant="text-16-bold" className="text-blueCustom-900">
        {title}
      </Text>
      <Text variant="text-40-bold" className="text-blueCustom">
        {formatData(data)}
      </Text>
      <Text variant="text-16-light" className="text-blueCustom-900">
        {description}
      </Text>
    </div>
  );
};

export default CardFinancial;
