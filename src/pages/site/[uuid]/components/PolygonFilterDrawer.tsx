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
  EMPTY_POLYGON_FILTERS,
  PolygonFilterState,
  PolygonSubmissionStatus,
  PolygonValidationStatus
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
    if (draftFilters.hasOverlap) {
      tags.push({ id: "hasOverlap", label: "Overlap" });
    }

    return tags;
  }, [draftFilters, restorationPracticeLabels, submissionStatusLabels, targetLandUseLabels, validationStatusLabels]);

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

  // TODO: Hidden until Submission Cycle is fully implemented in the backend and ready for release.
  // const SUBMISSION_CYCLE_MOCKED_OPTIONS = [
  //   { value: "option-1", label: t("Option 1") },
  //   { value: "option-2", label: t("Option 2") },
  //   { value: "option-3", label: t("Option 3") }
  // ];

  return (
    <Drawer
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
              {activeFilters.length > 0 && (
                <Flex className="mb-2 flex-wrap gap-2">
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
                {submissionStatusOptions.map(option => (
                  <Checkbox
                    key={option.value}
                    name={`submission-status-${option.value}`}
                    value={option.value}
                    checked={draftFilters.polygonStatus.includes(option.value)}
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
                  value={plantStartDateValue}
                  onValueChange={handlePlantStartDateChange}
                />
              </FilterCard>
              <FilterCard label={t("Restoration Practice")}>
                <SelectInput
                  placeholder={t("Please Select")}
                  size="small"
                  value={draftFilters.practice}
                  items={restorationPracticeOptions}
                  onChange={handlePracticeChange}
                />
              </FilterCard>
              <FilterCard label={t("Target Land Use")}>
                <SelectInput
                  placeholder={t("Please Select")}
                  size="small"
                  value={draftFilters.targetSys}
                  items={targetLandUseOptions}
                  onChange={handleTargetLandUseChange}
                />
              </FilterCard>
              {/* TODO: Hidden until Submission Cycle is fully implemented in the backend and ready for release.
              <FilterCard label={t("Submission Cycle")}>
                <SelectInput
                  placeholder={t("Please Select")}
                  size="small"
                  items={SUBMISSION_CYCLE_MOCKED_OPTIONS.map(option => ({
                    value: option.value,
                    label: t("Option {option}", { option: option.value })
                  }))}
                />
              </FilterCard>
              */}
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
