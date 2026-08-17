import { useCallback, useMemo, useState } from "react";

import { BulkSitePolygonAttributeChanges } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useRestorationPracticeOptions } from "@/hooks/translation/useRestorationPracticeOptions";
import { useTargetLandUseOptions } from "@/hooks/translation/useTargetLandUseOptions";
import { useTreeDistributionOptions } from "@/hooks/translation/useTreeDistributionOptions";

/**
 * The one field set shared by both editors — the bulk-edit popover and the single-row inline editor.
 *
 * Both editors need the exact same controls (practice, target system, distribution, submission
 * cycle, plant start, trees) sourced from the exact same option lists the polygon edit drawer uses
 * (`useRestorationPracticeOptions` / `useTargetLandUseOptions` / `useTreeDistributionOptions`), so
 * they live here once. The dirty-field model (`useAttributeDraft`) is the load-bearing part: only a
 * field the user actually touches is sent to the API. An untouched field is omitted entirely —
 * because per the DTO an empty value means "clear this field", so sending an untouched-and-empty
 * field would silently wipe data on every selected polygon.
 */

export type AttributeField = "practice" | "targetSys" | "distr" | "submissionCycle" | "plantStart" | "numTrees";

export interface AttributeDraft {
  practice: string[];
  targetSys: string;
  distr: string[];
  submissionCycle: string;
  /** yyyy-mm-dd (native date input); converted to ISO on send. */
  plantStart: string;
  /** Kept as a string so an in-progress / empty input is representable; parsed on send. */
  numTrees: string;
}

export const EMPTY_DRAFT: AttributeDraft = {
  practice: [],
  targetSys: "",
  distr: [],
  submissionCycle: "",
  plantStart: "",
  numTrees: ""
};

// Submission cycle is a small fixed enum on SitePolygonLightDto ("1".."5"); there is no shared
// options constant for it, so its canonical set is taken straight from that schema enum.
const SUBMISSION_CYCLE_VALUES = ["1", "2", "3", "4", "5"] as const;

/** Seed a draft from a polygon's current values, so the inline editor opens pre-filled. */
export const draftFromPolygon = (polygon: SitePolygonLightDto): AttributeDraft => ({
  practice: polygon.practice ?? [],
  targetSys: polygon.targetSys ?? "",
  distr: polygon.distr ?? [],
  submissionCycle: polygon.submissionCycle ?? "",
  plantStart: polygon.plantStart != null && polygon.plantStart !== "" ? polygon.plantStart.slice(0, 10) : "",
  numTrees: polygon.numTrees != null ? String(polygon.numTrees) : ""
});

/** Build the API payload from only the fields the user touched. */
export const buildAttributeChanges = (
  draft: AttributeDraft,
  touched: Set<AttributeField>
): BulkSitePolygonAttributeChanges => {
  const changes: BulkSitePolygonAttributeChanges = {};
  if (touched.has("practice")) changes.practice = draft.practice;
  if (touched.has("distr")) changes.distr = draft.distr;
  if (touched.has("targetSys")) changes.targetSys = draft.targetSys;
  if (touched.has("submissionCycle")) changes.submissionCycle = draft.submissionCycle;
  if (touched.has("plantStart")) {
    // Empty string clears the field (per the DTO); otherwise send a midnight-UTC ISO timestamp.
    changes.plantStart = draft.plantStart === "" ? "" : `${draft.plantStart}T00:00:00Z`;
  }
  if (touched.has("numTrees")) {
    // numTrees has no documented "clear" semantics, so only send a parseable number — never an
    // empty value that the API would have to guess at.
    const parsed = Number(draft.numTrees);
    if (draft.numTrees.trim() !== "" && Number.isFinite(parsed)) changes.numTrees = parsed;
  }
  return changes;
};

export const hasAttributeChanges = (changes: BulkSitePolygonAttributeChanges): boolean =>
  Object.keys(changes).length > 0;

/** Owns a draft + the set of touched fields, and derives the dirty-only payload. */
export const useAttributeDraft = (seed?: AttributeDraft) => {
  const [draft, setDraft] = useState<AttributeDraft>(seed ?? EMPTY_DRAFT);
  const [touched, setTouched] = useState<Set<AttributeField>>(() => new Set());

  const setField = useCallback(<K extends AttributeField>(field: K, value: AttributeDraft[K]) => {
    setDraft(prev => ({ ...prev, [field]: value }));
    setTouched(prev => new Set(prev).add(field));
  }, []);

  const reset = useCallback((next?: AttributeDraft) => {
    setDraft(next ?? EMPTY_DRAFT);
    setTouched(new Set());
  }, []);

  const changes = useMemo(() => buildAttributeChanges(draft, touched), [draft, touched]);

  return { draft, touched, setField, reset, changes };
};

