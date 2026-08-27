import { useCallback, useEffect, useState } from "react";
import { useNotify } from "react-admin";

import {
  createPolygonAttributeDefinition,
  deletePolygonAttributeDefinition,
  loadPolygonAttributeDefinitions,
  PolygonAttributeDefinitionDto,
  updatePolygonAttributeDefinition,
  usePolygonAttributeDefinitions
} from "@/connections/PolygonAttributeDefinitions";
import ApiSlice from "@/store/apiSlice";

import { formatErrorMessage } from "./formatErrorMessage";
import {
  buildUpdatePayload,
  emptyAttribute,
  emptyOption,
  isFrameworkKey,
  syncOrder,
  toLocalAttribute
} from "./mappers";
import { LocalAttribute } from "./types";
import { validateAttributes } from "./validateAttributes";

type UsePolygonOptionalAttributesEditorResult = {
  attributes: LocalAttribute[];
  definitionsLoaded: boolean;
  isSaving: boolean;
  toggleExpand: (localId: string) => void;
  updateAttribute: (localId: string, patch: Partial<LocalAttribute>) => void;
  addAttribute: () => void;
  moveAttribute: (localId: string, direction: -1 | 1) => void;
  removeAttribute: (localId: string) => void;
  addOption: (attributeLocalId: string) => void;
  updateOption: (attributeLocalId: string, optionLocalId: string, label: string) => void;
  removeOption: (attributeLocalId: string, optionLocalId: string) => void;
  moveOption: (attributeLocalId: string, optionLocalId: string, direction: -1 | 1) => void;
  handleSave: () => Promise<void>;
};

