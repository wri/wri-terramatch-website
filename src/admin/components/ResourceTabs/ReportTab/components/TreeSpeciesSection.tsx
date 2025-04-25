import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import { TreeSpeciesDto } from "@/generated/v3/entityService/entityServiceSchemas";

import AggregatedTreeSpeciesTable from "../AggregatedTreeSpeciesTable";
import HeaderSecReportGemeration from "../HeaderSecReportGemeration";
import { Site } from "../types";

interface TreeSpeciesSectionProps {
  sites: Site[];
  plants: TreeSpeciesDto[];
}

const TreeSpeciesSection: FC<TreeSpeciesSectionProps> = ({ sites, plants }) => {
  return (
    <div className="print-page-break section-container col-span-2">
      <Text variant="text-12" className="mb-1 text-black">
        Showing Sites 1 - 3 (of 18)
      </Text>
      <HeaderSecReportGemeration title="Tree Species" />
      <AggregatedTreeSpeciesTable sites={sites} goalPlants={plants} />
    </div>
  );
};

export default TreeSpeciesSection;
