import DownloadIcon from "@mui/icons-material/GetApp";
import { Button, FilterButton, TopToolbar } from "react-admin";
import { When } from "react-if";

interface ListActionsProps {
  onExport?: () => void;
}

const ListActions = (props: ListActionsProps) => (
  <TopToolbar>
    <FilterButton className="filter-button-pa" />
    <When condition={!!props.onExport}>
      <Button className="button-pa" label="Export" startIcon={<DownloadIcon />} onClick={props.onExport} />
    </When>
  </TopToolbar>
);

export default ListActions;
