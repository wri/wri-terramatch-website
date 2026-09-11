import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, useEffect, useMemo, useState } from "react";

import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
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
        type: "status" as const,
        value: status,
        label: statusOptions.find(option => option.value === status)?.title ?? status
      })),
      ...draftUpdates.map(update => ({
        id: `update-${update}`,
        type: "update" as const,
        value: update,
        label: updateOptions.find(option => option.value === update)?.title ?? update
      }))
    ],
    [draftStatuses, draftUpdates, statusOptions, updateOptions]
  );

  const handleStatusChange = (value: string, { checked }: CheckboxChange) => {
    setDraftStatuses(current => setArrayValue(current, value, checked === true));
  };

  const handleUpdateChange = (value: string[]) => {
    setDraftUpdates(value);
  };

  return (
    <Drawer trapFocus={false} open={open} onOpenChange={onOpenChange} maxW="22rem">
      {({ onClose }) => (
        <FilterPanel
          title={t("Filters")}
          variant="fixed"
          onClose={onClose}
          className="h-full"
          content={
            <Flex className="h-full flex-col gap-3 overflow-auto p-4">
              <Flex className="mb-2 flex-wrap gap-2" display={activeFilterTags.length > 0 ? "flex" : "none"}>
                {activeFilterTags.map(filter => (
                  <FeedbackTag
                    key={filter.id}
                    type="info-white"
                    label={filter.label}
                    closable
                    onClose={() => {
                      if (filter.type === "status") {
                        setDraftStatuses(current => current.filter(status => status !== filter.value));
                      } else {
                        setDraftUpdates(current => current.filter(update => update !== filter.value));
                      }
                    }}
                  />
                ))}
              </Flex>

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
                  onChange={handleUpdateChange}
                  multiple
                />
              </FilterCard>
            </Flex>
          }
          footer={
            <ButtonGroup
              buttons={[
                {
                  id: "clear-all",
                  children: t("Clear all"),
                  variant: "secondary",
                  onClick: () => {
                    setDraftStatuses([]);
                    setDraftUpdates([]);
                  }
                },
                {
                  id: "apply",
                  children: t("Apply"),
                  variant: "primary",
                  onClick: () => {
                    onApplyFilters(draftStatuses, draftUpdates);
                    onClose();
                  }
                }
              ]}
            />
          }
        />
      )}
    </Drawer>
  );
};

export default NurseriesFilterDrawer;
