import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getUnreadCommentCount, useAuditStatuses } from "@/connections/AuditStatus";
import { useMyUser } from "@/connections/User";
import { useMapAreaContext } from "@/context/mapArea.provider";
import type { PolygonEditDrawerPolygon } from "@/context/polygonEditDrawer.types";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import NotificationIndicator from "@/redesignComponents/navigation/NotificationIndicator/NotificationIndicator";
import TabBar from "@/redesignComponents/navigation/TabBar/TabBar";
import ApiSlice from "@/store/apiSlice";

import DeletePolygon from "./Modals/DeletePolygon";
import SavePolygon from "./Modals/SavePolygon";
import SubmitPolygonConfirmation from "./Modals/SubmitPolygonConfirmation";
import PolygonCommentContent from "./PolygonCommentContent";
import type {
  PolygonOverlapFixCallback,
  PolygonSaveCallback,
  PolygonValidationJobsStartedCallback
} from "./polygonEdit.types";
import PolygonEditContent from "./PolygonEditContent";
import type { SavePolygonFlowOptions } from "./polygonEditSave";
import PolygonSystemValidationContent from "./PolygonSystemValidationContent";
import type { PolygonTableRow } from "./PolygonTableRow";
import { mapSitePolygonToTableRow } from "./polygonTableRow.utils";

interface PolygonEditDrawerProps {
  open?: boolean;
  polygon?: PolygonEditDrawerPolygon | null;
  selectedPolygon?: SitePolygonLightDto;
  onOpenChange?: (open: boolean) => void;
  onSaved?: PolygonSaveCallback;
  onOverlapFixed?: PolygonOverlapFixCallback;
  onRunValidation?: (geometryPolygonUuids: string[]) => Promise<void>;
  onValidationJobsStarted?: PolygonValidationJobsStartedCallback;
  onPolygonUpdated?: (polygon: SitePolygonLightDto) => void;
  onSuppressMapSelectionHighlightChange?: (value: boolean) => void;
  onDeletingChange?: (isDeleting: boolean, count?: number) => void;
}

