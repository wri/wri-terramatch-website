import { memo } from "react";

import { usePolygonRowSelected } from "@/context/polygonTableInteraction.store";
import type { TableRenderRowContext } from "@/redesignComponents/dataDisplay/Table/Table";

import { usePolygonTableInteractionActions } from "./polygonTableInteractionContext";
import { type PolygonTableRow, PolygonRow } from "./PolygonTableRow";

type PolygonTableRowConnectedProps = {
  row: PolygonTableRow;
  context?: TableRenderRowContext;
  readOnly?: boolean;
};

export const PolygonTableRowConnected = memo(function PolygonTableRowConnected({
  row,
  context,
  readOnly = false
}: PolygonTableRowConnectedProps) {
  const isSelected = usePolygonRowSelected(row.id);
  const { onHover, onSelectChange } = usePolygonTableInteractionActions();

  return (
    <PolygonRow
      row={row}
      context={context}
      isSelected={isSelected}
      onHover={onHover}
      onSelectChange={onSelectChange}
      readOnly={readOnly}
    />
  );
});

export const renderPolygonTableRow = (readOnly: boolean) => (row: PolygonTableRow, context?: TableRenderRowContext) =>
  <PolygonTableRowConnected row={row} context={context} readOnly={readOnly} />;

export default PolygonTableRowConnected;
