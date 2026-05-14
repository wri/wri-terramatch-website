import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";

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

const SELECT_CLASS_NAME = "w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900";
const DATE_INPUT_CLASS_NAME = "w-full rounded border border-neutral-300 px-3 py-2 text-sm text-neutral-900";

const setArrayValue = <T extends string>(values: T[], value: T, checked: boolean): T[] => {
  if (checked) {
    return values.includes(value) ? values : [...values, value];
  }
  return values.filter(item => item !== value);
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

  const handlePracticeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as restorationStrategyType | "";
    setDraftFilters(current => ({ ...current, practice: value === "" ? [] : [value] }));
  };

  const handleTargetLandUseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as targetLandUseType | "";
    setDraftFilters(current => ({ ...current, targetSys: value === "" ? [] : [value] }));
  };

  const handlePlantStartDateChange = (field: "plantStartFrom" | "plantStartTo", value: string) => {
    setDraftFilters(current => ({ ...current, [field]: value }));
  };

  const handleOverlapChange = ({ checked }: CheckboxChange) => {
    setDraftFilters(current => ({ ...current, hasOverlap: checked === true }));
  };

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
                <div className="flex flex-col gap-2">
                  <input
                    className={DATE_INPUT_CLASS_NAME}
                    type="date"
                    value={draftFilters.plantStartFrom}
                    onChange={event => handlePlantStartDateChange("plantStartFrom", event.target.value)}
                    aria-label={t("Plant start date from")}
                  />
                  <input
                    className={DATE_INPUT_CLASS_NAME}
                    type="date"
                    value={draftFilters.plantStartTo}
                    onChange={event => handlePlantStartDateChange("plantStartTo", event.target.value)}
                    aria-label={t("Plant start date to")}
                  />
                </div>
              </FilterCard>
              <FilterCard label={t("Restoration Practice")}>
                <select
                  className={SELECT_CLASS_NAME}
                  value={draftFilters.practice[0] ?? ""}
                  onChange={handlePracticeChange}
                >
                  <option value="">{t("Please Select")}</option>
                  {RESTORATION_PRACTICE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
              </FilterCard>
              <FilterCard label={t("Target Land Use")}>
                <select
                  className={SELECT_CLASS_NAME}
                  value={draftFilters.targetSys[0] ?? ""}
                  onChange={handleTargetLandUseChange}
                >
                  <option value="">{t("Please Select")}</option>
                  {TARGET_LAND_USE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
              </FilterCard>
              <FilterCard label={t("Submission Cycle")}>
                <select className={SELECT_CLASS_NAME} defaultValue="">
                  <option value="">{t("Please Select")}</option>
                  {[1, 2, 3, 4, 5].map(option => (
                    <option key={option} value={option}>
                      {t("Option {option}", { option })}
                    </option>
                  ))}
                </select>
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
