import { memo } from "react";

import { usePolygonRowHovered, usePolygonRowSelected } from "@/context/polygonTableInteraction.store";

import { usePolygonTableInteractionActions } from "./polygonTableInteractionContext";
import { type PolygonTableRow, PolygonRow } from "./PolygonTableRow";

type PolygonTableRowConnectedProps = {
  row: PolygonTableRow;
  rowProps?: Record<string, unknown>;
};

export const PolygonTableRowConnected = memo(function PolygonTableRowConnected({
  row,
  rowProps
}: PolygonTableRowConnectedProps) {
  const isSelected = usePolygonRowSelected(row.id);
  const isHovered = usePolygonRowHovered(row.id);
  const { onHover, onSelectChange } = usePolygonTableInteractionActions();

  return (
    <PolygonRow
      row={row}
      rowProps={rowProps}
      isSelected={isSelected}
      isHovered={isHovered}
      onHover={onHover}
      onSelectChange={onSelectChange}
    />
  );
});

export const renderPolygonTableRow = (row: PolygonTableRow, rowProps?: Record<string, unknown>) => (
  <PolygonTableRowConnected row={row} rowProps={rowProps} />
);