const PolygonEditDrawer: FC<PolygonEditDrawerProps> = ({
  open,
  polygon,
  selectedPolygon,
  onOpenChange,
  onSaved,
  onOverlapFixed,
  onRunValidation,
  onValidationJobsStarted,
  onPolygonUpdated,
  onSuppressMapSelectionHighlightChange,
  onDeletingChange
}) => {
  const t = useT();
  const [, { user }] = useMyUser();
  const { draftPolygonGeometry, siteData } = useMapAreaContext();
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [saveEditContent, setSaveEditContent] = useState<
    ((options?: SavePolygonFlowOptions) => Promise<SitePolygonLightDto | null>) | null
  >(null);
  const deletePolygonRef = useRef<(() => Promise<void>) | null>(null);
  const submitPolygonRef = useRef<((comment: string) => Promise<void>) | null>(null);
  const saveAndSubmitPolygonRef = useRef<((comment: string) => Promise<void>) | null>(null);
  const hasUnsavedChangesRef = useRef<(() => boolean) | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirmationModal, setShowSaveConfirmationModal] = useState(false);
  const [isSubmitWithUnsavedChangesModal, setIsSubmitWithUnsavedChangesModal] = useState(false);
  const [deletePayload, setDeletePayload] = useState<{ polygons: PolygonTableRow[] } | null>(null);
  const [submitPayload, setSubmitPayload] = useState<{ polygons: PolygonTableRow[] } | null>(null);
  const deleteConfirmedRef = useRef(false);
  const getPolygonNameForSaveRef = useRef<() => string>(() => polygon?.polygonName?.trim() ?? "");
  const [savePolygonName, setSavePolygonName] = useState("");
  const [hasPlantStartDate, setHasPlantStartDate] = useState(false);
  const isCreateMode = selectedPolygon?.primaryUuid == null || selectedPolygon.primaryUuid === "";
  const isPolygonNameMissing = savePolygonName.trim() === "";
  const isPlantStartDateMissing = !hasPlantStartDate;
  const isSaveDisabled =
    (activeTab === "edit" && isCreateMode && draftPolygonGeometry == null) ||
    isPolygonNameMissing ||
    isPlantStartDateMissing;
  const hasValidPolygonUuid = polygon?.polygonUuid != null;
  const resolvedSiteUuid = useMemo(
    () => selectedPolygon?.siteId ?? (siteData != null && "uuid" in siteData ? siteData.uuid : ""),
    [selectedPolygon?.siteId, siteData]
  );

  const [, { data: auditStatusesData }] = useAuditStatuses({
    entity: "sitePolygons",
    uuid: selectedPolygon?.uuid ?? "",
    enabled: hasValidPolygonUuid
  });

  const unreadCommentCount = useMemo(() => getUnreadCommentCount(auditStatusesData, user), [auditStatusesData, user]);

  useEffect(() => {
    setActiveTab("edit");
  }, [polygon?.polygonUuid]);

  const selectedPolygonIdentityKey = `${selectedPolygon?.uuid ?? ""}:${selectedPolygon?.polygonUuid ?? ""}`;

  useEffect(() => {
    setSaveEditContent(null);
    setIsSubmitWithUnsavedChangesModal(false);
    setShowSaveConfirmationModal(false);
    const initialName = polygon?.polygonName?.trim() ?? "";
    getPolygonNameForSaveRef.current = () => polygon?.polygonName?.trim() ?? "";
    setSavePolygonName(initialName);
    setHasPlantStartDate(selectedPolygon?.plantStart != null && selectedPolygon.plantStart !== "");
  }, [selectedPolygonIdentityKey, polygon?.polygonName, selectedPolygon?.plantStart]);

  const registerSave = useCallback(
    (saveHandler: (options?: SavePolygonFlowOptions) => Promise<SitePolygonLightDto | null>) => {
      setSaveEditContent(() => saveHandler);
    },
    []
  );

  const registerDelete = useCallback((deleteHandler: () => Promise<void>) => {
    deletePolygonRef.current = deleteHandler;
  }, []);

  const registerSubmit = useCallback((submitHandler: (comment: string) => Promise<void>) => {
    submitPolygonRef.current = submitHandler;
  }, []);

  const registerSaveAndSubmit = useCallback((saveAndSubmitHandler: (comment: string) => Promise<void>) => {
    saveAndSubmitPolygonRef.current = saveAndSubmitHandler;
  }, []);

  const registerHasUnsavedChanges = useCallback((hasUnsavedChanges: () => boolean) => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, []);

  const registerPolygonName = useCallback((getPolygonName: () => string) => {
    getPolygonNameForSaveRef.current = getPolygonName;
    setSavePolygonName(getPolygonName());
  }, []);

  const registerPlantStartDate = useCallback((getHasPlantStartDate: () => boolean) => {
    setHasPlantStartDate(getHasPlantStartDate());
  }, []);

  const saveConfirmationPolygonName = getPolygonNameForSaveRef.current().trim();
  const showSaveAndSubmitOption = isSubmitWithUnsavedChangesModal && !isCreateMode;

  const closeDrawer = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleSave = useCallback(
    async (onClose: () => void) => {
      if (activeTab !== "edit" || saveEditContent == null) {
        onClose();
        return;
      }

      setIsSaving(true);
      try {
        const saved = await saveEditContent();
        if (saved != null) {
          onClose();
        }
      } finally {
        setIsSaving(false);
      }
    },
    [activeTab, saveEditContent]
  );

  const handleSaveAndSubmit = useCallback(async () => {
    await saveAndSubmitPolygonRef.current?.("");
  }, []);

  const handleSaveConfirmationModalChange = useCallback(
    (nextOpen: boolean) => {
      setShowSaveConfirmationModal(nextOpen);
      if (!nextOpen) {
        setIsSubmitWithUnsavedChangesModal(false);
        if (isCreateMode) {
          closeDrawer();
        }
      }
    },
    [closeDrawer, isCreateMode]
  );

  const handleRequestDeleteModal = useCallback(() => {
    if (selectedPolygon == null) {
      return;
    }

    deleteConfirmedRef.current = false;
    setDeletePayload({ polygons: [mapSitePolygonToTableRow(selectedPolygon, t)] });
  }, [selectedPolygon, t]);

  const handleRequestSubmitModal = useCallback(
    (hasUnsavedChanges: boolean) => {
      if (selectedPolygon == null) {
        return;
      }

      if (hasUnsavedChanges) {
        setIsSubmitWithUnsavedChangesModal(hasUnsavedChanges && !isCreateMode);
        setShowSaveConfirmationModal(true);
        return;
      }

      setSubmitPayload({ polygons: [mapSitePolygonToTableRow(selectedPolygon, t)] });
    },
    [isCreateMode, selectedPolygon, t]
  );

  const handleDeleteConfirmationModalChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        return;
      }

      const shouldCloseDrawer = deleteConfirmedRef.current;
      deleteConfirmedRef.current = false;
      setDeletePayload(null);
      if (shouldCloseDrawer) {
        closeDrawer();
      }
    },
    [closeDrawer]
  );

  return (
    <>
      <Drawer
        modal={false}
        open={open ?? false}
        closeOnInteractOutside={false}
        onOpenChange={onOpenChange}
        size="md"
        placement="start"
      >
        {({ onClose }) => (
          <FilterPanel
            title={polygon?.polygonUuid ? polygon?.polygonName ?? t("-") : t("New Polygon")}
            variant="fixed"
            onClose={onClose}
            className="h-screen w-full"
            content={
              <Flex className="h-full flex-col">
                {polygon?.polygonUuid && (
                  <TabBar
                    onTabClick={(tabValue: string) => {
                      setActiveTab(tabValue);
                      if (tabValue === "comments") {
                        ApiSlice.pruneCache("auditStatuses");
                      }
                    }}
                    tabs={[
                      {
                        label: t("Edit"),
                        value: "edit"
                      },
                      {
                        label: t("System Validation"),
                        value: "systemValidation"
                      },
                      {
                        label: (
                          <Text className="flex items-center gap-2">
                            {t("Comments")}
                            {unreadCommentCount > 0 && (
                              <NotificationIndicator bgColor={activeTab != "comments" ? "neutral.700" : undefined}>
                                {unreadCommentCount}
                              </NotificationIndicator>
                            )}
                          </Text>
                        ),
                        value: "comments"
                      }
                    ]}
                    defaultValue={activeTab}
                    variant="panel"
                  />
                )}
                {activeTab === "edit" && (
                  <PolygonEditContent
                    polygon={selectedPolygon}
                    onClose={onClose}
                    onRegisterSave={registerSave}
                    onRegisterDelete={registerDelete}
                    onRegisterSubmit={registerSubmit}
                    onRegisterSaveAndSubmit={registerSaveAndSubmit}
                    onRegisterHasUnsavedChanges={registerHasUnsavedChanges}
                    onRegisterPolygonName={registerPolygonName}
                    onRegisterPlantStartDate={registerPlantStartDate}
                    onRequestDeleteModal={handleRequestDeleteModal}
                    onRequestSubmitModal={handleRequestSubmitModal}
                    onSaved={onSaved}
                    onValidationJobsStarted={onValidationJobsStarted}
                    onPolygonUpdated={onPolygonUpdated}
                    onSuppressMapSelectionHighlightChange={onSuppressMapSelectionHighlightChange}
                    onDeletingChange={onDeletingChange}
                  />
                )}
                {activeTab === "systemValidation" && (
                  <PolygonSystemValidationContent
                    siteUuid={resolvedSiteUuid}
                    polygon={selectedPolygon}
                    onOverlapFixed={onOverlapFixed}
                    onRunValidation={onRunValidation}
                  />
                )}
                {activeTab === "comments" && (
                  <PolygonCommentContent polygonUuid={selectedPolygon?.uuid} polygonStatus={selectedPolygon?.status} />
                )}
              </Flex>
            }
            footer={
              activeTab !== "comments" && (
                <ButtonGroup
                  buttons={[
                    {
                      id: "polygon-edit-cancel",
                      children: t("Cancel"),
                      variant: "secondary",
                      disabled: isSaving,
                      onClick: onClose
                    },
                    {
                      id: "polygon-edit-save",
                      children: t("Save"),
                      variant: "primary",
                      loading: isSaving,
                      disabled: isSaveDisabled || isSaving,
                      onClick: () => {
                        if (activeTab !== "edit" || saveEditContent == null) {
                          void handleSave(onClose);
                          return;
                        }
                        const hasUnsavedChanges = hasUnsavedChangesRef.current?.() ?? false;
                        setIsSubmitWithUnsavedChangesModal(hasUnsavedChanges && !isCreateMode);
                        setShowSaveConfirmationModal(true);
                      }
                    }
                  ]}
                />
              )
            }
          />
        )}
      </Drawer>

      <SavePolygon
        open={showSaveConfirmationModal}
        onOpenChange={handleSaveConfirmationModalChange}
        polygon={{ polygonName: saveConfirmationPolygonName } as unknown as PolygonTableRow}
        showSaveAndSubmit={showSaveAndSubmitOption}
        onSave={() => void handleSave(closeDrawer)}
        onSaveAndSubmit={showSaveAndSubmitOption ? () => void handleSaveAndSubmit() : undefined}
      />

      <DeletePolygon
        open={deletePayload != null}
        onOpenChange={handleDeleteConfirmationModalChange}
        polygons={deletePayload?.polygons ?? []}
        onDelete={() => {
          deleteConfirmedRef.current = true;
          return deletePolygonRef.current?.();
        }}
      />

      <SubmitPolygonConfirmation
        open={submitPayload != null}
        onOpenChange={open => {
          if (!open) {
            setSubmitPayload(null);
          }
        }}
        polygons={submitPayload?.polygons ?? []}
        onSubmit={comment => submitPolygonRef.current?.(comment)}
      />
    </>
  );
};

export default PolygonEditDrawer;
