import { createIndexSelection } from "@/hooks/createIndexSelection";

import type { SiteIndexSite } from "./siteIndex.types";

const siteSelection = createIndexSelection<SiteIndexSite>(site => site.id);

const SiteIndexSelectionProvider = siteSelection.Provider;

export const useSiteIndexSelectionActions = () => {
  const { clearSelection, setItemSelected, setItemsSelected } = siteSelection.useSelectionActions();

  return { clearSelection, setSiteSelected: setItemSelected, setVisibleSitesSelected: setItemsSelected };
};

export const useSiteIndexSelectionState = () => {
  const { selectedItems, selectedCount, isSelected } = siteSelection.useSelectionState();

  return { selectedSites: selectedItems, selectedCount, isSiteSelected: isSelected };
};

export const useSiteTableSelection = (sites: SiteIndexSite[]) => {
  const { selectedRows, isSelected, handleRowSelected, handleAllItemsSelected } =
    siteSelection.useTableSelection(sites);

  return { selectedRows, isSiteSelected: isSelected, handleRowSelected, handleAllItemsSelected };
};

export default SiteIndexSelectionProvider;
