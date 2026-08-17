import type { DateValue } from "@ark-ui/react";
import { Flex } from "@chakra-ui/react";
import { CalendarDate } from "@internationalized/date";
import { useT } from "@transifex/react";
import React, { FC, useEffect, useMemo, useState } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { useRestorationPracticeLabels } from "@/hooks/translation/useRestorationPracticeLabels";
import { useRestorationPracticeOptions } from "@/hooks/translation/useRestorationPracticeOptions";
import { useSubmissionStatusLabels } from "@/hooks/translation/useSubmissionStatusLabels";
import { useSubmissionStatusOptions } from "@/hooks/translation/useSubmissionStatusOptions";
import { useTargetLandUseLabels } from "@/hooks/translation/useTargetLandUseLabels";
import { useTargetLandUseOptions } from "@/hooks/translation/useTargetLandUseOptions";
import { useValidationStatusLabels } from "@/hooks/translation/useValidationStatusLabels";
import { useValidationStatusOptions } from "@/hooks/translation/useValidationStatusOptions";
import { useIsAdmin } from "@/hooks/useIsAdmin";
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
  type SubmissionCycleOption,
  EMPTY_POLYGON_FILTERS,
  PolygonFilterState,
  PolygonSubmissionStatus,
  PolygonValidationStatus,
  SUBMISSION_CYCLE_LABELS,
  SUBMISSION_CYCLE_OPTIONS
} from "./polygonFilter.constants";

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

interface PolygonFilterDrawerProps {
  trigger?: React.ReactNode;
  open?: boolean;
  filters: PolygonFilterState;
  isAdminReview?: boolean;
  onApplyFilters: (filters: PolygonFilterState) => void;
  onClearFilters: () => void;
  onOpenChange?: (open: boolean) => void;
}

