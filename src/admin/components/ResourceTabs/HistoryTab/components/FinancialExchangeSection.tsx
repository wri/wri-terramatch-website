import { FC } from "react";

import FinancialExchangeItem from "./FinancialExchangeItem";

interface IProps {
  items: { label: string; exchangeRate: number }[];
}

const FinancialExchangeSection: FC<IProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4">
      {items?.map(({ label, exchangeRate }) => (
        <FinancialExchangeItem key={label} label={label} exchangeRate={exchangeRate} />
      ))}
    </div>
  );
};

export default FinancialExchangeSection;
