import DownloadIcon from "@mui/icons-material/GetApp";
import { Button, FilterButton, TopToolbar, useListContext } from "react-admin";

import { useOnMount } from "@/hooks/useOnMount";

interface ListActionsProps {
  onExport?: () => void;
}

export const AutoResetSort = () => {
  const { setSort } = useListContext();

  useOnMount(() => {
    setSort({ field: "", order: "ASC" });
  });

  return null;
};

const ListActions = (props: ListActionsProps) => (
  <TopToolbar>
    <FilterButton className="filter-button-page-admin" />
    {props.onExport != null && (
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={props.onExport} />
    )}
  </TopToolbar>
);

export default ListActions;
