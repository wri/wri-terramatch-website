import DownloadIcon from "@mui/icons-material/GetApp";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, FilterButton, TopToolbar, useListContext } from "react-admin";
import { When } from "react-if";

interface ListActionsProps {
  onExport?: () => void;
  showResetSort?: boolean;
}

const ResetSortButton = () => {
  const { setSort } = useListContext();

  const handleResetSort = () => {
    setSort({ field: "", order: "ASC" });
  };

  return (
    <Button
      className="button-page-admin"
      label="Reset Sort"
      startIcon={<RefreshIcon />}
      onClick={handleResetSort}
      color="secondary"
    />
  );
};

const ListActions = (props: ListActionsProps) => (
  <TopToolbar>
    <FilterButton className="filter-button-page-admin" />
    <When condition={props.showResetSort !== false}>
      <ResetSortButton />
    </When>
    <When condition={!!props.onExport}>
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={props.onExport} />
    </When>
  </TopToolbar>
);

export default ListActions;
