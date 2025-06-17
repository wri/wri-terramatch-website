import { FC } from "react";

import FinancialDescriptionsItem from "./FinancialDescriptionsItem";

interface IProps {
  items: { label: string; description: string }[];
}

const FinancialDescriptionsSection: FC<IProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map(({ label, description }) => (
        <FinancialDescriptionsItem key={label} label={label} description={description} />
      ))}
    </div>
  );
};

export default FinancialDescriptionsSection;
