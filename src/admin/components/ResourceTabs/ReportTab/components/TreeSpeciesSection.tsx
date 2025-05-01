import { FC } from "react";

import { TreeSpeciesDto } from "@/generated/v3/entityService/entityServiceSchemas";

import AggregatedTreeSpeciesTable from "../AggregatedTreeSpeciesTable";
import { Site } from "../types";

interface TreeSpeciesSectionProps {
  sites: Site[];
  plants: TreeSpeciesDto[];
}

const TreeSpeciesSection: FC<TreeSpeciesSectionProps> = ({ sites, plants }) => {
  return (
    <div className="print-page-break section-container col-span-2 pt-6">
      <AggregatedTreeSpeciesTable sites={sites} goalPlants={plants} />
    </div>
  );
};

export default TreeSpeciesSection;
