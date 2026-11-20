import { useT } from "@transifex/react";
import { union, without } from "lodash";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";

import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilterCards";
import IndexFilterDrawer from "@/redesignComponents/containers/FilterPanel/IndexFilterDrawer";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";

import {
  EMPTY_MY_PROJECTS_FILTERS,
  getFilterCategoryLabels,
  MY_PROJECTS_FILTER_KEYS,
  MyProjectsFilterKey,
  MyProjectsFilterOption,
  MyProjectsFilterOptions,
  MyProjectsFilters
} from "../myProjectsFilters";

const TAG_SEPARATOR = ":";

type FilterCheckboxGroupProps = {
  label: string;
  name: string;
  options: MyProjectsFilterOption[];
  values: string[];
  onChange: (values: string[]) => void;
};

const FilterCheckboxGroup: FC<FilterCheckboxGroupProps> = ({ label, name, options, values, onChange }) => (
  <FilterCard label={label}>
    {options.map(({ value, title }) => (
      <Checkbox
        key={value}
        name={`${name}-${value}`}
        value={value}
        checked={values.includes(value)}
        onCheckedChange={({ checked }) => onChange(checked === true ? union(values, [value]) : without(values, value))}
      >
        {title}
      </Checkbox>
    ))}
  </FilterCard>
);

type FilterSelectProps = {
  label: string;
  placeholder: string;
  options: MyProjectsFilterOption[];
  values: string[];
  onChange: (values: string[]) => void;
};

const FilterSelect: FC<FilterSelectProps> = ({ label, placeholder, options, values, onChange }) => {
  const items = useMemo(() => options.map(({ value, title }) => ({ value, label: title })), [options]);

  return (
    <FilterCard label={label}>
      <SelectInput placeholder={placeholder} size="small" value={values} items={items} onChange={onChange} />
    </FilterCard>
  );
};

type MyProjectsFilterDrawerProps = {
  open: boolean;
  filters: MyProjectsFilters;
  options: MyProjectsFilterOptions;
  onApplyFilters: (filters: MyProjectsFilters) => void;
  onOpenChange: (open: boolean) => void;
};

const MyProjectsFilterDrawer: FC<MyProjectsFilterDrawerProps> = ({
  open,
  filters,
  options,
  onApplyFilters,
  onOpenChange
}) => {
  const t = useT();
  const labels = useMemo(() => getFilterCategoryLabels(t), [t]);
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [filters, open]);

  const setDraftValues = useCallback(
    (key: MyProjectsFilterKey) => (values: string[]) => setDraft(current => ({ ...current, [key]: values })),
    []
  );

  const activeFilterTags = useMemo(
    () =>
      MY_PROJECTS_FILTER_KEYS.flatMap(key =>
        draft[key].map(value => ({
          id: `${key}${TAG_SEPARATOR}${value}`,
          label: options[key].find(option => option.value === value)?.title ?? value
        }))
      ),
    [draft, options]
  );

  const removeFilterTag = useCallback((id: string) => {
    const key = MY_PROJECTS_FILTER_KEYS.find(filterKey => id.startsWith(`${filterKey}${TAG_SEPARATOR}`));
    if (key == null) return;
    const value = id.slice(key.length + TAG_SEPARATOR.length);
    setDraft(current => ({ ...current, [key]: without(current[key], value) }));
  }, []);

  const clearDraftFilters = useCallback(() => setDraft(EMPTY_MY_PROJECTS_FILTERS), []);
  const applyDraftFilters = useCallback(() => onApplyFilters(draft), [draft, onApplyFilters]);

  return (
    <IndexFilterDrawer
      open={open}
      onOpenChange={onOpenChange}
      tags={activeFilterTags}
      onRemoveTag={removeFilterTag}
      onClear={clearDraftFilters}
      onApply={applyDraftFilters}
      drawerMaxW="22rem"
    >
      <FilterCheckboxGroup
        label={labels.statuses}
        name="project-status"
        options={options.statuses}
        values={draft.statuses}
        onChange={setDraftValues("statuses")}
      />
      <FilterCheckboxGroup
        label={labels.plantingStatuses}
        name="project-planting-status"
        options={options.plantingStatuses}
        values={draft.plantingStatuses}
        onChange={setDraftValues("plantingStatuses")}
      />
      {options.programmes.length > 1 && (
        <FilterSelect
          label={labels.programmes}
          placeholder={t("Select Programme")}
          options={options.programmes}
          values={draft.programmes}
          onChange={setDraftValues("programmes")}
        />
      )}
      {options.countries.length > 1 && (
        <FilterSelect
          label={labels.countries}
          placeholder={t("Select Country")}
          options={options.countries}
          values={draft.countries}
          onChange={setDraftValues("countries")}
        />
      )}
    </IndexFilterDrawer>
  );
};

export default MyProjectsFilterDrawer;
