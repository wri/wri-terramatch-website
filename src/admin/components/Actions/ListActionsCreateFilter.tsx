import DownloadIcon from "@mui/icons-material/GetApp";
import { Button, CreateButton, FilterButton, TopToolbar } from "react-admin";
import { When } from "react-if";

interface ListActionsCreateFilterProps {
  canCreateUser?: boolean;
  onExport?: () => void;
}

const ListActionsCreateFilter = ({ canCreateUser, onExport }: ListActionsCreateFilterProps) => (
  <TopToolbar>
    <When condition={canCreateUser}>
      <CreateButton className="filter-button-page-admin" />
    </When>
    <FilterButton className="filter-button-page-admin" />
    <When condition={!!onExport}>
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={onExport} />
    </When>
  </TopToolbar>
);

export default ListActionsCreateFilter;