const fieldLabelClass = "text-[11px] font-medium uppercase tracking-wide text-theme-neutral-400";
const controlClass =
  "w-full rounded border border-theme-neutral-200 px-2 py-1 text-xs text-theme-neutral-900 focus:border-theme-primary-500 focus:outline-none";

const Chip = ({
  label,
  active,
  onClick,
  disabled
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={
      active
        ? "rounded-full border border-theme-primary-500 bg-theme-primary-100 px-2 py-0.5 text-[11px] font-medium text-theme-primary-500 disabled:opacity-50"
        : "rounded-full border border-theme-neutral-200 px-2 py-0.5 text-[11px] text-theme-neutral-600 hover:bg-theme-neutral-100 disabled:opacity-50"
    }
  >
    {label}
  </button>
);

const MultiChips = ({
  label,
  options,
  value,
  onChange,
  disabled
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <span className={fieldLabelClass}>{label}</span>
    <div className="flex flex-wrap gap-1">
      {options.map(option => {
        const active = value.includes(option.value);
        return (
          <Chip
            key={option.value}
            label={option.label}
            active={active}
            disabled={disabled}
            onClick={() => onChange(active ? value.filter(v => v !== option.value) : [...value, option.value])}
          />
        );
      })}
    </div>
  </div>
);

export interface AttributeEditFieldsProps {
  draft: AttributeDraft;
  setField: <K extends AttributeField>(field: K, value: AttributeDraft[K]) => void;
  disabled?: boolean;
  /** Restrict to a subset of fields (the inline row editor keeps it tight). */
  fields?: AttributeField[];
}

/**
 * Presentational field set. Given a draft and a `setField` callback it renders the controls; it
 * holds no state of its own, so the same instance drives both the bulk popover and the inline row.
 */
const AttributeEditFields = ({ draft, setField, disabled, fields }: AttributeEditFieldsProps) => {
  const practiceOptions = useRestorationPracticeOptions();
  const targetOptions = useTargetLandUseOptions();
  const distributionOptions = useTreeDistributionOptions();

  const show = (field: AttributeField) => fields == null || fields.includes(field);

  return (
    <div className="flex flex-col gap-3">
      {show("practice") && (
        <MultiChips
          label="Restoration practice"
          options={practiceOptions}
          value={draft.practice}
          onChange={next => setField("practice", next)}
          disabled={disabled}
        />
      )}

      {show("targetSys") && (
        <label className="flex flex-col gap-1">
          <span className={fieldLabelClass}>Target land use system</span>
          <select
            className={controlClass}
            disabled={disabled}
            value={draft.targetSys}
            onChange={event => setField("targetSys", event.target.value)}
          >
            <option value="">— No change / clear —</option>
            {targetOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {show("distr") && (
        <MultiChips
          label="Tree distribution"
          options={distributionOptions}
          value={draft.distr}
          onChange={next => setField("distr", next)}
          disabled={disabled}
        />
      )}

      {show("submissionCycle") && (
        <label className="flex flex-col gap-1">
          <span className={fieldLabelClass}>Submission cycle</span>
          <select
            className={controlClass}
            disabled={disabled}
            value={draft.submissionCycle}
            onChange={event => setField("submissionCycle", event.target.value)}
          >
            <option value="">— No change / clear —</option>
            {SUBMISSION_CYCLE_VALUES.map(cycle => (
              <option key={cycle} value={cycle}>
                {cycle}
              </option>
            ))}
          </select>
        </label>
      )}

      {show("plantStart") && (
        <label className="flex flex-col gap-1">
          <span className={fieldLabelClass}>Plant start</span>
          <input
            type="date"
            lang="en-GB"
            className={controlClass}
            disabled={disabled}
            value={draft.plantStart}
            onChange={event => setField("plantStart", event.target.value)}
          />
        </label>
      )}

      {show("numTrees") && (
        <label className="flex flex-col gap-1">
          <span className={fieldLabelClass}>Trees</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            className={controlClass}
            disabled={disabled}
            value={draft.numTrees}
            onChange={event => setField("numTrees", event.target.value)}
          />
        </label>
      )}
    </div>
  );
};

export default AttributeEditFields;
