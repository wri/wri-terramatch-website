import DownloadIcon from "@mui/icons-material/GetApp";
import { Button, CreateButton, FilterButton, TopToolbar } from "react-admin";
import { When } from "react-if";

interface ListActionsCreateFilterProps {
  isSuperAdmin?: boolean;
  onExport?: () => void;
}

const ListActionsCreateFilter = ({ isSuperAdmin, onExport }: ListActionsCreateFilterProps) => (
  <TopToolbar>
    <When condition={isSuperAdmin}>
      <CreateButton className="filter-button-page-admin" />
    </When>
    <FilterButton className="filter-button-page-admin" />
    <When condition={!!onExport}>
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={onExport} />
    </When>
  </TopToolbar>
);

export default ListActionsCreateFilter;
