import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getUnreadCommentCount, useAuditStatuses } from "@/connections/AuditStatus";
import { useMyUser } from "@/connections/User";
import { POLYGON_APPROVED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import type { PolygonEditDrawerPolygon } from "@/context/polygonEditDrawer.types";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import NotificationIndicator from "@/redesignComponents/navigation/NotificationIndicator/NotificationIndicator";
import TabBar from "@/redesignComponents/navigation/TabBar/TabBar";

import DeletePolygon from "./Modals/DeletePolygon";
import SavePolygon from "./Modals/SavePolygon";
import SubmitPolygons from "./Modals/SubmitPolygons";
import PolygonCommentContent from "./PolygonCommentContent";
import type { PolygonOverlapFixCallback, PolygonSaveCallback } from "./polygonEdit.types";
import PolygonEditContent from "./PolygonEditContent";
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
  onPolygonUpdated,
  onSuppressMapSelectionHighlightChange,
  onDeletingChange
}) => {
  const t = useT();
  const [, { user }] = useMyUser();
  const { draftPolygonGeometry } = useMapAreaContext();
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [saveEditContent, setSaveEditContent] = useState<(() => Promise<boolean>) | null>(null);
  const deletePolygonRef = useRef<(() => Promise<void>) | null>(null);
  const submitPolygonRef = useRef<(() => Promise<void>) | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirmationModal, setShowSaveConfirmationModal] = useState(false);
  const [deletePayload, setDeletePayload] = useState<{ polygons: PolygonTableRow[] } | null>(null);
  const [submitPayload, setSubmitPayload] = useState<{ eligibleCount: number; totalCount: number } | null>(null);
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

  const [, { data: auditStatusesData }] = useAuditStatuses({
    entity: "sitePolygons",
    uuid: selectedPolygon?.uuid ?? "",
    enabled: hasValidPolygonUuid
  });

  const unreadCommentCount = useMemo(() => getUnreadCommentCount(auditStatusesData, user), [auditStatusesData, user]);

  useEffect(() => {
    setActiveTab("edit");
  }, [polygon?.polygonUuid]);

  useEffect(() => {
    setSaveEditContent(null);
    const initialName = polygon?.polygonName?.trim() ?? "";
    getPolygonNameForSaveRef.current = () => polygon?.polygonName?.trim() ?? "";
    setSavePolygonName(initialName);
    setHasPlantStartDate(selectedPolygon?.plantStart != null && selectedPolygon.plantStart !== "");
  }, [polygon?.polygonName, selectedPolygon?.plantStart, selectedPolygon?.uuid]);

  const registerSave = useCallback((saveHandler: () => Promise<boolean>) => {
    setSaveEditContent(() => saveHandler);
  }, []);

  const registerDelete = useCallback((deleteHandler: () => Promise<void>) => {
    deletePolygonRef.current = deleteHandler;
  }, []);

  const registerSubmit = useCallback((submitHandler: () => Promise<void>) => {
    submitPolygonRef.current = submitHandler;
  }, []);

  const registerPolygonName = useCallback((getPolygonName: () => string) => {
    getPolygonNameForSaveRef.current = getPolygonName;
    setSavePolygonName(getPolygonName());
  }, []);

  const registerPlantStartDate = useCallback((getHasPlantStartDate: () => boolean) => {
    setHasPlantStartDate(getHasPlantStartDate());
  }, []);

  const saveConfirmationPolygonName = getPolygonNameForSaveRef.current().trim();
  const isAnyConfirmationModalOpen = showSaveConfirmationModal || deletePayload != null || submitPayload != null;
  const isDrawerVisible = (open ?? false) && !isAnyConfirmationModalOpen;

  const handleSave = useCallback(
    async (onClose: () => void) => {
      if (activeTab !== "edit" || saveEditContent == null) {
        onClose();
        return;
      }

      setIsSaving(true);
      try {
        const saved = await saveEditContent();
        if (saved) {
          onClose();
        }
      } finally {
        setIsSaving(false);
      }
    },
    [activeTab, saveEditContent]
  );

  const closeDrawer = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleSaveConfirmationModalChange = useCallback(
    (nextOpen: boolean) => {
      setShowSaveConfirmationModal(nextOpen);
      if (!nextOpen && isCreateMode) {
        closeDrawer();
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

  const handleRequestSubmitModal = useCallback(() => {
    if (selectedPolygon == null) {
      return;
    }

    const isPolygonSubmittable =
      selectedPolygon.status !== POLYGON_PENDING_APPROVAL && selectedPolygon.status !== POLYGON_APPROVED;

    setSubmitPayload({ eligibleCount: isPolygonSubmittable ? 1 : 0, totalCount: 1 });
  }, [selectedPolygon]);

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
        open={isDrawerVisible}
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
                    onTabClick={(tabValue: string) => setActiveTab(tabValue)}
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
                    onRegisterPolygonName={registerPolygonName}
                    onRegisterPlantStartDate={registerPlantStartDate}
                    onRequestDeleteModal={handleRequestDeleteModal}
                    onRequestSubmitModal={handleRequestSubmitModal}
                    onSaved={onSaved}
                    onPolygonUpdated={onPolygonUpdated}
                    onSuppressMapSelectionHighlightChange={onSuppressMapSelectionHighlightChange}
                    onDeletingChange={onDeletingChange}
                  />
                )}
                {activeTab === "systemValidation" && (
                  <PolygonSystemValidationContent
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
        onSave={() => void handleSave(closeDrawer)}
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

      <SubmitPolygons
        open={submitPayload != null}
        onOpenChange={open => {
          if (!open) {
            setSubmitPayload(null);
          }
        }}
        eligibleCount={submitPayload?.eligibleCount ?? 0}
        totalCount={submitPayload?.totalCount ?? 0}
        onSubmit={() => submitPolygonRef.current?.()}
      />
    </>
  );
};

export default PolygonEditDrawer;