export const usePolygonOptionalAttributesEditor = (
  frameworkKey: string | undefined
): UsePolygonOptionalAttributesEditorResult => {
  const notify = useNotify();
  const [definitionsLoaded, { data: definitions, loadFailure }] = usePolygonAttributeDefinitions({ frameworkKey });

  const [attributes, setAttributes] = useState<LocalAttribute[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadedFrameworkKey, setLoadedFrameworkKey] = useState<string>();

  const syncAttributesFromServer = useCallback((defs: PolygonAttributeDefinitionDto[] | undefined) => {
    setAttributes(syncOrder((defs ?? []).map(toLocalAttribute)));
  }, []);

  const reloadFromServer = useCallback(async () => {
    if (frameworkKey == null) return;
    ApiSlice.pruneCache("polygonAttributeDefinitions");
    const { data: refreshed } = await loadPolygonAttributeDefinitions({ frameworkKey });
    syncAttributesFromServer(refreshed);
    setLoadedFrameworkKey(frameworkKey);
  }, [frameworkKey, syncAttributesFromServer]);

  useEffect(() => {
    if (frameworkKey != null && definitionsLoaded && loadedFrameworkKey !== frameworkKey) {
      syncAttributesFromServer(definitions);
      setLoadedFrameworkKey(frameworkKey);
    }
  }, [definitions, definitionsLoaded, frameworkKey, loadedFrameworkKey, syncAttributesFromServer]);

  useEffect(() => {
    if (loadFailure != null) {
      notify(`Failed to load optional attributes: ${formatErrorMessage(loadFailure)}`, { type: "error" });
    }
  }, [loadFailure, notify]);

  const toggleExpand = useCallback((localId: string) => {
    setAttributes(prev => prev.map(a => (a.localId === localId ? { ...a, isExpanded: !a.isExpanded } : a)));
  }, []);

  const updateAttribute = useCallback((localId: string, patch: Partial<LocalAttribute>) => {
    setAttributes(prev => prev.map(a => (a.localId === localId ? { ...a, ...patch } : a)));
  }, []);

  const addAttribute = useCallback(() => {
    setAttributes(prev => syncOrder([...prev, emptyAttribute(prev.length)]));
  }, []);

  const moveAttribute = useCallback((localId: string, direction: -1 | 1) => {
    setAttributes(prev => {
      const index = prev.findIndex(a => a.localId === localId);
      if (index === -1) return prev;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const reordered = [...prev];
      [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
      return syncOrder(reordered);
    });
  }, []);

  const removeAttribute = useCallback(
    (localId: string) => {
      setAttributes(prev => {
        const attribute = prev.find(a => a.localId === localId);
        if (attribute == null) return prev;

        if (attribute.uuid != null && attribute.hasValues) {
          notify("Cannot delete an attribute that already has polygon values. Deactivate it instead.", {
            type: "warning"
          });
          return prev;
        }

        return syncOrder(prev.filter(a => a.localId !== localId));
      });
    },
    [notify]
  );

  const addOption = useCallback((attributeLocalId: string) => {
    setAttributes(prev =>
      prev.map(a => (a.localId === attributeLocalId ? { ...a, options: [...a.options, emptyOption()] } : a))
    );
  }, []);

  const updateOption = useCallback((attributeLocalId: string, optionLocalId: string, label: string) => {
    setAttributes(prev =>
      prev.map(a =>
        a.localId === attributeLocalId
          ? { ...a, options: a.options.map(o => (o.localId === optionLocalId ? { ...o, label } : o)) }
          : a
      )
    );
  }, []);

  const removeOption = useCallback((attributeLocalId: string, optionLocalId: string) => {
    setAttributes(prev =>
      prev.map(a =>
        a.localId === attributeLocalId ? { ...a, options: a.options.filter(o => o.localId !== optionLocalId) } : a
      )
    );
  }, []);

  const moveOption = useCallback((attributeLocalId: string, optionLocalId: string, direction: -1 | 1) => {
    setAttributes(prev =>
      prev.map(a => {
        if (a.localId !== attributeLocalId) return a;
        const index = a.options.findIndex(o => o.localId === optionLocalId);
        if (index === -1) return a;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= a.options.length) return a;
        const options = [...a.options];
        [options[index], options[newIndex]] = [options[newIndex], options[index]];
        return { ...a, options };
      })
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!isFrameworkKey(frameworkKey)) {
      notify("Invalid framework key.", { type: "error" });
      return;
    }

    const validationError = validateAttributes(attributes);
    if (validationError != null) {
      notify(validationError, { type: "warning" });
      return;
    }

    setIsSaving(true);
    try {
      const originalByUuid = new Map((definitions ?? []).map(d => [d.uuid, d]));
      const deleted = (definitions ?? []).filter(d => !attributes.some(a => a.uuid === d.uuid));
      const created = attributes.filter(a => a.uuid == null);
      const updated = attributes.filter(a => a.uuid != null && originalByUuid.has(a.uuid));

      for (const attr of deleted) {
        await deletePolygonAttributeDefinition(attr.uuid);
      }

      for (const attr of created) {
        await createPolygonAttributeDefinition({
          label: attr.label.trim(),
          inputType: attr.inputType,
          frameworkKey,
          order: attr.order,
          options: attr.options.map(o => ({ label: o.label.trim() }))
        });
      }

      for (const attr of updated) {
        const original = attr.uuid != null ? originalByUuid.get(attr.uuid) : undefined;
        if (original == null) continue;
        const payload = buildUpdatePayload(attr, original);
        if (payload != null) {
          await updatePolygonAttributeDefinition(payload, { id: attr.uuid });
        }
      }

      notify("Optional attributes saved successfully.", { type: "success" });
      await reloadFromServer();
    } catch (error) {
      notify(`Error saving optional attributes: ${formatErrorMessage(error)}`, { type: "error" });
      // Discard local edits and show server truth after a partial/failed save.
      try {
        await reloadFromServer();
      } catch (reloadError) {
        notify(`Failed to reload after save error: ${formatErrorMessage(reloadError)}`, { type: "error" });
      }
    } finally {
      setIsSaving(false);
    }
  }, [attributes, definitions, frameworkKey, notify, reloadFromServer]);

  return {
    attributes,
    definitionsLoaded,
    isSaving,
    toggleExpand,
    updateAttribute,
    addAttribute,
    moveAttribute,
    removeAttribute,
    addOption,
    updateOption,
    removeOption,
    moveOption,
    handleSave
  };
};
