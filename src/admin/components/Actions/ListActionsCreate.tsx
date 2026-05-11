import DownloadIcon from "@mui/icons-material/GetApp";
import { FC } from "react";
import { Button, CreateButton, FilterButton, TopToolbar } from "react-admin";

type ListActionsCreateProps = {
  onExport?: () => void;
  showFilters?: boolean;
};

const ListActionsCreate: FC<ListActionsCreateProps> = ({ onExport, showFilters }) => (
  <TopToolbar>
    {showFilters === true ? <FilterButton className="filter-button-page-admin" /> : null}
    <CreateButton className="filter-button-page-admin" />
    {onExport != null && (
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={onExport} />
    )}
  </TopToolbar>
);

export default ListActionsCreate;
