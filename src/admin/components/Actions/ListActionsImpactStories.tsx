import DownloadIcon from "@mui/icons-material/GetApp";
import { Button, CreateButton, FilterButton, TopToolbar } from "react-admin";
import { When } from "react-if";

interface ListActionsProps {
  onExport?: () => void;
}

const ListActionsImpactStories = (props: ListActionsProps) => (
  <TopToolbar>
    <FilterButton className="filter-button-page-admin" />
    <When condition={!!props.onExport}>
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={props.onExport} />
    </When>
    <CreateButton className="filter-button-page-admin-blue" label="Add Story" />
  </TopToolbar>
);

export default ListActionsImpactStories;
