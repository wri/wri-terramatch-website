import { memo } from "react";

import { usePolygonRowHovered, usePolygonRowSelected } from "@/context/polygonTableInteraction.store";
import type { TableRenderRowContext } from "@/redesignComponents/dataDisplay/Table/Table";

import { usePolygonTableInteractionActions } from "./polygonTableInteractionContext";
import { type PolygonTableRow, PolygonRow } from "./PolygonTableRow";

type PolygonTableRowConnectedProps = {
  row: PolygonTableRow;
  context?: TableRenderRowContext;
};

export const PolygonTableRowConnected = memo(function PolygonTableRowConnected({
  row,
  context
}: PolygonTableRowConnectedProps) {
  const isSelected = usePolygonRowSelected(row.id);
  const isHovered = usePolygonRowHovered(row.id);
  const { onHover, onSelectChange } = usePolygonTableInteractionActions();

  return (
    <PolygonRow
      row={row}
      context={context}
      isSelected={isSelected}
      isHovered={isHovered}
      onHover={onHover}
      onSelectChange={onSelectChange}
    />
  );
});

export const renderPolygonTableRow = (row: PolygonTableRow, context?: TableRenderRowContext) => (
  <PolygonTableRowConnected row={row} context={context} />
);

export default PolygonTableRowConnected;
