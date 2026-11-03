import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilterCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import Combobox from "@/redesignComponents/Forms/Inputs/Combobox";

import { FacetOption } from "../utils/projectContextFilter";

const MAX_CHECKBOX_OPTIONS = 7;

export type FacetSearch = {
  placeholder: string;
  getCaption: (optionCount: number) => string;
};

type ProjectFacetGroupProps = {
  label: string;
  options: FacetOption[];
  selected: string[];
  disabled: boolean;
  search?: FacetSearch;
  getLabel: (value: string) => string;
  onChange: (values: string[]) => void;
};

const toggleValue = (values: string[], value: string, checked: boolean) => {
  const others = values.filter(selected => selected !== value);
  return checked ? [...others, value] : others;
};

const ProjectFacetGroup: FC<ProjectFacetGroupProps> = ({
  label,
  options,
  selected,
  disabled,
  search,
  getLabel,
  onChange
}) => {
  const t = useT();
  const showCombobox = search != null && options.length > MAX_CHECKBOX_OPTIONS;

  const items = useMemo(
    () => options.map(({ value, count }) => ({ value, label: `${getLabel(value)} (${count})` })),
    [getLabel, options]
  );

  return (
    <FilterCard
      label={label}
      labelSuffix={t("(optional)")}
      caption={showCombobox ? search.getCaption(options.length) : undefined}
    >
      {options.length === 0 ? (
        <Text textStyle="300" color="neutral.700">
          {t("No options available")}
        </Text>
      ) : showCombobox ? (
        <Combobox
          placeholder={search.placeholder}
          size="small"
          noMarginBottom
          multiple
          showSelectedItems
          disabled={disabled}
          items={items}
          value={selected}
          onChange={onChange}
        />
      ) : (
        items.map(({ value, label }) => (
          <Checkbox
            key={value}
            name={`project-context-${value}`}
            value={value}
            checked={selected.includes(value)}
            disabled={disabled}
            onCheckedChange={({ checked }) => onChange(toggleValue(selected, value, checked))}
          >
            {label}
          </Checkbox>
        ))
      )}
    </FilterCard>
  );
};

export default ProjectFacetGroup;
