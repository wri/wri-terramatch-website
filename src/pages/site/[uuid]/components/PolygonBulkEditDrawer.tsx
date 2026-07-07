import type { DateValue } from "@ark-ui/react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { cloneElement, FC, isValidElement, ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import type { BulkSitePolygonAttributeChanges } from "@/connections/SitePolygons";
import { useRestorationPracticeOptions } from "@/hooks/translation/useRestorationPracticeOptions";
import { useTargetLandUseOptions } from "@/hooks/translation/useTargetLandUseOptions";
import { useTreeDistributionOptions } from "@/hooks/translation/useTreeDistributionOptions";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import DatePickerInput from "@/redesignComponents/Forms/Inputs/DateInputs/DatePickerInput/DatePickerInput";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { EditIcon } from "@/redesignComponents/foundations/Icons/Function/EditIcon";

import BulkEditPolygonAttributes from "./Modals/BulkEditPolygonAttributes";
import { SUBMISSION_CYCLE_LABELS, SUBMISSION_CYCLE_OPTIONS } from "./polygonFilter.constants";
import { PolygonTableRow } from "./PolygonTableRow";
import SelectedPolygonsSummary from "./SelectedPolygonsSummary";

interface PolygonBulkEditDrawerProps {
  selectedPolygons: PolygonTableRow[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isSaving?: boolean;
  onSave?: (attributeChanges: BulkSitePolygonAttributeChanges) => void | Promise<void>;
}

type BulkEditField = "plantStart" | "practice" | "targetSys" | "distr" | "numTrees" | "submissionCycle";

type FieldValueSnapshot =
  | { field: "plantStart"; value: DateValue[] }
  | { field: "practice"; value: string[] }
  | { field: "targetSys"; value: string[] }
  | { field: "distr"; value: string[] }
  | { field: "numTrees"; value: string }
  | { field: "submissionCycle"; value: string[] };

type EditableInputProps = { disabled?: boolean };

const EditWrapper: FC<{
  enabled: boolean;
  editable?: boolean;
  onEnable: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: ReactElement<EditableInputProps>;
}> = ({ enabled, editable = true, onEnable, onCancel, onSave, children }) => {
  const t = useT();

  const input = isValidElement(children)
    ? cloneElement(children, {
        disabled: !editable || !enabled || children.props.disabled === true
      })
    : children;

  return (
    <Flex className="items-center gap-4">
      {input}
      {enabled ? (
        <Flex className="mt-auto h-[2.5rem] items-center gap-2">
          <Button variant="borderless" size="small" onClick={onCancel}>
            {t("Cancel")}
          </Button>
          <Button variant="secondary" size="small" onClick={onSave}>
            {t("Save")}
          </Button>
        </Flex>
      ) : editable ? (
        <Box className="mt-auto flex h-[2.5rem] items-center justify-center">
          <IconButton icon={<EditIcon color="neutral.800" boxSize={4} />} onClick={onEnable} />
        </Box>
      ) : (
        <Box className="mt-auto h-[2.5rem] w-[2.5rem] shrink-0" />
      )}
    </Flex>
  );
};

const dateValueToIsoString = (value: DateValue | undefined): string | undefined => {
  if (value == null) return undefined;
  const mm = String(value.month).padStart(2, "0");
  const dd = String(value.day).padStart(2, "0");
  return `${value.year}-${mm}-${dd}T00:00:00.000Z`;
};

const PolygonBulkEditDrawer: FC<PolygonBulkEditDrawerProps> = ({
  selectedPolygons,
  open,
  onOpenChange,
  isSaving = false,
  onSave
}) => {
  const t = useT();
  const isAdmin = useIsAdmin();
  const [editingField, setEditingField] = useState<BulkEditField | null>(null);
  const [committedFields, setCommittedFields] = useState<Set<BulkEditField>>(() => new Set());
  const [fieldSnapshots, setFieldSnapshots] = useState<Partial<Record<BulkEditField, FieldValueSnapshot>>>({});
  const [plantStartDate, setPlantStartDate] = useState<DateValue[]>([]);
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState("");
  const [submissionCycle, setSubmissionCycle] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const restorationOptions = useRestorationPracticeOptions();
  const targetOptions = useTargetLandUseOptions();
  const treeOptions = useTreeDistributionOptions();

  const captureFieldSnapshot = useCallback(
    (field: BulkEditField): FieldValueSnapshot => {
      if (field === "plantStart") return { field, value: [...plantStartDate] };
      if (field === "practice") return { field, value: [...restorationPractice] };
      if (field === "targetSys") return { field, value: [...targetLandUseSystem] };
      if (field === "distr") return { field, value: [...treeDistribution] };
      if (field === "numTrees") return { field, value: treesPlanted };
      if (field === "submissionCycle") return { field, value: [...submissionCycle] };
      return { field, value: [] };
    },
    [plantStartDate, restorationPractice, targetLandUseSystem, treeDistribution, treesPlanted, submissionCycle]
  );

  const applyFieldSnapshot = useCallback((snapshot: FieldValueSnapshot) => {
    if (snapshot.field === "plantStart") setPlantStartDate(snapshot.value);
    if (snapshot.field === "practice") setRestorationPractice(snapshot.value);
    if (snapshot.field === "targetSys") setTargetLandUseSystem(snapshot.value);
    if (snapshot.field === "distr") setTreeDistribution(snapshot.value);
    if (snapshot.field === "numTrees") setTreesPlanted(snapshot.value);
    if (snapshot.field === "submissionCycle") setSubmissionCycle(snapshot.value);
  }, []);

  const clearFieldValues = useCallback((field: BulkEditField) => {
    if (field === "plantStart") setPlantStartDate([]);
    if (field === "practice") setRestorationPractice([]);
    if (field === "targetSys") setTargetLandUseSystem([]);
    if (field === "distr") setTreeDistribution([]);
    if (field === "numTrees") setTreesPlanted("");
    if (field === "submissionCycle") setSubmissionCycle([]);
  }, []);

  const resetForm = useCallback(() => {
    setEditingField(null);
    setCommittedFields(new Set());
    setFieldSnapshots({});
    setPlantStartDate([]);
    setRestorationPractice([]);
    setTargetLandUseSystem([]);
    setTreeDistribution([]);
    setTreesPlanted("");
    setSubmissionCycle([]);
    setShowConfirmModal(false);
  }, []);

  useEffect(() => {
    if (open !== true) {
      resetForm();
    }
  }, [open, resetForm]);

  const commitFieldLocally = useCallback(
    (field: BulkEditField) => {
      const snapshot = captureFieldSnapshot(field);
      setFieldSnapshots(current => ({ ...current, [field]: snapshot }));
      setCommittedFields(current => {
        const next = new Set(current);
        next.add(field);
        return next;
      });
    },
    [captureFieldSnapshot]
  );

  const fieldsIncludedInSave = useMemo(() => {
    const fields = new Set(committedFields);
    if (editingField != null) {
      fields.add(editingField);
    }
    return fields;
  }, [committedFields, editingField]);

  const buildChangesForField = useCallback(
    (field: BulkEditField, changes: BulkSitePolygonAttributeChanges) => {
      if (field === "plantStart") changes.plantStart = dateValueToIsoString(plantStartDate[0]) ?? "";
      if (field === "practice") changes.practice = restorationPractice;
      if (field === "targetSys") changes.targetSys = targetLandUseSystem[0] ?? "";
      if (field === "distr") changes.distr = treeDistribution;
      if (field === "numTrees") changes.numTrees = Number(treesPlanted || 0);
      if (field === "submissionCycle") changes.submissionCycle = submissionCycle;
    },
    [plantStartDate, restorationPractice, submissionCycle, targetLandUseSystem, treeDistribution, treesPlanted]
  );

  const attributeChanges = useMemo<BulkSitePolygonAttributeChanges>(() => {
    const changes: BulkSitePolygonAttributeChanges = {};
    fieldsIncludedInSave.forEach(field => buildChangesForField(field, changes));
    return changes;
  }, [buildChangesForField, fieldsIncludedInSave]);

  const hasValidTreesPlanted =
    !fieldsIncludedInSave.has("numTrees") || (treesPlanted.trim() !== "" && Number.isInteger(Number(treesPlanted)));

  const canSave = fieldsIncludedInSave.size > 0 && hasValidTreesPlanted && !isSaving;

  const enableField = useCallback(
    (field: BulkEditField) => {
      if (field === "submissionCycle" && !isAdmin) return;

      if (editingField === field) return;

      if (editingField != null) {
        commitFieldLocally(editingField);
      }

      setEditingField(field);
    },
    [commitFieldLocally, editingField, isAdmin]
  );

  const saveField = useCallback(
    (field: BulkEditField) => {
      commitFieldLocally(field);
      setEditingField(current => (current === field ? null : current));
    },
    [commitFieldLocally]
  );

  const cancelField = useCallback(
    (field: BulkEditField) => {
      const snapshot = fieldSnapshots[field];
      if (committedFields.has(field) && snapshot != null) {
        applyFieldSnapshot(snapshot);
      } else {
        clearFieldValues(field);
      }
      setEditingField(current => (current === field ? null : current));
    },
    [applyFieldSnapshot, clearFieldValues, committedFields, fieldSnapshots]
  );

  const handleConfirmSave = useCallback(async () => {
    if (onSave == null || !canSave) return;
    await onSave(attributeChanges);
    setShowConfirmModal(false);
  }, [attributeChanges, canSave, onSave]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetForm();
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, resetForm]
  );

