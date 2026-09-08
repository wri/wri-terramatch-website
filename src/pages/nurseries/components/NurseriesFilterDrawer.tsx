import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, useEffect, useMemo, useState } from "react";

import { getStatusOptions } from "@/constants/options/status";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";

type CheckboxChange = { checked?: boolean | "indeterminate" };

const setArrayValue = (values: string[], value: string, checked: boolean) => {
  if (checked) return values.includes(value) ? values : [...values, value];
  return values.filter(item => item !== value);
};

type NurseriesFilterDrawerProps = {
  open?: boolean;
  statuses: string[];
  onApplyStatuses: (statuses: string[]) => void;
  onOpenChange?: (open: boolean) => void;
};

const NurseriesFilterDrawer: FC<NurseriesFilterDrawerProps> = ({ open, statuses, onApplyStatuses, onOpenChange }) => {
  const t = useT();
  const statusOptions = useMemo(() => getStatusOptions(t), [t]);
  const [draftStatuses, setDraftStatuses] = useState(statuses);

  useEffect(() => {
    if (open === true) setDraftStatuses(statuses);
  }, [open, statuses]);

  const activeFilterTags = useMemo(
    () =>
      draftStatuses.map(status => ({
        id: status,
        label: statusOptions.find(option => option.value === status)?.title ?? status
      })),
    [draftStatuses, statusOptions]
  );

  const handleStatusChange = (value: string, { checked }: CheckboxChange) => {
    setDraftStatuses(current => setArrayValue(current, value, checked === true));
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
                      setDraftStatuses(current => current.filter(status => status !== filter.id));
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
            </Flex>
          }
          footer={
            <ButtonGroup
              buttons={[
                {
                  id: "clear-all",
                  children: t("Clear all"),
                  variant: "secondary",
                  onClick: () => setDraftStatuses([])
                },
                {
                  id: "apply",
                  children: t("Apply"),
                  variant: "primary",
                  onClick: () => {
                    onApplyStatuses(draftStatuses);
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
