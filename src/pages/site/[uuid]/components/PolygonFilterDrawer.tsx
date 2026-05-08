import type { DateValue } from "@ark-ui/react";
import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import React, { FC, useCallback, useMemo, useState } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import DateRangeInput from "@/redesignComponents/Forms/Inputs/DateInputs/DateRangeInputs/DateRangeInput";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";
import { formatDateValue, getDateFormatString } from "@/utils/date";

export type PolygonActiveFilter = {
  id: string;
  label: string;
};

const SUBMISSION_VALUES = ["draft", "pending-approval", "information-required", "approved"] as const;
const SYSTEM_VALIDATION_VALUES = ["not-started", "failed", "partially-passed", "passed"] as const;

type SubmissionValue = (typeof SUBMISSION_VALUES)[number];
type SystemValidationValue = (typeof SYSTEM_VALIDATION_VALUES)[number];

const SELECT_ITEMS = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" }
] as const;

interface PolygonFilterDrawerProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PolygonFilterDrawer: FC<PolygonFilterDrawerProps> = ({ trigger, open, onOpenChange }) => {
  const t = useT();
  const browserLocale = useMemo(() => navigator.language, []);
  const dateFormatPattern = useMemo(() => getDateFormatString(browserLocale), [browserLocale]);

  const [submissionSelected, setSubmissionSelected] = useState<Set<SubmissionValue>>(
    () => new Set<SubmissionValue>(["draft"])
  );
  const [systemValidationSelected, setSystemValidationSelected] = useState<Set<SystemValidationValue>>(
    () => new Set<SystemValidationValue>(["failed", "partially-passed"])
  );
  const [plantDateRange, setPlantDateRange] = useState<DateValue[]>([]);
  const [restorationPractice, setRestorationPractice] = useState<string | undefined>(undefined);
  const [targetLandUse, setTargetLandUse] = useState<string | undefined>(undefined);
  const [submissionCycle, setSubmissionCycle] = useState<string | undefined>(undefined);
  const [showOverlap, setShowOverlap] = useState(true);

  const submissionLabels = useMemo(
    (): Record<SubmissionValue, string> => ({
      draft: t("Draft"),
      "pending-approval": t("Pending Approval"),
      "information-required": t("Information Required"),
      approved: t("Approved")
    }),
    [t]
  );

  const systemValidationLabels = useMemo(
    (): Record<SystemValidationValue, string> => ({
      "not-started": t("Not Started"),
      failed: t("Failed"),
      "partially-passed": t("Partially Passed"),
      passed: t("Passed")
    }),
    [t]
  );

  const activeFilters = useMemo((): PolygonActiveFilter[] => {
    const out: PolygonActiveFilter[] = [];

    for (const value of submissionSelected) {
      out.push({ id: `submission:${value}`, label: submissionLabels[value] });
    }
    for (const value of systemValidationSelected) {
      out.push({ id: `validation:${value}`, label: systemValidationLabels[value] });
    }

    if (plantDateRange.length === 2) {
      const start = formatDateValue(plantDateRange[0], dateFormatPattern);
      const end = formatDateValue(plantDateRange[1], dateFormatPattern);
      out.push({
        id: "plant-date",
        label: `${start} – ${end}`
      });
    }

    if (restorationPractice != null) {
      const item = SELECT_ITEMS.find(i => i.value === restorationPractice);
      out.push({
        id: `restoration:${restorationPractice}`,
        label: item?.label ?? restorationPractice
      });
    }

    if (targetLandUse != null) {
      const item = SELECT_ITEMS.find(i => i.value === targetLandUse);
      out.push({
        id: `target:${targetLandUse}`,
        label: item?.label ?? targetLandUse
      });
    }

    if (submissionCycle != null) {
      const item = SELECT_ITEMS.find(i => i.value === submissionCycle);
      out.push({
        id: `cycle:${submissionCycle}`,
        label: item?.label ?? submissionCycle
      });
    }

    if (showOverlap) {
      out.push({ id: "overlap", label: t("Show Polygon Overlaps") });
    }

    return out;
  }, [
    dateFormatPattern,
    plantDateRange,
    restorationPractice,
    showOverlap,
    submissionCycle,
    submissionLabels,
    submissionSelected,
    systemValidationLabels,
    systemValidationSelected,
    targetLandUse,
    t
  ]);

  const removeFilter = useCallback((id: string) => {
    if (id.startsWith("submission:")) {
      const value = id.slice("submission:".length) as SubmissionValue;
      setSubmissionSelected(prev => {
        const next = new Set(prev);
        next.delete(value);
        return next;
      });
      return;
    }
    if (id.startsWith("validation:")) {
      const value = id.slice("validation:".length) as SystemValidationValue;
      setSystemValidationSelected(prev => {
        const next = new Set(prev);
        next.delete(value);
        return next;
      });
      return;
    }
    if (id === "plant-date") {
      setPlantDateRange([]);
      return;
    }
    if (id.startsWith("restoration:")) {
      setRestorationPractice(undefined);
      return;
    }
    if (id.startsWith("target:")) {
      setTargetLandUse(undefined);
      return;
    }
    if (id.startsWith("cycle:")) {
      setSubmissionCycle(undefined);
      return;
    }
    if (id === "overlap") {
      setShowOverlap(false);
    }
  }, []);

