import { useT } from "@transifex/react";
import { union, without } from "lodash";
import { type FC, useEffect, useMemo, useState } from "react";

import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilterCards";
import IndexFilterDrawer from "@/redesignComponents/containers/FilterPanel/IndexFilterDrawer";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";

import { MyProjectsFilterOption } from "../myProjectsFilters";

type CheckboxChange = { checked?: boolean | "indeterminate" };

const STATUS_TAG_PREFIX = "status-";
const PLANTING_TAG_PREFIX = "planting-";

const toTags = (prefix: string, values: string[], options: MyProjectsFilterOption[]) =>
  values.map(value => ({
    id: `${prefix}${value}`,
    label: options.find(option => option.value === value)?.title ?? value
  }));

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
        onCheckedChange={({ checked }: CheckboxChange) =>
          onChange(checked === true ? union(values, [value]) : without(values, value))
        }
      >
        {title}
      </Checkbox>
    ))}
  </FilterCard>
);

type MyProjectsFilterDrawerProps = {
  open: boolean;
  statuses: string[];
  plantingStatuses: string[];
  statusOptions: MyProjectsFilterOption[];
  plantingStatusOptions: MyProjectsFilterOption[];
  onApplyFilters: (statuses: string[], plantingStatuses: string[]) => void;
  onOpenChange: (open: boolean) => void;
};

const MyProjectsFilterDrawer: FC<MyProjectsFilterDrawerProps> = ({
  open,
  statuses,
  plantingStatuses,
  statusOptions,
  plantingStatusOptions,
  onApplyFilters,
  onOpenChange
}) => {
  const t = useT();
  const [draftStatuses, setDraftStatuses] = useState(statuses);
  const [draftPlantingStatuses, setDraftPlantingStatuses] = useState(plantingStatuses);

  useEffect(() => {
    if (!open) return;
    setDraftStatuses(statuses);
    setDraftPlantingStatuses(plantingStatuses);
  }, [open, plantingStatuses, statuses]);

  const activeFilterTags = useMemo(
    () => [
      ...toTags(STATUS_TAG_PREFIX, draftStatuses, statusOptions),
      ...toTags(PLANTING_TAG_PREFIX, draftPlantingStatuses, plantingStatusOptions)
    ],
    [draftPlantingStatuses, draftStatuses, plantingStatusOptions, statusOptions]
  );

  const removeFilterTag = (id: string) => {
    if (id.startsWith(STATUS_TAG_PREFIX)) {
      setDraftStatuses(current => without(current, id.slice(STATUS_TAG_PREFIX.length)));
    } else {
      setDraftPlantingStatuses(current => without(current, id.slice(PLANTING_TAG_PREFIX.length)));
    }
  };

  return (
    <IndexFilterDrawer
      open={open}
      onOpenChange={onOpenChange}
      tags={activeFilterTags}
      onRemoveTag={removeFilterTag}
      onClear={() => {
        setDraftStatuses([]);
        setDraftPlantingStatuses([]);
      }}
      onApply={() => onApplyFilters(draftStatuses, draftPlantingStatuses)}
      drawerMaxW="22rem"
    >
      <FilterCheckboxGroup
        label={t("Set Up Status")}
        name="project-status"
        options={statusOptions}
        values={draftStatuses}
        onChange={setDraftStatuses}
      />
      <FilterCheckboxGroup
        label={t("Planting Status")}
        name="project-planting-status"
        options={plantingStatusOptions}
        values={draftPlantingStatuses}
        onChange={setDraftPlantingStatuses}
      />
    </IndexFilterDrawer>
  );
};

export default MyProjectsFilterDrawer;
