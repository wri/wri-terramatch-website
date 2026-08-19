import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Remove as RemoveIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { isEqual } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useNotify } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
  createPolygonAttributeDefinition,
  deletePolygonAttributeDefinition,
  loadPolygonAttributeDefinitions,
  PolygonAttributeDefinitionDto,
  updatePolygonAttributeDefinition,
  usePolygonAttributeDefinitions
} from "@/connections/PolygonAttributeDefinitions";
import { useReportingFramework } from "@/connections/ReportingFramework";
import ApiSlice from "@/store/apiSlice";

const OPTION_INPUT_PLACEHOLDER = "Option label";

type LocalOption = {
  localId: string;
  uuid?: string;
  label: string;
  value?: string;
};

type LocalAttribute = {
  localId: string;
  uuid?: string;
  key?: string;
  label: string;
  isRequired: boolean;
  inputType: "single_select" | "multi_select";
  order: number;
  options: LocalOption[];
  isExpanded: boolean;
  hasValues: boolean;
};

const toLocalOption = (dto: PolygonAttributeDefinitionDto["options"][number]): LocalOption => ({
  localId: dto.uuid,
  uuid: dto.uuid,
  label: dto.label,
  value: dto.value
});

const toLocalAttribute = (dto: PolygonAttributeDefinitionDto): LocalAttribute => ({
  localId: dto.uuid,
  uuid: dto.uuid,
  key: dto.key,
  label: dto.label,
  isRequired: dto.isRequired,
  inputType: dto.inputType,
  order: dto.order,
  options: dto.options.map(toLocalOption),
  isExpanded: false,
  hasValues: dto.hasValues
});

const emptyAttribute = (order: number): LocalAttribute => ({
  localId: uuidv4(),
  label: "",
  isRequired: false,
  inputType: "single_select",
  order,
  options: [],
  isExpanded: true,
  hasValues: false
});

const emptyOption = (): LocalOption => ({
  localId: uuidv4(),
  label: ""
});

const buildUpdatePayload = (
  attribute: LocalAttribute,
  original: PolygonAttributeDefinitionDto
): { label?: string; isRequired?: boolean; order?: number; options?: { uuid?: string; label: string }[] } | null => {
  const payload: {
    label?: string;
    isRequired?: boolean;
    order?: number;
    options?: { uuid?: string; label: string }[];
  } = {};
  if (attribute.label !== original.label) payload.label = attribute.label;
  if (attribute.isRequired !== original.isRequired) payload.isRequired = attribute.isRequired;
  if (attribute.order !== original.order) payload.order = attribute.order;

  const originalOptions = original.options.map(o => ({ uuid: o.uuid, label: o.label }));
  const localOptions = attribute.options.map(o => ({ uuid: o.uuid, label: o.label }));
  if (!isEqual(originalOptions, localOptions)) {
    payload.options = localOptions;
  }

  return Object.keys(payload).length === 0 ? null : payload;
};

const CircularButton = ({
  children,
  onClick,
  disabled,
  color = "primary",
  ariaLabel
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  color?: "primary" | "warning";
  ariaLabel: string;
}) => (
  <IconButton
    size="small"
    disabled={disabled}
    onClick={onClick}
    aria-label={ariaLabel}
    color={color}
    sx={{
      border: 1,
      borderColor: theme => (disabled ? theme.palette.action.disabled : theme.palette[color].main),
      borderRadius: "50%",
      p: 0.5,
      color: theme => (disabled ? theme.palette.action.disabled : theme.palette[color].main)
    }}
  >
    {children}
  </IconButton>
);

