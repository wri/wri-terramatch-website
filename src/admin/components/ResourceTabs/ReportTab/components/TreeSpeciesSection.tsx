import { Typography } from "@mui/material";
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
    <div className="print-page-break section-container">
      <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
        Tree Species Analysis
      </Typography>
      <AggregatedTreeSpeciesTable sites={sites} goalPlants={plants} />
    </div>
  );
};

export default TreeSpeciesSection;
