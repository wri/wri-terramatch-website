import { createIndexSelection } from "@/hooks/createIndexSelection";

import type { NurseryIndexRow } from "./nurseryIndex.types";

const nurserySelection = createIndexSelection<NurseryIndexRow>(nursery => nursery.id);

const NurseriesSelectionProvider = nurserySelection.Provider;

export const useNurseriesSelectionActions = () => {
  const { clearSelection, setItemSelected, setItemsSelected } = nurserySelection.useSelectionActions();

  return { clearSelection, setNurserySelected: setItemSelected, setVisibleNurseriesSelected: setItemsSelected };
};

export const useNurseriesSelectionState = () => {
  const { selectedItems, selectedCount } = nurserySelection.useSelectionState();

  return { selectedNurseries: selectedItems, selectedCount };
};

export const useNurseryTableSelection = (nurseries: NurseryIndexRow[]) => {
  const { selectedRows, isSelected, handleRowSelected, handleAllItemsSelected } =
    nurserySelection.useTableSelection(nurseries);

  return { selectedRows, isNurserySelected: isSelected, handleRowSelected, handleAllItemsSelected };
};

export default NurseriesSelectionProvider;