export const PolygonOptionalAttributes = () => {
  const { frameworkKey } = useParams<{ frameworkKey: string }>();
  const navigate = useNavigate();
  const notify = useNotify();

  const [frameworkLoaded, { data: framework }] = useReportingFramework({ frameworkKey });
  const [definitionsLoaded, { data: definitions, loadFailure }] = usePolygonAttributeDefinitions({ frameworkKey });

  const [attributes, setAttributes] = useState<LocalAttribute[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadedFrameworkKey, setLoadedFrameworkKey] = useState<string>();

  useEffect(() => {
    if (frameworkKey != null && definitionsLoaded && loadedFrameworkKey !== frameworkKey) {
      setAttributes((definitions ?? []).map(toLocalAttribute).map((a, i) => ({ ...a, order: i })));
      setLoadedFrameworkKey(frameworkKey);
    }
  }, [definitions, definitionsLoaded, frameworkKey, loadedFrameworkKey]);

  useEffect(() => {
    if (loadFailure != null) {
      notify(`Failed to load optional attributes: ${loadFailure.message}`, { type: "error" });
    }
  }, [loadFailure, notify]);

  const toggleExpand = useCallback((localId: string) => {
    setAttributes(prev => prev.map(a => (a.localId === localId ? { ...a, isExpanded: !a.isExpanded } : a)));
  }, []);

  const updateAttribute = useCallback((localId: string, patch: Partial<LocalAttribute>) => {
    setAttributes(prev => prev.map(a => (a.localId === localId ? { ...a, ...patch } : a)));
  }, []);

  const addAttribute = useCallback(() => {
    setAttributes(prev => {
      const reordered = [...prev, emptyAttribute(prev.length)];
      return reordered.map((a, i) => ({ ...a, order: i }));
    });
  }, []);

  const moveAttribute = useCallback((localId: string, direction: -1 | 1) => {
    setAttributes(prev => {
      const index = prev.findIndex(a => a.localId === localId);
      if (index === -1) return prev;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const reordered = [...prev];
      [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
      return reordered.map((a, i) => ({ ...a, order: i }));
    });
  }, []);

  const removeAttribute = useCallback(
    (localId: string) => {
      const attribute = attributes.find(a => a.localId === localId);
      if (attribute == null) return;

      if (attribute.uuid != null && attribute.hasValues) {
        notify("Cannot delete an attribute that already has polygon values. Deactivate it instead.", {
          type: "warning"
        });
        return;
      }

      setAttributes(prev => prev.filter(a => a.localId !== localId).map((a, i) => ({ ...a, order: i })));
    },
    [attributes, notify]
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
    if (frameworkKey == null) return;

    const invalid = attributes.find(a => a.label.trim() === "" || a.options.some(o => o.label.trim() === ""));
    if (invalid != null) {
      notify("Please fill in all attribute labels and option labels before saving.", { type: "warning" });
      return;
    }

    const emptyOptions = attributes.find(a => a.options.length === 0);
    if (emptyOptions != null) {
      notify("Every attribute must have at least one option.", { type: "warning" });
      return;
    }

    const duplicateKeys = new Set<string>();
    const duplicate = attributes.find(a => {
      const key = a.label.trim().toLowerCase();
      if (duplicateKeys.has(key)) return true;
      duplicateKeys.add(key);
      return false;
    });
    if (duplicate != null) {
      notify("Attribute labels must be unique within a framework.", { type: "warning" });
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
          frameworkKey: frameworkKey as PolygonAttributeDefinitionDto["frameworkKey"],
          isRequired: attr.isRequired,
          order: attr.order,
          options: attr.options.map(o => ({ label: o.label.trim() }))
        });
      }

      for (const attr of updated) {
        const payload = buildUpdatePayload(attr, originalByUuid.get(attr.uuid!)!);
        if (payload != null) {
          await updatePolygonAttributeDefinition(payload, { id: attr.uuid });
        }
      }

      notify("Optional attributes saved successfully.", { type: "success" });
      ApiSlice.pruneCache("polygonAttributeDefinitions");
      ApiSlice.pruneIndex("polygonAttributeDefinitions", "");
      setLoadedFrameworkKey(undefined);
      await loadPolygonAttributeDefinitions({ frameworkKey });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      notify(`Error saving optional attributes: ${message}`, { type: "error" });
    } finally {
      setIsSaving(false);
    }
  }, [attributes, definitions, frameworkKey, notify]);

  const handleBack = useCallback(() => {
    navigate(frameworkKey == null ? ".." : `../${frameworkKey}/show`);
  }, [frameworkKey, navigate]);

  return (
    <Box className="p-6">
      <Paper elevation={0} className="mb-6 p-6">
        <Stack direction="row" alignItems="center" spacing={2} className="mb-6">
          <IconButton onClick={handleBack} aria-label="Back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            {frameworkLoaded && framework != null ? `${framework.name} Optional Attributes` : "Optional Attributes"}
          </Typography>
        </Stack>

        <Typography variant="subtitle1" className="mb-2" color="text.secondary">
          Framework
        </Typography>
        <Typography variant="body1" className="mb-6">
          {framework?.name ?? frameworkKey}
        </Typography>

        <Typography variant="h6" className="mb-4">
          Polygon Optional Attributes
        </Typography>

        <Stack spacing={2} className="mb-6">
          {attributes.map((attribute, index) => (
            <Card key={attribute.localId} variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className="cursor-pointer"
                  onClick={() => toggleExpand(attribute.localId)}
                >
                  <Typography variant="subtitle1">{attribute.label || "New Attribute"}</Typography>
                  <Stack direction="row" spacing={1}>
                    <CircularButton
                      onClick={e => {
                        e.stopPropagation();
                        moveAttribute(attribute.localId, -1);
                      }}
                      disabled={index === 0}
                      ariaLabel="Move attribute up"
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </CircularButton>
                    <CircularButton
                      onClick={e => {
                        e.stopPropagation();
                        moveAttribute(attribute.localId, 1);
                      }}
                      disabled={index === attributes.length - 1}
                      ariaLabel="Move attribute down"
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </CircularButton>
                    <CircularButton
                      onClick={e => {
                        e.stopPropagation();
                        removeAttribute(attribute.localId);
                      }}
                      color="warning"
                      ariaLabel="Delete attribute"
                    >
                      <RemoveIcon fontSize="small" />
                    </CircularButton>
                  </Stack>
                </Stack>

                {attribute.isExpanded && (
                  <Box className="mt-4 space-y-4">
                    <TextField
                      label="Key"
                      value={attribute.key ?? "Generated from label"}
                      fullWidth
                      disabled
                      helperText="Stable machine name generated from the label on create."
                    />

                    <TextField
                      label="Label *"
                      value={attribute.label}
                      onChange={e => updateAttribute(attribute.localId, { label: e.target.value })}
                      fullWidth
                      error={attribute.label.trim() === ""}
                      helperText={attribute.label.trim() === "" ? "Label is required" : undefined}
                    />

                    <Stack direction="row" spacing={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={attribute.isRequired}
                            onChange={e => updateAttribute(attribute.localId, { isRequired: e.target.checked })}
                          />
                        }
                        label="Required"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={attribute.inputType === "multi_select"}
                            onChange={e =>
                              updateAttribute(attribute.localId, {
                                inputType: e.target.checked ? "multi_select" : "single_select"
                              })
                            }
                            disabled={attribute.uuid != null}
                          />
                        }
                        label="Multiselect"
                      />
                    </Stack>
                    {attribute.uuid != null && (
                      <Typography variant="caption" color="text.secondary">
                        Input type cannot be changed after an attribute is created.
                      </Typography>
                    )}

                    <Box>
                      <Typography variant="subtitle2" className="mb-2">
                        Options
                      </Typography>
                      {attribute.options.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          No options yet. Add at least one option.
                        </Typography>
                      )}
                      <Stack spacing={2}>
                        {attribute.options.map((option, optionIndex) => (
                          <Stack key={option.localId} direction="row" alignItems="center" spacing={1}>
                            <TextField
                              size="small"
                              label={OPTION_INPUT_PLACEHOLDER}
                              placeholder={OPTION_INPUT_PLACEHOLDER}
                              value={option.label}
                              onChange={e => updateOption(attribute.localId, option.localId, e.target.value)}
                              fullWidth
                              error={option.label.trim() === ""}
                            />
                            <CircularButton
                              onClick={() => moveOption(attribute.localId, option.localId, -1)}
                              disabled={optionIndex === 0}
                              ariaLabel="Move option up"
                            >
                              <ArrowUpwardIcon fontSize="small" />
                            </CircularButton>
                            <CircularButton
                              onClick={() => moveOption(attribute.localId, option.localId, 1)}
                              disabled={optionIndex === attribute.options.length - 1}
                              ariaLabel="Move option down"
                            >
                              <ArrowDownwardIcon fontSize="small" />
                            </CircularButton>
                            <CircularButton
                              onClick={() => removeOption(attribute.localId, option.localId)}
                              color="warning"
                              ariaLabel="Remove option"
                            >
                              <RemoveIcon fontSize="small" />
                            </CircularButton>
                          </Stack>
                        ))}
                      </Stack>
                      <Button startIcon={<AddIcon />} onClick={() => addOption(attribute.localId)} className="mt-2">
                        Add Option
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Button variant="outlined" startIcon={<AddIcon />} onClick={addAttribute} className="mb-6">
          Add Attribute
        </Button>

        <Divider className="my-6" />

        <Box className="flex justify-start">
          <Button variant="contained" onClick={handleSave} disabled={isSaving || !definitionsLoaded}>
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
