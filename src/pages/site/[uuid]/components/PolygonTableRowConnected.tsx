import { memo } from "react";

import { usePolygonRowHovered, usePolygonRowSelected } from "@/context/polygonTableInteraction.store";

import { usePolygonTableInteractionActions } from "./polygonTableInteractionContext";
import { type PolygonTableRow, PolygonRow } from "./PolygonTableRow";

type PolygonTableRowConnectedProps = {
  row: PolygonTableRow;
  rowProps?: Record<string, unknown>;
  readOnly?: boolean;
};

export const PolygonTableRowConnected = memo(function PolygonTableRowConnected({
  row,
  rowProps,
  readOnly = false
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
      readOnly={readOnly}
    />
  );
});

export const renderPolygonTableRow =
  (readOnly: boolean) => (row: PolygonTableRow, rowProps?: Record<string, unknown>) =>
    <PolygonTableRowConnected row={row} rowProps={rowProps} readOnly={readOnly} />;

export default PolygonTableRowConnected;
