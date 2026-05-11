import DownloadIcon from "@mui/icons-material/GetApp";
import { FC } from "react";
import { Button, CreateButton, FilterButton, TopToolbar } from "react-admin";

type ListActionsProps = {
  onExport?: () => void;
};

const ListActionsImpactStories: FC<ListActionsProps> = ({ onExport }) => (
  <TopToolbar>
    <FilterButton className="filter-button-page-admin" />
    {onExport != null && (
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={onExport} />
    )}
    <CreateButton className="filter-button-page-admin-blue" label="Add Story" />
  </TopToolbar>
);

export default ListActionsImpactStories;
