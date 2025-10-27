import DownloadIcon from "@mui/icons-material/GetApp";
import { useEffect, useRef } from "react";
import { Button, FilterButton, TopToolbar, useListContext } from "react-admin";
import { useLocation } from "react-router-dom";

interface ListActionsProps {
  onExport?: () => void;
}

export const AutoResetSort = () => {
  const { setSort } = useListContext();
  const location = useLocation();
  const prevPathname = useRef<string>("");

  useEffect(() => {
    if (prevPathname.current !== location.pathname || !prevPathname.current) {
      setSort({ field: "", order: "ASC" });
      prevPathname.current = location.pathname;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

const ListActions = (props: ListActionsProps) => (
  <TopToolbar>
    <FilterButton className="filter-button-page-admin" />
    {props.onExport != null && (
      <Button className="button-page-admin" label="Export" startIcon={<DownloadIcon />} onClick={props.onExport} />
    )}
  </TopToolbar>
);

export default ListActions;
