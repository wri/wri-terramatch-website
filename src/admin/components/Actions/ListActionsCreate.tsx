import DownloadIcon from "@mui/icons-material/GetApp";
import { Button, CreateButton, TopToolbar } from "react-admin";
import { When } from "react-if";

interface ListActionsCreateProps {
  onExport?: () => void;
}

const ListActionsCreate = ({ onExport }: ListActionsCreateProps) => (
  <TopToolbar>
    <CreateButton className="filter-button-page-admin" />
    <When condition={!!onExport}>
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={onExport} />
    </When>
  </TopToolbar>
);

export default ListActionsCreate;
