import { FC } from "react";

import Carousel from "@/redesignComponents/containers/Carousel/Carousel";

import { SelectedFilter } from "../ToolBar.type";
import FilterTagItem from "./FilterTagItem";

interface FilterTagProps {
  selectedFilters?: SelectedFilter[];
}

const FilterTag: FC<FilterTagProps> = ({ selectedFilters }) => {
  if (!selectedFilters?.length) {
    return null;
  }

  return (
    <Carousel>
      {selectedFilters.map((filter, index) => {
        const label = typeof filter === "object" && !Array.isArray(filter) ? filter.label : filter;
        const onRemove = typeof filter === "object" && !Array.isArray(filter) ? filter.onRemove : undefined;
        const category = typeof filter === "object" && !Array.isArray(filter) ? filter.category : undefined;
        return <FilterTagItem label={label} onRemove={onRemove} category={category} key={index} />;
      })}
    </Carousel>
  );
};

export default FilterTag;
