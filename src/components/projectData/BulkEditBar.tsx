import { useState } from "react";

import AttributeEditFields, {
  hasAttributeChanges,
  useAttributeDraft
} from "@/components/projectData/AttributeEditFields";
import { BulkSitePolygonAttributeChanges } from "@/connections/SitePolygons";
import { CheckIcon, CloseIcon } from "@/redesignComponents/foundations/Icons";

/**
 * The selection action bar for the Polygons view. It appears only when at least one polygon is
 * selected and offers the two project-level actions the PRD asks for without navigating site by
 * site: bulk-approve the selected polygons, and bulk-edit their attributes in one request. The
 * attribute editor is a light inline popover (not a modal) reusing the shared `AttributeEditFields`.
 */

export interface BulkEditBarProps {
  selectedCount: number;
  /** How many of the selected polygons are not already approved — the real Approve target count. */
  approvableCount: number;
  isApproving: boolean;
  isSavingAttributes: boolean;
  onClear: () => void;
  onApprove: () => void;
  onApplyAttributes: (changes: BulkSitePolygonAttributeChanges) => Promise<boolean>;
}

const BulkEditBar = ({
  selectedCount,
  approvableCount,
  isApproving,
  isSavingAttributes,
  onClear,
  onApprove,
  onApplyAttributes
}: BulkEditBarProps) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const { draft, setField, reset, changes } = useAttributeDraft();

  const closeEditor = () => {
    setEditorOpen(false);
    reset();
  };

  const handleApply = async () => {
    if (!hasAttributeChanges(changes)) return;
    const ok = await onApplyAttributes(changes);
    if (ok) closeEditor();
  };

  return (
    <div className="sticky bottom-0 z-10">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-theme-primary-200 bg-theme-primary-100 px-3 py-2">
        <span className="text-xs font-semibold text-theme-neutral-900">{selectedCount.toLocaleString()} selected</span>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-theme-neutral-600 underline-offset-2 hover:underline"
        >
          Clear
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onApprove}
            disabled={approvableCount === 0 || isApproving}
            className="inline-flex items-center gap-1 rounded border border-theme-success-500 bg-white px-3 py-1 text-xs font-semibold text-theme-success-900 hover:bg-theme-success-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckIcon boxSize={2.5} />
            {isApproving ? "Approving…" : `Approve ${approvableCount}`}
          </button>
          <button
            type="button"
            onClick={() => setEditorOpen(open => !open)}
            aria-expanded={editorOpen}
            className={
              editorOpen
                ? "rounded border border-theme-primary-500 bg-white px-3 py-1 text-xs font-semibold text-theme-primary-500"
                : "rounded border border-theme-primary-500 bg-theme-primary-500 px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
            }
          >
            Edit attributes
          </button>
        </div>
      </div>

      {editorOpen && (
        <div className="shadow-lg mt-1 w-full max-w-md rounded-lg border border-theme-neutral-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-theme-neutral-900">
              Edit {selectedCount} {selectedCount === 1 ? "polygon" : "polygons"}
            </p>
            <button
              type="button"
              onClick={closeEditor}
              aria-label="Close editor"
              className="text-theme-neutral-400 hover:text-theme-neutral-700"
            >
              <CloseIcon boxSize={2.5} />
            </button>
          </div>

          <p className="mb-3 text-[11px] text-theme-neutral-500">
            Only the fields you change are applied. Untouched fields are left as they are on each polygon.
          </p>

          <AttributeEditFields draft={draft} setField={setField} disabled={isSavingAttributes} />

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeEditor}
              className="rounded border border-theme-neutral-200 px-3 py-1 text-xs text-theme-neutral-600 hover:bg-theme-neutral-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!hasAttributeChanges(changes) || isSavingAttributes}
              className="rounded border border-theme-primary-500 bg-theme-primary-500 px-3 py-1 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingAttributes ? "Applying…" : `Apply to ${selectedCount}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkEditBar;
