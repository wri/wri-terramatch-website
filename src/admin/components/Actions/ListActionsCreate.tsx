import DownloadIcon from "@mui/icons-material/GetApp";
import { Button, CreateButton, TopToolbar } from "react-admin";
import { When } from "react-if";

interface ListActionsCreateProps {
  onExport?: () => void;
}

const ListActionsCreate = (props: ListActionsCreateProps) => (
  <TopToolbar>
    <CreateButton className="filter-button-pa" />
    <When condition={!!props.onExport}>
      <Button className="button-pa" label="Export" startIcon={<DownloadIcon />} onClick={props.onExport} />
    </When>
  </TopToolbar>
);

export default ListActionsCreate;
