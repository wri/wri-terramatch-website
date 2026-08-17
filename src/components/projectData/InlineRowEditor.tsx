import AttributeEditFields, {
  draftFromPolygon,
  hasAttributeChanges,
  useAttributeDraft
} from "@/components/projectData/AttributeEditFields";
import { BulkSitePolygonAttributeChanges } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

/**
 * The single-row inline editor — a full-width expansion rendered directly under the row being
 * edited. It reuses the exact same field components as the bulk editor, seeded from the polygon's
 * current values, and (via the shared dirty-field model) sends only the fields the reviewer changes.
 */

export interface InlineRowEditorProps {
  polygon: SitePolygonLightDto;
  colSpan: number;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (changes: BulkSitePolygonAttributeChanges) => Promise<boolean>;
}

const InlineRowEditor = ({ polygon, colSpan, isSaving, onCancel, onSave }: InlineRowEditorProps) => {
  const { draft, setField, changes } = useAttributeDraft(draftFromPolygon(polygon));

  const handleSave = async () => {
    if (!hasAttributeChanges(changes)) {
      onCancel();
      return;
    }
    const ok = await onSave(changes);
    if (ok) onCancel();
  };

  return (
    <tr className="bg-theme-neutral-50 border-b border-theme-neutral-200">
      <td colSpan={colSpan} className="px-4 py-3">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-theme-neutral-900">Edit “{polygon.name ?? "Unnamed polygon"}”</p>
          <AttributeEditFields draft={draft} setField={setField} disabled={isSaving} />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded border border-theme-neutral-200 px-3 py-1 text-xs text-theme-neutral-600 hover:bg-theme-neutral-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasAttributeChanges(changes) || isSaving}
              className="rounded border border-theme-primary-500 bg-theme-primary-500 px-3 py-1 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default InlineRowEditor;
