import type { DateValue } from "@ark-ui/react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { cloneElement, FC, isValidElement, ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import type { BulkSitePolygonAttributeChanges } from "@/connections/SitePolygons";
import {
  dropdownOptionsRestoration,
  dropdownOptionsTarget,
  dropdownOptionsTree
} from "@/constants/polygonDropdownOptions";
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
import { PolygonTableRow } from "./PolygonTableRow";
import SelectedPolygonsSummary from "./SelectedPolygonsSummary";

interface PolygonBulkEditDrawerProps {
  selectedPolygons: PolygonTableRow[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isSaving?: boolean;
  onSave?: (attributeChanges: BulkSitePolygonAttributeChanges) => void | Promise<void>;
}

type BulkEditField = "plantStart" | "practice" | "targetSys" | "distr" | "numTrees";

const EMPTY_ENABLED_FIELDS: Record<BulkEditField, boolean> = {
  plantStart: false,
  practice: false,
  targetSys: false,
  distr: false,
  numTrees: false
};

type EditableInputProps = { disabled?: boolean };

const EditWrapper: FC<{
  enabled: boolean;
  onEnable: () => void;
  onCancel: () => void;
  children: ReactElement<EditableInputProps>;
}> = ({ enabled, onEnable, onCancel, children }) => {
  const t = useT();

  const input = isValidElement(children)
    ? cloneElement(children, {
        disabled: !enabled || children.props.disabled === true
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
        </Flex>
      ) : (
        <Box className="mt-auto flex h-[2.5rem] items-center justify-center">
          <IconButton icon={<EditIcon color="neutral.800" boxSize={4} />} onClick={onEnable} />
        </Box>
      )}
    </Flex>
  );
};

