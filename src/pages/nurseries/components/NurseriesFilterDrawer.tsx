import { useT } from "@transifex/react";
import { type FC, useEffect, useMemo, useState } from "react";

import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilterCards";
import IndexFilterDrawer from "@/redesignComponents/containers/FilterPanel/IndexFilterDrawer";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";

type CheckboxChange = { checked?: boolean | "indeterminate" };

const setArrayValue = (values: string[], value: string, checked: boolean) => {
  if (checked) return values.includes(value) ? values : [...values, value];
  return values.filter(item => item !== value);
};

type NurseriesFilterDrawerProps = {
  open?: boolean;
  statuses: string[];
  updates: string[];
  onApplyFilters: (statuses: string[], updates: string[]) => void;
  onOpenChange?: (open: boolean) => void;
};

const NurseriesFilterDrawer: FC<NurseriesFilterDrawerProps> = ({
  open,
  statuses,
  updates,
  onApplyFilters,
  onOpenChange
}) => {
  const t = useT();
  const statusOptions = useMemo(() => getStatusOptions(t), [t]);
  const updateOptions = useMemo(
    () =>
      getChangeRequestStatusOptions(t).map(option =>
        option.value === "approved" ? { ...option, title: t("Complete") } : option
      ),
    [t]
  );
  const updateSelectItems = useMemo(
    () => updateOptions.map(option => ({ label: String(option.title), value: String(option.value) })),
    [updateOptions]
  );
  const [draftStatuses, setDraftStatuses] = useState(statuses);
  const [draftUpdates, setDraftUpdates] = useState(updates);

  useEffect(() => {
    if (open !== true) return;
    setDraftStatuses(statuses);
    setDraftUpdates(updates);
  }, [open, statuses, updates]);

  const activeFilterTags = useMemo(
    () => [
      ...draftStatuses.map(status => ({
        id: `status-${status}`,
        label: statusOptions.find(option => option.value === status)?.title ?? status
      })),
      ...draftUpdates.map(update => ({
        id: `update-${update}`,
        label: updateOptions.find(option => option.value === update)?.title ?? update
      }))
    ],
    [draftStatuses, draftUpdates, statusOptions, updateOptions]
  );

  const handleStatusChange = (value: string, { checked }: CheckboxChange) => {
    setDraftStatuses(current => setArrayValue(current, value, checked === true));
  };

  const removeFilterTag = (id: string) => {
    if (id.startsWith("status-")) {
      const value = id.replace("status-", "");
      setDraftStatuses(current => current.filter(status => status !== value));
      return;
    }
    if (id.startsWith("update-")) {
      const value = id.replace("update-", "");
      setDraftUpdates(current => current.filter(update => update !== value));
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
        setDraftUpdates([]);
      }}
      onApply={() => onApplyFilters(draftStatuses, draftUpdates)}
      drawerMaxW="22rem"
    >
      <FilterCard label={t("Status")}>
        {statusOptions.map(option => {
          const value = String(option.value);
          return (
            <Checkbox
              key={value}
              name={`nursery-status-${value}`}
              value={value}
              checked={draftStatuses.includes(value)}
              onCheckedChange={(change: CheckboxChange) => handleStatusChange(value, change)}
            >
              {option.title}
            </Checkbox>
          );
        })}
      </FilterCard>

      <FilterCard label={t("Updates")}>
        <SelectInput
          placeholder={t("Please Select")}
          size="small"
          value={draftUpdates}
          items={updateSelectItems}
          onChange={setDraftUpdates}
          multiple
        />
      </FilterCard>
    </IndexFilterDrawer>
  );
};

export default NurseriesFilterDrawer;