const PolygonFilterDrawer: FC<PolygonFilterDrawerProps> = ({
  trigger,
  open,
  filters,
  isAdminReview = false,
  onApplyFilters,
  onClearFilters,
  onOpenChange
}) => {
  const t = useT();
  const submissionStatusOptions = useSubmissionStatusOptions();
  const validationStatusOptions = useValidationStatusOptions();
  const restorationPracticeOptions = useRestorationPracticeOptions();
  const targetLandUseOptions = useTargetLandUseOptions();
  const submissionStatusLabels = useSubmissionStatusLabels();
  const validationStatusLabels = useValidationStatusLabels();
  const restorationPracticeLabels = useRestorationPracticeLabels();
  const targetLandUseLabels = useTargetLandUseLabels();
  const [draftFilters, setDraftFilters] = useState<PolygonFilterState>(filters);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (open === true) {
      setDraftFilters(filters);
    }
  }, [filters, open]);

  const activeFilters = useMemo(() => {
    const tags: { id: string; label: string }[] = [];

    for (const status of draftFilters.polygonStatus) {
      tags.push({ id: `polygonStatus:${status}`, label: submissionStatusLabels[status] });
    }
    for (const status of draftFilters.validationStatus) {
      tags.push({ id: `validationStatus:${status}`, label: validationStatusLabels[status] });
    }
    if (draftFilters.plantStartFrom) {
      tags.push({ id: "plantStartFrom", label: `From: ${draftFilters.plantStartFrom}` });
    }
    if (draftFilters.plantStartTo) {
      tags.push({ id: "plantStartTo", label: `To: ${draftFilters.plantStartTo}` });
    }
    for (const practice of draftFilters.practice) {
      tags.push({ id: `practice:${practice}`, label: restorationPracticeLabels[practice] });
    }
    for (const target of draftFilters.targetSys) {
      tags.push({ id: `targetSys:${target}`, label: targetLandUseLabels[target] });
    }
    for (const cycle of draftFilters.submissionCycle) {
      tags.push({ id: `submissionCycle:${cycle}`, label: SUBMISSION_CYCLE_LABELS[cycle] });
    }
    if (draftFilters.hasOverlap) {
      tags.push({ id: "hasOverlap", label: "Overlap" });
    }
    if (draftFilters.showDeleted) {
      tags.push({ id: "showDeleted", label: t("Deleted Polygons") });
    }

    return tags;
  }, [draftFilters, restorationPracticeLabels, submissionStatusLabels, t, targetLandUseLabels, validationStatusLabels]);

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
        case "submissionCycle":
          return { ...current, submissionCycle: current.submissionCycle.filter(s => s !== value) };
        case "plantStartFrom":
          return { ...current, plantStartFrom: "" };
        case "plantStartTo":
          return { ...current, plantStartTo: "" };
        case "hasOverlap":
          return { ...current, hasOverlap: false };
        case "showDeleted":
          return { ...current, showDeleted: false };
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

  const handleSubmissionCycleChange = (value: string[]) => {
    setDraftFilters(current => ({
      ...current,
      submissionCycle: value.filter((item): item is SubmissionCycleOption =>
        SUBMISSION_CYCLE_OPTIONS.includes(item as SubmissionCycleOption)
      )
    }));
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

  const handleShowDeletedChange = ({ checked }: CheckboxChange) => {
    const showDeleted = checked === true;
    // Deleted polygons is an exclusive audit view: turning it on clears every other draft
    // filter so the applied state can never combine "deleted" with a status/practice/etc filter.
    if (showDeleted) {
      setDraftFilters({ ...EMPTY_POLYGON_FILTERS, showDeleted: true });
    } else {
      setDraftFilters(current => ({ ...current, showDeleted: false }));
    }
  };

  const plantStartDateValue = useMemo<DateValue[]>(() => {
    const dates: DateValue[] = [];
    const from = isoStringToDateValue(draftFilters.plantStartFrom);
    const to = isoStringToDateValue(draftFilters.plantStartTo);
    if (from) dates.push(from);
    if (to) dates.push(to);
    return dates;
  }, [draftFilters.plantStartFrom, draftFilters.plantStartTo]);

  const submissionCycleOptions = useMemo(
    () => SUBMISSION_CYCLE_OPTIONS.map(value => ({ value, label: SUBMISSION_CYCLE_LABELS[value] })),
    []
  );

  return (
    <Drawer
      trapFocus={false}
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      maxW="22rem"
      paddingTop={isAdmin ? 12 : 0}
      maxH={isAdmin ? "calc(100vh - 3rem)" : "100vh"}
    >
      {({ onClose }) => (
        <FilterPanel
          title={t("Filters")}
          variant="fixed"
          onClose={onClose}
          className="h-full"
          content={
            <Flex className="h-full flex-col gap-3 overflow-auto p-4">
              <Flex className="mb-2 flex-wrap gap-2" display={activeFilters.length > 0 ? "flex" : "none"}>
                {activeFilters.map(filter => (
                  <FeedbackTag
                    key={filter.id}
                    type="info-white"
                    label={filter.label}
                    closable
                    onClose={() => removeFilter(filter.id)}
                  />
                ))}
              </Flex>
              <FilterCard label={t("Submission Status")}>
                {submissionStatusOptions.map(option => (
                  <Checkbox
                    key={option.value}
                    name={`submission-status-${option.value}`}
                    value={option.value}
                    checked={draftFilters.polygonStatus.includes(option.value)}
                    disabled={draftFilters.showDeleted}
                    onCheckedChange={(change: CheckboxChange) => handleSubmissionStatusChange(option.value, change)}
                  >
                    {option.label}
                  </Checkbox>
                ))}
              </FilterCard>
              <FilterCard label={t("System Validation")}>
                {validationStatusOptions.map(option => (
                  <Checkbox
                    key={option.value}
                    name={`system-validation-${option.value}`}
                    value={option.value}
                    checked={draftFilters.validationStatus.includes(option.value)}
                    disabled={draftFilters.showDeleted}
                    onCheckedChange={(change: CheckboxChange) => handleValidationStatusChange(option.value, change)}
                  >
                    {option.label}
                  </Checkbox>
                ))}
              </FilterCard>
              <FilterCard label={t("Plant Start Date")}>
                <DateRangeInput
                  size="small"
                  noMarginBottom
                  disabled={draftFilters.showDeleted}
                  value={plantStartDateValue}
                  onValueChange={handlePlantStartDateChange}
                />
              </FilterCard>
              <FilterCard label={t("Restoration Practice")}>
                <SelectInput
                  placeholder={t("Please Select")}
                  size="small"
                  disabled={draftFilters.showDeleted}
                  value={draftFilters.practice}
                  items={restorationPracticeOptions}
                  onChange={handlePracticeChange}
                />
              </FilterCard>
              <FilterCard label={t("Target Land Use")}>
                <SelectInput
                  placeholder={t("Please Select")}
                  size="small"
                  disabled={draftFilters.showDeleted}
                  value={draftFilters.targetSys}
                  items={targetLandUseOptions}
                  onChange={handleTargetLandUseChange}
                />
              </FilterCard>
              <FilterCard label={t("Submission Cycle")}>
                <SelectInput
                  placeholder={t("Please Select")}
                  size="small"
                  disabled={draftFilters.showDeleted}
                  value={draftFilters.submissionCycle}
                  items={submissionCycleOptions}
                  onChange={handleSubmissionCycleChange}
                  multiple
                />
              </FilterCard>
              <FilterCard label={t("Overlap")}>
                <Switch
                  name="overlap"
                  checked={draftFilters.hasOverlap}
                  disabled={draftFilters.showDeleted}
                  onCheckedChange={handleOverlapChange}
                >
                  {t("Show Polygon Overlaps")}
                </Switch>
              </FilterCard>
              {isAdminReview && (
                <FilterCard label={t("Deleted Polygons")}>
                  <Switch
                    name="showDeleted"
                    checked={draftFilters.showDeleted}
                    onCheckedChange={handleShowDeletedChange}
                  >
                    {t("Show Deleted Polygons")}
                  </Switch>
                </FilterCard>
              )}
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
                    setDraftFilters(EMPTY_POLYGON_FILTERS);
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

export default PolygonFilterDrawer;
