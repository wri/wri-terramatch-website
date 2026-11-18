import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilterCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import Combobox from "@/redesignComponents/Forms/Inputs/Combobox";

import { FacetOption } from "../utils/projectContextFilter";
import ProjectFacetChip from "./ProjectFacetChip";

export type FacetSearch = {
  placeholder: string;
  addPlaceholder: string;
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

  const items = useMemo(
    () => options.map(({ value, count }) => ({ value, label: `${getLabel(value)} (${count})` })),
    [getLabel, options]
  );

  return (
    <FilterCard
      label={label}
      labelSuffix={t("(optional)")}
      caption={search != null && selected.length === 0 ? search.getCaption(options.length) : undefined}
    >
      {options.length === 0 ? (
        <Text textStyle="300" color="neutral.700">
          {t("No options available")}
        </Text>
      ) : search != null ? (
        <>
          {selected.map(value => (
            <ProjectFacetChip
              key={value}
              label={getLabel(value)}
              disabled={disabled}
              onRemove={() => onChange(toggleValue(selected, value, false))}
            />
          ))}
          {!disabled && (
            <Combobox
              placeholder={selected.length === 0 ? search.placeholder : search.addPlaceholder}
              size="small"
              noMarginBottom
              multiple
              items={items}
              value={selected}
              onChange={onChange}
            />
          )}
        </>
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