  const handleFooterCancel = useCallback(
    (onClose: () => void) => {
      resetForm();
      onClose();
    },
    [resetForm]
  );

  const submissionCycleOptions = useMemo(
    () => SUBMISSION_CYCLE_OPTIONS.map(value => ({ value, label: SUBMISSION_CYCLE_LABELS[value] })),
    []
  );

  return (
    <Drawer
      modal={false}
      closeOnInteractOutside={false}
      placement="start"
      defaultOpen={false}
      open={open}
      onOpenChange={handleOpenChange}
      size="md"
      paddingTop={isAdmin ? 12 : 0}
      paddingLeft={isAdmin ? 12 : 0}
      maxH={isAdmin ? "calc(100vh - 3rem)" : "100vh"}
    >
      {({ onClose }) => (
        <>
          <FilterPanel
            title={t("Edit Details")}
            variant="fixed"
            onClose={() => handleFooterCancel(onClose)}
            className="h-full w-full"
            content={
              <Flex className="mr-1 min-h-0 flex-1 flex-col gap-4 overflow-auto py-5 pr-5 pl-4">
                <SelectedPolygonsSummary selectedPolygons={selectedPolygons} open={open} />
                <Text textStyle="300" color="neutral.700">
                  {t("Use the edit icon to select only the attributes you want to apply to all selected polygons.")}
                </Text>
                <EditWrapper
                  enabled={editingField === "plantStart"}
                  onEnable={() => enableField("plantStart")}
                  onCancel={() => cancelField("plantStart")}
                  onSave={() => saveField("plantStart")}
                >
                  <DatePickerInput
                    label={t("Plant Start Date")}
                    showOptionalLabel={false}
                    className="!w-[13.5rem]"
                    value={plantStartDate}
                    onValueChange={setPlantStartDate}
                    disabled={editingField !== "plantStart"}
                  />
                </EditWrapper>
                <EditWrapper
                  enabled={editingField === "practice"}
                  onEnable={() => enableField("practice")}
                  onCancel={() => cancelField("practice")}
                  onSave={() => saveField("practice")}
                >
                  <SelectInput
                    items={restorationOptions}
                    label={t("Restoration Practice")}
                    placeholder={t("Multiple")}
                    value={restorationPractice}
                    onChange={setRestorationPractice}
                    multiple
                    disabled={editingField !== "practice"}
                  />
                </EditWrapper>
                <EditWrapper
                  enabled={editingField === "targetSys"}
                  onEnable={() => enableField("targetSys")}
                  onCancel={() => cancelField("targetSys")}
                  onSave={() => saveField("targetSys")}
                >
                  <SelectInput
                    items={targetOptions}
                    label={t("Target Land Use")}
                    placeholder={t("Multiple")}
                    value={targetLandUseSystem}
                    onChange={value => setTargetLandUseSystem(value.slice(0, 1))}
                    disabled={editingField !== "targetSys"}
                  />
                </EditWrapper>
                <EditWrapper
                  enabled={editingField === "distr"}
                  onEnable={() => enableField("distr")}
                  onCancel={() => cancelField("distr")}
                  onSave={() => saveField("distr")}
                >
                  <SelectInput
                    items={treeOptions}
                    label={t("Tree Distribution")}
                    placeholder={t("Multiple")}
                    value={treeDistribution}
                    onChange={setTreeDistribution}
                    multiple
                    disabled={editingField !== "distr"}
                  />
                </EditWrapper>
                <EditWrapper
                  enabled={editingField === "numTrees"}
                  onEnable={() => enableField("numTrees")}
                  onCancel={() => cancelField("numTrees")}
                  onSave={() => saveField("numTrees")}
                >
                  <TextInput
                    width="12.75rem"
                    label={t("Trees Planted")}
                    value={treesPlanted}
                    onChange={event => setTreesPlanted(event.target.value.replace(/\D/g, ""))}
                    disabled={editingField !== "numTrees"}
                  />
                </EditWrapper>
                {(isAdmin || submissionCycle.length > 0) && (
                  <EditWrapper
                    editable={isAdmin}
                    enabled={editingField === "submissionCycle"}
                    onEnable={() => enableField("submissionCycle")}
                    onCancel={() => cancelField("submissionCycle")}
                    onSave={() => saveField("submissionCycle")}
                  >
                    <SelectInput
                      items={submissionCycleOptions}
                      label={t("Submission Cycle")}
                      placeholder={t("Select...")}
                      value={submissionCycle}
                      onChange={setSubmissionCycle}
                      disabled={!isAdmin || editingField !== "submissionCycle"}
                      multiple
                    />
                  </EditWrapper>
                )}
              </Flex>
            }
            footer={
              <ButtonGroup
                buttons={[
                  {
                    id: "cancel",
                    children: t("Cancel"),
                    variant: "secondary",
                    disabled: isSaving,
                    onClick: () => handleFooterCancel(onClose)
                  },
                  {
                    id: "save",
                    children: t("Save"),
                    variant: "primary",
                    disabled: !canSave,
                    loading: isSaving,
                    onClick: () => setShowConfirmModal(true)
                  }
                ]}
              />
            }
          />
          <BulkEditPolygonAttributes
            open={showConfirmModal}
            onOpenChange={setShowConfirmModal}
            polygonNames={selectedPolygons.map(polygon => polygon.polygonName)}
            canConfirm={fieldsIncludedInSave.size > 0}
            isSaving={isSaving}
            onConfirm={handleConfirmSave}
          />
        </>
      )}
    </Drawer>
  );
};

export default PolygonBulkEditDrawer;
