import { type PropsWithChildren, createContext, FC, useContext, useMemo } from "react";

import { setPolygonTableHoveredUuid } from "@/context/polygonTableInteraction.store";

import type { PolygonTableRow } from "./PolygonTableRow";

type PolygonTableInteractionActions = {
  onHover: (uuid: string | null) => void;
  onSelectChange: (row: PolygonTableRow, checked: boolean) => void;
};

const PolygonTableInteractionActionsContext = createContext<PolygonTableInteractionActions | null>(null);

export const PolygonTableInteractionActionsProvider: FC<
  PropsWithChildren<{
    onSelectChange: (row: PolygonTableRow, checked: boolean) => void;
  }>
> = ({ children, onSelectChange }) => {
  const value = useMemo(
    () => ({
      onHover: setPolygonTableHoveredUuid,
      onSelectChange
    }),
    [onSelectChange]
  );

  return (
    <PolygonTableInteractionActionsContext.Provider value={value}>
      {children}
    </PolygonTableInteractionActionsContext.Provider>
  );
};

export const usePolygonTableInteractionActions = () => {
  const context = useContext(PolygonTableInteractionActionsContext);
  if (context == null) {
    throw new Error("usePolygonTableInteractionActions must be used within PolygonTableInteractionActionsProvider");
  }
  return context;
};

export default PolygonTableInteractionActionsProvider;