const optionToSelectItem = (option: { title: string; value: string }) => ({
  label: option.title,
  value: option.value
});

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
  const [enabledFields, setEnabledFields] = useState<Record<BulkEditField, boolean>>(EMPTY_ENABLED_FIELDS);
  const [plantStartDate, setPlantStartDate] = useState<DateValue[]>([]);
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const restorationOptions = useMemo(
    () => dropdownOptionsRestoration.map(option => ({ ...optionToSelectItem(option), label: t(option.title) })),
    [t]
  );
  const targetOptions = useMemo(
    () => dropdownOptionsTarget.map(option => ({ ...optionToSelectItem(option), label: t(option.title) })),
    [t]
  );
  const treeOptions = useMemo(
    () => dropdownOptionsTree.map(option => ({ ...optionToSelectItem(option), label: t(option.title) })),
    [t]
  );

  const fieldLabels = useMemo(
    () =>
      [
        enabledFields.plantStart ? t("Plant Start Date") : null,
        enabledFields.practice ? t("Restoration Practice") : null,
        enabledFields.targetSys ? t("Target Land Use") : null,
        enabledFields.distr ? t("Tree Distribution") : null,
        enabledFields.numTrees ? t("Trees Planted") : null
      ].filter((label): label is string => label != null),
    [enabledFields, t]
  );

  const resetForm = useCallback(() => {
    setEnabledFields(EMPTY_ENABLED_FIELDS);
    setPlantStartDate([]);
    setRestorationPractice([]);
    setTargetLandUseSystem([]);
    setTreeDistribution([]);
    setTreesPlanted("");
    setShowConfirmModal(false);
  }, []);

  useEffect(() => {
    if (open !== true) {
      resetForm();
    }
  }, [open, resetForm]);

  const enableField = useCallback((field: BulkEditField) => {
    setEnabledFields(current => ({ ...current, [field]: true }));
  }, []);

  const cancelField = useCallback((field: BulkEditField) => {
    setEnabledFields(current => ({ ...current, [field]: false }));
    if (field === "plantStart") setPlantStartDate([]);
    if (field === "practice") setRestorationPractice([]);
    if (field === "targetSys") setTargetLandUseSystem([]);
    if (field === "distr") setTreeDistribution([]);
    if (field === "numTrees") setTreesPlanted("");
  }, []);

  const attributeChanges = useMemo<BulkSitePolygonAttributeChanges>(() => {
    const changes: BulkSitePolygonAttributeChanges = {};
    if (enabledFields.plantStart) changes.plantStart = dateValueToIsoString(plantStartDate[0]) ?? "";
    if (enabledFields.practice) changes.practice = restorationPractice;
    if (enabledFields.targetSys) changes.targetSys = targetLandUseSystem[0] ?? "";
    if (enabledFields.distr) changes.distr = treeDistribution;
    if (enabledFields.numTrees) changes.numTrees = Number(treesPlanted || 0);
    return changes;
  }, [enabledFields, plantStartDate, restorationPractice, targetLandUseSystem, treeDistribution, treesPlanted]);

  const hasEnabledField = fieldLabels.length > 0;
  const hasValidTreesPlanted =
    !enabledFields.numTrees || (treesPlanted.trim() !== "" && Number.isInteger(Number(treesPlanted)));
  const canSave = hasEnabledField && hasValidTreesPlanted && !isSaving;

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

  return (
    <Drawer placement="start" defaultOpen={false} open={open} onOpenChange={handleOpenChange} size="md">
      {({ onClose }) => (
        <>
          <FilterPanel
            title={t("Edit Details")}
            variant="fixed"
            onClose={onClose}
            className="h-screen w-full"
            content={
              <Flex className="mr-1 min-h-0 flex-1 flex-col gap-4 overflow-auto py-5 pr-5 pl-4">
                <SelectedPolygonsSummary selectedPolygons={selectedPolygons} open={open} />
                <Text textStyle="300" color="neutral.700">
                  {t("Use the edit icon to select only the attributes you want to apply to all selected polygons.")}
                </Text>
                <EditWrapper
                  enabled={enabledFields.plantStart}
                  onEnable={() => enableField("plantStart")}
                  onCancel={() => cancelField("plantStart")}
                >
                  <DatePickerInput
                    label={t("Plant Start Date")}
                    className="w-[13.5rem]"
                    value={plantStartDate}
                    onValueChange={setPlantStartDate}
                  />
                </EditWrapper>
                <EditWrapper
                  enabled={enabledFields.practice}
                  onEnable={() => enableField("practice")}
                  onCancel={() => cancelField("practice")}
                >
                  <SelectInput
                    items={restorationOptions}
                    label={t("Restoration Practice")}
                    placeholder={t("Multiple")}
                    value={restorationPractice}
                    onChange={setRestorationPractice}
                    multiple
                  />
                </EditWrapper>
                <EditWrapper
                  enabled={enabledFields.targetSys}
                  onEnable={() => enableField("targetSys")}
                  onCancel={() => cancelField("targetSys")}
                >
                  <SelectInput
                    items={targetOptions}
                    label={t("Target Land Use")}
                    placeholder={t("Multiple")}
                    value={targetLandUseSystem}
                    onChange={value => setTargetLandUseSystem(value.slice(0, 1))}
                  />
                </EditWrapper>
                <EditWrapper
                  enabled={enabledFields.distr}
                  onEnable={() => enableField("distr")}
                  onCancel={() => cancelField("distr")}
                >
                  <SelectInput
                    items={treeOptions}
                    label={t("Tree Distribution")}
                    placeholder={t("Multiple")}
                    value={treeDistribution}
                    onChange={setTreeDistribution}
                    multiple
                  />
                </EditWrapper>
                <EditWrapper
                  enabled={enabledFields.numTrees}
                  onEnable={() => enableField("numTrees")}
                  onCancel={() => cancelField("numTrees")}
                >
                  <TextInput
                    width="12.75rem"
                    label={t("Trees Planted")}
                    value={treesPlanted}
                    onChange={event => setTreesPlanted(event.target.value.replace(/\D/g, ""))}
                    errorMessage={!hasValidTreesPlanted ? t("Enter a whole number") : undefined}
                  />
                </EditWrapper>
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
                    onClick: onClose
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
            canConfirm={hasEnabledField}
            isSaving={isSaving}
            onConfirm={handleConfirmSave}
          />
        </>
      )}
    </Drawer>
  );
};

export default PolygonBulkEditDrawer;
