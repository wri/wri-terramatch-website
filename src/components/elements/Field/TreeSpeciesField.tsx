import { DetailedHTMLProps, HTMLAttributes } from "react";

import GenericField from "@/components/elements/Field/GenericField";
import TreeSpeciesTable, { TreeSpeciesTableProps } from "@/components/extensive/Tables/TreeSpeciesTable";

export interface TreeSpeciesFieldProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    TreeSpeciesTableProps {
  label: string;
}

const TreeSpeciesField = ({ children, modelName, modelUUID, collection, onFetch, ...rest }: TreeSpeciesFieldProps) => {
  return (
    <GenericField {...rest}>
      <TreeSpeciesTable {...{ modelName, modelUUID, collection, onFetch }} />
    </GenericField>
  );
};

export default TreeSpeciesField;
