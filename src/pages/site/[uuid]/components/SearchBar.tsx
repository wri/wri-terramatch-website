import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";

import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import { PolygonTableRow } from "../tabs/Polygons";

interface SearchBarProps {
  polygonRows: PolygonTableRow[];
}
const SearchBar: FC<SearchBarProps> = ({ polygonRows }) => {
  const t = useT();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(string | string[])[]>([]);

  const handleOnClickFilterButton = () => {
    setFilter([
      "Filter A",
      ["Filter A", "Filter B"],
      "dd/mm/yyyy",
      "dd/mm/yyyy",
      "dd/mm/yyyy",
      "dd/mm/yyyy",
      "dd/mm/yyyy",
      "Filter A",
      "Filter A",
      "Filter A",
      "Filter A",
      "Filter A",
      "Filter A",
      "mm/yyyy - mm/yyyy"
    ]);
  };

  const handleOnSearch = (value: string) => {
    setSearch(value);
  };

  const handleOnClearFilters = () => {
    setFilter([]);
    setSearch("");
  };
  const filteredPolygonRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length === 0) return polygonRows;
    return polygonRows.filter(row => row.polygonName.toLowerCase().includes(q));
  }, [polygonRows, search]);

  return (
    <ToolbarTable
      className="!px-0"
      onClickFilterButton={handleOnClickFilterButton}
      onClearFilters={handleOnClearFilters}
      showClearFilters={filter.length > 0 ? true : false}
      selectedFilters={filter}
      search={{
        label: t(filteredPolygonRows.length === 1 ? "Result" : "Results"),
        placeholder: t("Search"),
        options: [],
        displayResults: "none",
        onQueryChange: handleOnSearch,
        count: filteredPolygonRows.length
      }}
    />
  );
};

export default SearchBar;
