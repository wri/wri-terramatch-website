import { useT } from "@transifex/react";
import { Dispatch, FC, ReactNode, SetStateAction } from "react";

import { useRestorationPracticeOptions } from "@/hooks/translation/useRestorationPracticeOptions";
import { useSubmissionStatusOptions } from "@/hooks/translation/useSubmissionStatusOptions";
import { useTargetLandUseOptions } from "@/hooks/translation/useTargetLandUseOptions";
import { useValidationStatusOptions } from "@/hooks/translation/useValidationStatusOptions";
import { LandscapeCode } from "@/utils/landscapeUtils";

import { COHORT_OPTIONS, LANDSCAPE_OPTIONS } from "../constants";
import { ExplorerFilterState } from "../hooks/usePolygonExplorerFilters";

type ExplorerFilterPanelProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filters: ExplorerFilterState;
  setFilters: Dispatch<SetStateAction<ExplorerFilterState>>;
  onClear: () => void;
  activeFilterCount: number;
};

const toggleArrayValue = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value) ? values.filter(item => item !== value) : [...values, value];

const FilterSection: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <div className="border-b border-neutral-200 px-4 py-3">
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">{title}</p>
    {children}
  </div>
);

const CheckboxRow: FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-neutral-700">
    <input type="checkbox" className="accent-blue-600 h-4 w-4" checked={checked} onChange={onChange} />
    {label}
  </label>
);

const ExplorerFilterPanel: FC<ExplorerFilterPanelProps> = ({
  search,
  onSearchChange,
  filters,
  setFilters,
  onClear,
  activeFilterCount
}) => {
  const t = useT();
  const submissionStatusOptions = useSubmissionStatusOptions();
  const validationStatusOptions = useValidationStatusOptions();
  const practiceOptions = useRestorationPracticeOptions();
  const targetLandUseOptions = useTargetLandUseOptions();

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-r border-neutral-200 bg-white">
      <div className="flex items-center justify-between px-4 pt-4">
        <p className="text-sm font-semibold text-neutral-800">{t("Filters")}</p>
        {activeFilterCount > 0 ? (
          <button type="button" className="text-blue-600 text-xs font-medium hover:underline" onClick={onClear}>
            {t("Clear all ({count})", { count: activeFilterCount })}
          </button>
        ) : null}
      </div>

      <div className="px-4 py-3">
        <input
          type="search"
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          placeholder={t("Search site, polygon name or UUID")}
          className="focus:border-blue-500 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none"
        />
      </div>

      <FilterSection title={t("Landscape")}>
        <select
          value={filters.landscape}
          onChange={event =>
            setFilters(current => ({ ...current, landscape: event.target.value as LandscapeCode | "" }))
          }
          className="focus:border-blue-500 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none"
        >
          <option value="">{t("All landscapes")}</option>
          {LANDSCAPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title={t("Project cohort")}>
        {COHORT_OPTIONS.map(option => (
          <CheckboxRow
            key={option.value}
            label={option.label}
            checked={filters.projectCohort.includes(option.value)}
            onChange={() =>
              setFilters(current => ({
                ...current,
                projectCohort: toggleArrayValue(current.projectCohort, option.value)
              }))
            }
          />
        ))}
      </FilterSection>

      <FilterSection title={t("Submission status")}>
        {submissionStatusOptions.map(option => (
          <CheckboxRow
            key={option.value}
            label={option.label}
            checked={filters.polygonStatus.includes(option.value)}
            onChange={() =>
              setFilters(current => ({
                ...current,
                polygonStatus: toggleArrayValue(current.polygonStatus, option.value)
              }))
            }
          />
        ))}
      </FilterSection>

      <FilterSection title={t("Validation status")}>
        {validationStatusOptions.map(option => (
          <CheckboxRow
            key={option.value}
            label={option.label}
            checked={filters.validationStatus.includes(option.value)}
            onChange={() =>
              setFilters(current => ({
                ...current,
                validationStatus: toggleArrayValue(current.validationStatus, option.value)
              }))
            }
          />
        ))}
      </FilterSection>

      <FilterSection title={t("Restoration practice")}>
        {practiceOptions.map(option => (
          <CheckboxRow
            key={option.value}
            label={option.label}
            checked={filters.practice.includes(option.value)}
            onChange={() =>
              setFilters(current => ({ ...current, practice: toggleArrayValue(current.practice, option.value) }))
            }
          />
        ))}
      </FilterSection>

      <FilterSection title={t("Target land use")}>
        {targetLandUseOptions.map(option => (
          <CheckboxRow
            key={option.value}
            label={option.label}
            checked={filters.targetSys.includes(option.value)}
            onChange={() =>
              setFilters(current => ({ ...current, targetSys: toggleArrayValue(current.targetSys, option.value) }))
            }
          />
        ))}
      </FilterSection>

      <FilterSection title={t("Other")}>
        <CheckboxRow
          label={t("Has overlap")}
          checked={filters.hasOverlap}
          onChange={() => setFilters(current => ({ ...current, hasOverlap: !current.hasOverlap }))}
        />
        <CheckboxRow
          label={t("Include test projects")}
          checked={filters.includeTestProjects}
          onChange={() => setFilters(current => ({ ...current, includeTestProjects: !current.includeTestProjects }))}
        />
      </FilterSection>
    </aside>
  );
};

export default ExplorerFilterPanel;
