import DownloadIcon from "@mui/icons-material/GetApp";
import { Button, CreateButton, FilterButton, TopToolbar } from "react-admin";

interface ListActionsCreateFilterProps {
  canCreate?: boolean;
  onExport?: () => void;
}

const ListActionsCreateFilter = ({ canCreate, onExport }: ListActionsCreateFilterProps) => (
  <TopToolbar>
    {canCreate && <CreateButton className="filter-button-page-admin" />}
    <FilterButton className="filter-button-page-admin" />
    {onExport == null ? undefined : (
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={onExport} />
    )}
  </TopToolbar>
);

export default ListActionsCreateFilter;
