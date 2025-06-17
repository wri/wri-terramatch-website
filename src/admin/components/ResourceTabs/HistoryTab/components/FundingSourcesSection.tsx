import { FC } from "react";

import Toggle from "@/components/elements/Toggle/Toggle";
import { TogglePropsItem } from "@/components/elements/Toggle/Toggle";
import { VARIANT_TOGGLE_SECONDARY } from "@/components/elements/Toggle/ToggleVariants";

interface IProps {
  items: TogglePropsItem[];
}

const FundingSourcesSection: FC<IProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4">
      <Toggle variant={VARIANT_TOGGLE_SECONDARY} items={items} />
      <div>Table</div>
    </div>
  );
};

export default FundingSourcesSection;
