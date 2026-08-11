import type { DateValue } from "@ark-ui/react";
import { Flex } from "@chakra-ui/react";
import { CalendarDate } from "@internationalized/date";
import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useState } from "react";

import { getReportStatusOptions } from "@/constants/options/status";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import DateRangeInput from "@/redesignComponents/Forms/Inputs/DateInputs/DateRangeInputs/DateRangeInput";

import {
  ADDITIONAL_REPORT_TYPE_OPTIONS,
  EMPTY_REPORT_FILTERS,
  PROGRESS_REPORT_TYPE_OPTIONS,
  REPORT_TYPE_LABELS,
  ReportFilterState,
  ReportTypeOption
} from "./reportFilter.constants";

type CheckboxChange = { checked?: boolean | "indeterminate" };

const setArrayValue = <T extends string>(values: T[], value: T, checked: boolean): T[] => {
  if (checked) {
    return values.includes(value) ? values : [...values, value];
  }
  return values.filter(item => item !== value);
};

const isoStringToDateValue = (value: string): DateValue | undefined => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new CalendarDate(year, month, day);
};

const dateValueToIsoString = (value: DateValue | undefined): string => {
  if (!value) return "";
  const mm = String(value.month).padStart(2, "0");
  const dd = String(value.day).padStart(2, "0");
  return `${value.year}-${mm}-${dd}`;
};

interface ReportsFilterDrawerProps {
  open?: boolean;
  activeTab: string;
  filters: ReportFilterState;
  onApplyFilters: (filters: ReportFilterState) => void;
  onClearFilters: () => void;
  onOpenChange?: (open: boolean) => void;
}

const ReportsFilterDrawer: FC<ReportsFilterDrawerProps> = ({
  open,
  activeTab,
  filters,
  onApplyFilters,
  onClearFilters,
  onOpenChange
}) => {
  const t = useT();
  const [draftFilters, setDraftFilters] = useState<ReportFilterState>(filters);
  const statusOptions = useMemo(() => getReportStatusOptions(t), [t]);
  const reportTypeOptions =
    activeTab === "additional-reports" ? ADDITIONAL_REPORT_TYPE_OPTIONS : PROGRESS_REPORT_TYPE_OPTIONS;

  useEffect(() => {
    if (open) {
      setDraftFilters(filters);
    }
  }, [filters, open]);

  const activeFilterTags = useMemo(() => {
    const tags: { id: string; label: string }[] = [];

    draftFilters.reportTypes.forEach(type => {
      tags.push({ id: `type-${type}`, label: t(REPORT_TYPE_LABELS[type]) });
    });
    draftFilters.statuses.forEach(status => {
      const option = statusOptions.find(item => item.value === status);
      tags.push({ id: `status-${status}`, label: option?.title ?? status });
    });
    if (draftFilters.dueDateFrom !== "" || draftFilters.dueDateTo !== "") {
      const fromLabel = draftFilters.dueDateFrom !== "" ? draftFilters.dueDateFrom : t("Any date");
      const toLabel = draftFilters.dueDateTo !== "" ? draftFilters.dueDateTo : t("Any date");
      tags.push({ id: "due-date", label: `${fromLabel} - ${toLabel}` });
    }

    return tags;
  }, [draftFilters, statusOptions, t]);

  const dueDateValue = useMemo<DateValue[]>(() => {
    const dates: DateValue[] = [];
    const from = isoStringToDateValue(draftFilters.dueDateFrom);
    const to = isoStringToDateValue(draftFilters.dueDateTo);
    if (from) dates.push(from);
    if (to) dates.push(to);
    return dates;
  }, [draftFilters.dueDateFrom, draftFilters.dueDateTo]);

  const handleReportTypeChange = (value: ReportTypeOption, { checked }: CheckboxChange) => {
    setDraftFilters(current => ({
      ...current,
      reportTypes: setArrayValue(current.reportTypes, value, checked === true)
    }));
  };

  const handleStatusChange = (value: string, { checked }: CheckboxChange) => {
    setDraftFilters(current => ({
      ...current,
      statuses: setArrayValue(current.statuses, value, checked === true)
    }));
  };

  const handleDueDateChange = (dates: DateValue[]) => {
    setDraftFilters(current => ({
      ...current,
      dueDateFrom: dateValueToIsoString(dates[0]),
      dueDateTo: dateValueToIsoString(dates[1])
    }));
  };

  const removeFilterTag = (id: string) => {
    if (id.startsWith("type-")) {
      const value = id.replace("type-", "") as ReportTypeOption;
      setDraftFilters(current => ({
        ...current,
        reportTypes: current.reportTypes.filter(type => type !== value)
      }));
      return;
    }
    if (id.startsWith("status-")) {
      const value = id.replace("status-", "");
      setDraftFilters(current => ({
        ...current,
        statuses: current.statuses.filter(status => status !== value)
      }));
      return;
    }
    if (id === "due-date") {
      setDraftFilters(current => ({ ...current, dueDateFrom: "", dueDateTo: "" }));
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} maxW="22rem">
      {({ onClose }) => (
        <FilterPanel
          title={t("Filters")}
          variant="fixed"
          onClose={onClose}
          className="h-full"
          content={
            <Flex className="h-full flex-col gap-3 overflow-auto p-4">
              {activeFilterTags.length > 0 && (
                <Flex className="mb-2 flex-wrap gap-2">
                  {activeFilterTags.map(filter => (
                    <FeedbackTag
                      key={filter.id}
                      type="info-white"
                      label={filter.label}
                      closable
                      onClose={() => removeFilterTag(filter.id)}
                    />
                  ))}
                </Flex>
              )}
              <FilterCard label={t("Report Type")}>
                {reportTypeOptions.map(option => (
                  <Checkbox
                    key={option.value}
                    name={`report-type-${option.value}`}
                    value={option.value}
                    checked={draftFilters.reportTypes.includes(option.value)}
                    onCheckedChange={(change: CheckboxChange) => handleReportTypeChange(option.value, change)}
                  >
                    {t(option.label)}
                  </Checkbox>
                ))}
              </FilterCard>
              <FilterCard label={t("Status")}>
                {statusOptions.map(option => (
                  <Checkbox
                    key={String(option.value)}
                    name={`report-status-${option.value}`}
                    value={String(option.value)}
                    checked={draftFilters.statuses.includes(String(option.value))}
                    onCheckedChange={(change: CheckboxChange) => handleStatusChange(String(option.value), change)}
                  >
                    {option.title}
                  </Checkbox>
                ))}
              </FilterCard>
              <FilterCard label={t("Due Date")}>
                <DateRangeInput size="small" noMarginBottom value={dueDateValue} onValueChange={handleDueDateChange} />
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
                    setDraftFilters(EMPTY_REPORT_FILTERS);
                    onClearFilters();
                    onClose();
                  }
                },
                {
                  id: "apply",
                  children: t("Apply"),
                  variant: "primary",
                  onClick: () => {
                    onApplyFilters(draftFilters);
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

export default ReportsFilterDrawer;