  const toggleSubmission = useCallback((value: SubmissionValue, checked: boolean) => {
    setSubmissionSelected(prev => {
      const next = new Set(prev);
      if (checked) next.add(value);
      else next.delete(value);
      return next;
    });
  }, []);

  const toggleSystemValidation = useCallback((value: SystemValidationValue, checked: boolean) => {
    setSystemValidationSelected(prev => {
      const next = new Set(prev);
      if (checked) next.add(value);
      else next.delete(value);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSubmissionSelected(new Set());
    setSystemValidationSelected(new Set());
    setPlantDateRange([]);
    setRestorationPractice(undefined);
    setTargetLandUse(undefined);
    setSubmissionCycle(undefined);
    setShowOverlap(false);
  }, []);

  const handleRestorationChange = useCallback((value: string[]) => {
    setRestorationPractice(value[0]);
  }, []);

  const handleTargetLandUseChange = useCallback((value: string[]) => {
    setTargetLandUse(value[0]);
  }, []);

  const handleSubmissionCycleChange = useCallback((value: string[]) => {
    setSubmissionCycle(value[0]);
  }, []);

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
              <Flex className="flex-1 flex-wrap gap-2">
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
              <FilterCard label={t("Submission Status")}>
                <Checkbox
                  name="submission-status-draft"
                  value="draft"
                  checked={submissionSelected.has("draft")}
                  onCheckedChange={({ checked }) => toggleSubmission("draft", Boolean(checked))}
                >
                  {t("Draft")}
                </Checkbox>
                <Checkbox
                  name="submission-status-pending-approval"
                  value="pending-approval"
                  checked={submissionSelected.has("pending-approval")}
                  onCheckedChange={({ checked }) => toggleSubmission("pending-approval", Boolean(checked))}
                >
                  {t("Pending Approval")}
                </Checkbox>
                <Checkbox
                  name="submission-status-information-required"
                  value="information-required"
                  checked={submissionSelected.has("information-required")}
                  onCheckedChange={({ checked }) => toggleSubmission("information-required", Boolean(checked))}
                >
                  {t("Information Required")}
                </Checkbox>
                <Checkbox
                  name="submission-status-approved"
                  value="approved"
                  checked={submissionSelected.has("approved")}
                  onCheckedChange={({ checked }) => toggleSubmission("approved", Boolean(checked))}
                >
                  {t("Approved")}
                </Checkbox>
              </FilterCard>
              <FilterCard label={t("System Validation")}>
                <Checkbox
                  name="system-validation-not-started"
                  value="not-started"
                  checked={systemValidationSelected.has("not-started")}
                  onCheckedChange={({ checked }) => toggleSystemValidation("not-started", Boolean(checked))}
                >
                  {t("Not Started")}
                </Checkbox>
                <Checkbox
                  name="system-validation-failed"
                  value="failed"
                  checked={systemValidationSelected.has("failed")}
                  onCheckedChange={({ checked }) => toggleSystemValidation("failed", Boolean(checked))}
                >
                  {t("Failed")}
                </Checkbox>
                <Checkbox
                  name="system-validation-partially-passed"
                  value="partially-passed"
                  checked={systemValidationSelected.has("partially-passed")}
                  onCheckedChange={({ checked }) => toggleSystemValidation("partially-passed", Boolean(checked))}
                >
                  {t("Partially Passed")}
                </Checkbox>
                <Checkbox
                  name="system-validation-passed"
                  value="passed"
                  checked={systemValidationSelected.has("passed")}
                  onCheckedChange={({ checked }) => toggleSystemValidation("passed", Boolean(checked))}
                >
                  {t("Passed")}
                </Checkbox>
              </FilterCard>
              <FilterCard label={t("Plant Start Date")}>
                <DateRangeInput value={plantDateRange} onValueChange={setPlantDateRange} />
              </FilterCard>
              <FilterCard label={t("Restoration Practice")}>
                <SelectInput
                  items={[...SELECT_ITEMS]}
                  value={restorationPractice != null ? [restorationPractice] : []}
                  onChange={handleRestorationChange}
                  placeholder={t("Please Select")}
                />
              </FilterCard>
              <FilterCard label={t("Target Land Use")}>
                <SelectInput
                  items={[...SELECT_ITEMS]}
                  value={targetLandUse != null ? [targetLandUse] : []}
                  onChange={handleTargetLandUseChange}
                  placeholder={t("Please Select")}
                />
              </FilterCard>
              <FilterCard label={t("Submission Cycle")}>
                <SelectInput
                  items={[...SELECT_ITEMS]}
                  value={submissionCycle != null ? [submissionCycle] : []}
                  onChange={handleSubmissionCycleChange}
                  placeholder={t("Please Select")}
                />
              </FilterCard>
              <FilterCard label={t("Overlap")}>
                <Switch
                  name="overlap"
                  checked={showOverlap}
                  onCheckedChange={({ checked }: { checked: boolean }) => setShowOverlap(Boolean(checked))}
                >
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
                  onClick: clearAll
                },
                {
                  children: t("Apply"),
                  variant: "primary",
                  onClick: onClose
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
