import type { DateValue } from "@ark-ui/react";
import { Flex } from "@chakra-ui/react";
import { CalendarDate } from "@internationalized/date";
import { useT } from "@transifex/react";
import React, { FC, useEffect, useMemo, useState } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import DateRangeInput from "@/redesignComponents/Forms/Inputs/DateInputs/DateRangeInputs/DateRangeInput";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";

import {
  EMPTY_POLYGON_FILTERS,
  PolygonFilterState,
  PolygonSubmissionStatus,
  PolygonValidationStatus,
  RESTORATION_PRACTICE_LABELS,
  RESTORATION_PRACTICE_OPTIONS,
  SUBMISSION_STATUS_LABELS,
  SUBMISSION_STATUS_OPTIONS,
  TARGET_LAND_USE_LABELS,
  TARGET_LAND_USE_OPTIONS,
  VALIDATION_STATUS_LABELS,
  VALIDATION_STATUS_OPTIONS
} from "./polygonFilter.constants";

type CheckboxChange = { checked?: boolean | "indeterminate" };

const SUBMISSION_CYCLE_OPTIONS = [1, 2, 3, 4, 5].map(value => ({
  value: String(value),
  label: `Option ${value}`
}));

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

interface PolygonFilterDrawerProps {
  trigger?: React.ReactNode;
  open?: boolean;
  filters: PolygonFilterState;
  onApplyFilters: (filters: PolygonFilterState) => void;
  onClearFilters: () => void;
  onOpenChange?: (open: boolean) => void;
}

