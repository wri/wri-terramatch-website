import DownloadIcon from "@mui/icons-material/GetApp";
import { Button, CreateButton, FilterButton, TopToolbar } from "react-admin";
import { When } from "react-if";

interface ListActionsCreateProps {
  onExport?: () => void;
  showFilters?: boolean;
}

const ListActionsCreate = ({ onExport, showFilters }: ListActionsCreateProps) => (
  <TopToolbar>
    {showFilters === true ? <FilterButton className="filter-button-page-admin" /> : null}
    <CreateButton className="filter-button-page-admin" />
    <When condition={!!onExport}>
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={onExport} />
    </When>
  </TopToolbar>
);

export default ListActionsCreate;