const PolygonFilterDrawer: FC<PolygonFilterDrawerProps> = ({
  trigger,
  open,
  filters,
  onApplyFilters,
  onClearFilters,
  onOpenChange
}) => {
  const t = useT();
  const [draftFilters, setDraftFilters] = useState<PolygonFilterState>(filters);

  useEffect(() => {
    if (open === true) {
      setDraftFilters(filters);
    }
  }, [filters, open]);

  const activeFilters = useMemo(() => {
    const tags: { id: string; label: string }[] = [];

    for (const status of draftFilters.polygonStatus) {
      tags.push({ id: `polygonStatus:${status}`, label: SUBMISSION_STATUS_LABELS[status] });
    }
    for (const status of draftFilters.validationStatus) {
      tags.push({ id: `validationStatus:${status}`, label: VALIDATION_STATUS_LABELS[status] });
    }
    if (draftFilters.plantStartFrom) {
      tags.push({ id: "plantStartFrom", label: `From: ${draftFilters.plantStartFrom}` });
    }
    if (draftFilters.plantStartTo) {
      tags.push({ id: "plantStartTo", label: `To: ${draftFilters.plantStartTo}` });
    }
    for (const practice of draftFilters.practice) {
      tags.push({ id: `practice:${practice}`, label: RESTORATION_PRACTICE_LABELS[practice] });
    }
    for (const target of draftFilters.targetSys) {
      tags.push({ id: `targetSys:${target}`, label: TARGET_LAND_USE_LABELS[target] });
    }
    if (draftFilters.hasOverlap) {
      tags.push({ id: "hasOverlap", label: "Overlap" });
    }

    return tags;
  }, [draftFilters]);

  const removeFilter = (id: string) => {
    const [category, value] = id.split(":");
    setDraftFilters(current => {
      switch (category) {
        case "polygonStatus":
          return { ...current, polygonStatus: current.polygonStatus.filter(s => s !== value) };
        case "validationStatus":
          return { ...current, validationStatus: current.validationStatus.filter(s => s !== value) };
        case "practice":
          return { ...current, practice: current.practice.filter(s => s !== value) };
        case "targetSys":
          return { ...current, targetSys: current.targetSys.filter(s => s !== value) };
        case "plantStartFrom":
          return { ...current, plantStartFrom: "" };
        case "plantStartTo":
          return { ...current, plantStartTo: "" };
        case "hasOverlap":
          return { ...current, hasOverlap: false };
        default:
          return current;
      }
    });
  };

  const handleSubmissionStatusChange = (value: PolygonSubmissionStatus, { checked }: CheckboxChange) => {
    setDraftFilters(current => ({
      ...current,
      polygonStatus: setArrayValue(current.polygonStatus, value, checked === true)
    }));
  };

  const handleValidationStatusChange = (value: PolygonValidationStatus, { checked }: CheckboxChange) => {
    setDraftFilters(current => ({
      ...current,
      validationStatus: setArrayValue(current.validationStatus, value, checked === true)
    }));
  };

  const handlePracticeChange = (value: string[]) => {
    const selected = value[0] as restorationStrategyType | undefined;
    setDraftFilters(current => ({ ...current, practice: selected ? [selected] : [] }));
  };

  const handleTargetLandUseChange = (value: string[]) => {
    const selected = value[0] as targetLandUseType | undefined;
    setDraftFilters(current => ({ ...current, targetSys: selected ? [selected] : [] }));
  };

  const handlePlantStartDateChange = (value: DateValue[]) => {
    setDraftFilters(current => ({
      ...current,
      plantStartFrom: dateValueToIsoString(value[0]),
      plantStartTo: dateValueToIsoString(value[1])
    }));
  };

  const handleOverlapChange = ({ checked }: CheckboxChange) => {
    setDraftFilters(current => ({ ...current, hasOverlap: checked === true }));
  };

  const plantStartDateValue = useMemo<DateValue[]>(() => {
    const dates: DateValue[] = [];
    const from = isoStringToDateValue(draftFilters.plantStartFrom);
    const to = isoStringToDateValue(draftFilters.plantStartTo);
    if (from) dates.push(from);
    if (to) dates.push(to);
    return dates;
  }, [draftFilters.plantStartFrom, draftFilters.plantStartTo]);

  return (
    <Drawer trigger={trigger} open={open} onOpenChange={onOpenChange} size="filterPanel">
      {({ onClose }) => (
        <FilterPanel
          title={t("Filters")}
          variant="fixed"
          onClose={onClose}
          className="h-screen w-full"
          content={
            <Flex className="h-full flex-col gap-3 overflow-auto">
              {activeFilters.length > 0 && (
                <Flex className="flex-wrap gap-2">
                  {activeFilters.map(filter => (
                    <FeedbackTag
                      key={filter.id}
                      type="info-white"
                      label={filter.label}
                      closable
                      onClose={() => {
                        removeFilter(filter.id);
                      }}
                    />
                  ))}
                </Flex>
              )}
              <FilterCard label={t("Submission Status")}>
                {SUBMISSION_STATUS_OPTIONS.map(option => (
                  <Checkbox
                    key={option.value}
                    name={`submission-status-${option.value}`}
                    value={option.value}
                    checked={draftFilters.polygonStatus.includes(option.value)}
                    onCheckedChange={(change: CheckboxChange) => handleSubmissionStatusChange(option.value, change)}
                  >
                    {t(option.label)}
                  </Checkbox>
                ))}
              </FilterCard>
              <FilterCard label={t("System Validation")}>
                {VALIDATION_STATUS_OPTIONS.map(option => (
                  <Checkbox
                    key={option.value}
                    name={`system-validation-${option.value}`}
                    value={option.value}
                    checked={draftFilters.validationStatus.includes(option.value)}
                    onCheckedChange={(change: CheckboxChange) => handleValidationStatusChange(option.value, change)}
                  >
                    {t(option.label)}
                  </Checkbox>
                ))}
              </FilterCard>
              <FilterCard label={t("Plant Start Date")}>
                <DateRangeInput
                  size="small"
                  noMarginBottom
                  value={plantStartDateValue}
                  onValueChange={handlePlantStartDateChange}
                />
              </FilterCard>
              <FilterCard label={t("Restoration Practice")}>
                <SelectInput
                  placeholder={t("Please Select")}
                  size="small"
                  value={draftFilters.practice}
                  items={RESTORATION_PRACTICE_OPTIONS.map(option => ({
                    value: option.value,
                    label: t(option.label)
                  }))}
                  onChange={handlePracticeChange}
                />
              </FilterCard>
              <FilterCard label={t("Target Land Use")}>
                <SelectInput
                  placeholder={t("Please Select")}
                  size="small"
                  value={draftFilters.targetSys}
                  items={TARGET_LAND_USE_OPTIONS.map(option => ({
                    value: option.value,
                    label: t(option.label)
                  }))}
                  onChange={handleTargetLandUseChange}
                />
              </FilterCard>
              <FilterCard label={t("Submission Cycle")}>
                <SelectInput
                  placeholder={t("Please Select")}
                  size="small"
                  items={SUBMISSION_CYCLE_OPTIONS.map(option => ({
                    value: option.value,
                    label: t("Option {option}", { option: option.value })
                  }))}
                />
              </FilterCard>
              <FilterCard label={t("Overlap")}>
                <Switch name="overlap" checked={draftFilters.hasOverlap} onCheckedChange={handleOverlapChange}>
                  {t("Show Polygon Overlaps")}
                </Switch>
              </FilterCard>
            </Flex>
          }
          footer={
            <ButtonGroup
              buttons={[
                {
                  children: t("Clear all"),
                  variant: "secondary",
                  onClick: () => {
                    setDraftFilters(EMPTY_POLYGON_FILTERS);
                    onClearFilters();
                    onClose();
                  }
                },
                {
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

export default PolygonFilterDrawer;
