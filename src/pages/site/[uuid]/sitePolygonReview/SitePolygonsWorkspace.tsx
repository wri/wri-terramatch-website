import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { resolvePolygonTableRowId } from "@/components/elements/Map-mapbox/sitePolygonPopupUtils";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { loadAllSitePolygons, useAllSitePolygons } from "@/connections/SitePolygons";
import { useAllSiteValidations } from "@/connections/Validation";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { openPolygonPopupFromMapArea } from "@/context/mapArea.utils";
import {
  EMPTY_POLYGONS,
  PolygonEditDrawerDataSync,
  PolygonEditDrawerProvider,
  usePolygonEditDrawer
} from "@/context/polygonEditDrawer.provider";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import {
  consumePendingPolygonFocusUuid,
  setPolygonTableHoveredUuid,
  useSyncPolygonTableSelectionStore
} from "@/context/polygonTableInteraction.store";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import Log from "@/utils/log";

import { type OverlapFixPolygon } from "../components/Modals/OverlapFix";
import { buildPolygonValidationsMap } from "../components/Modals/validationCriteria";
import PolygonBulkActionToolbar from "../components/PolygonBulkActionToolbar";
import { PolygonTableRow } from "../components/PolygonTableRow";
import { getPolygonsTableStyles } from "../components/polygonTableStyles";
import PolygonToolbar from "../components/PolygonToolbar";
import SitePolygonMapSection from "../components/SitePolygonMapSection";
import SitePolygonMetricsSection from "../components/SitePolygonMetricsSection";
import SitePolygonModals from "../components/SitePolygonModals";
import SitePolygonTableSection from "../components/SitePolygonTableSection";
import {
  canAutoFixOverlapSelection,
  getSelectedOverlapFixSummary,
  hasOverlapFailureInSelection,
  hasOverlapValidationFailure
} from "../hooks/overlapFix.utils";
import { useDownloadSitePolygons } from "../hooks/useDownloadSitePolygons";
import { usePolygonDrawUndo } from "../hooks/usePolygonDrawUndo";
import { useSelectedSitePolygons } from "../hooks/useSelectedSitePolygons";
import { useSitePolygonBulkActions } from "../hooks/useSitePolygonBulkActions";
import { useSitePolygonFilters } from "../hooks/useSitePolygonFilters";
import { useSitePolygonOverlap } from "../hooks/useSitePolygonOverlap";
import { useSitePolygonTableData } from "../hooks/useSitePolygonTableData";
import { useStartSitePolygonDrawing } from "../hooks/useStartSitePolygonDrawing";
import { getPolygonTableLoadingLabel } from "../utils/polygonTableLoadingLabel";

export type SitePolygonsWorkspaceVariant = "champions" | "adminReview";

export interface SitePolygonsWorkspaceProps {
  site: SiteFullDto;
  variant?: SitePolygonsWorkspaceVariant;
}

const SitePolygonsWorkspaceContent: FC<SitePolygonsWorkspaceProps> = ({ site, variant = "champions" }) => {
  const t = useT();
  const isAdminReview = variant === "adminReview";
  const { isOpen: isEditPolygonOpen, suppressMapSelectionHighlight } = usePolygonEditDrawer();
  const {
    isUserDrawingEnabled,
    editPolygon,
    setSiteData,
    resetSiteMapInteractionState,
    closeMapPopups,
    polygonSubmitConfirmation,
    editPhotoDetailsMedia,
    setEditPhotoDetailsMedia
  } = useMapAreaContext();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const pendingOverlapFixPolygonIdRef = useRef<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOverlapFixModal, setOverlapFixModal] = useState(false);
  const [overlapFixResults, setOverlapFixResults] = useState<{
    polygonsFixed: OverlapFixPolygon[];
    polygonsNotFixed: OverlapFixPolygon[];
  }>({ polygonsFixed: [], polygonsNotFixed: [] });
  const [showUploadErrorModal, setUploadErrorModal] = useState(false);
  const [showUploadPhotosModal, setShowUploadPhotosModal] = useState(false);
  const [uploadedPolygonUuidToOpen, setUploadedPolygonUuidToOpen] = useState<string | null>(null);
  const [focusPolygonUuid, setFocusPolygonUuid] = useState<string | null>(null);
  const [isStickyActive, setIsStickyActive] = useState(false);

  const {
    polygonSearch,
    polygonFilters,
    sitePolygonFilter,
    activeFilterLabels,
    setPolygonSearch,
    setPolygonFilters,
    handleClearPolygonFilters
  } = useSitePolygonFilters({ t });

  const {
    data: polygonsQueryData,
    isLoading: isLoadingPolygons,
    error: polygonLoadError,
    progress: polygonLoadProgress,
    total: polygonLoadTotal,
    refetch: refetchPolygons
  } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: site.uuid != null && site.uuid !== "",
    filter: sitePolygonFilter
  });

  const polygonsData = polygonsQueryData ?? EMPTY_POLYGONS;
  const { allValidations, fetchAllValidationPages } = useAllSiteValidations(site.uuid);
  const polygonValidations = useMemo(() => buildPolygonValidationsMap(allValidations), [allValidations]);

  const { polygonRows, columns, totalTreesPlanted, totalRestorationAreaHa } = useSitePolygonTableData({
    polygonsData,
    t
  });
  const { polygonsWithOverlapCount, overlapPolygons, overlapValidations, fetchOverlapValidations } =
    useSitePolygonOverlap({
      siteUuid: site.uuid,
      polygonsData
    });
  const overlapPolygonValidations = useMemo(() => buildPolygonValidationsMap(overlapValidations), [overlapValidations]);

  const { selectedRows, selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } =
    useTableSelection<PolygonTableRow>(true, polygonRows);
  const {
    selectedPolygonUuids,
    overlapPolygonsForMap,
    selectedTreesPlanted,
    selectedRestorationAreaRounded,
    selectedSitePolygons,
    selectedSitePolygonUuids,
    selectedGeometryPolygonUuids,
    selectedSubmittablePolygons,
    selectedSubmittablePolygonUuids
  } = useSelectedSitePolygons({
    polygonsData,
    selectedRowIds,
    selectedRows,
    overlapPolygons
  });

  const selectedOverlapFixSummary = useMemo(
    () => getSelectedOverlapFixSummary(selectedRows, overlapPolygonValidations, polygonsData),
    [selectedRows, overlapPolygonValidations, polygonsData]
  );
  const hasSelectedOverlapFailure = hasOverlapFailureInSelection(selectedOverlapFixSummary);
  const hasFixableSelectedOverlap = canAutoFixOverlapSelection(selectedOverlapFixSummary);

  const openPolygonEditDrawerByPolygonId = useCallback(
    (polygonId: string) => {
      const sitePolygon = polygonsData.find(polygon => polygon.polygonUuid === polygonId || polygon.uuid === polygonId);
      if (sitePolygon != null) {
        openPolygonEditDrawerForSitePolygon(sitePolygon, sitePolygon.name ?? undefined);
      }
    },
    [polygonsData]
  );

  const handleViewOverlapFixPolygon = useCallback(
    (polygonUuid: string) => {
      setOverlapFixModal(false);

      if (polygonFilters.hasOverlap) {
        pendingOverlapFixPolygonIdRef.current = polygonUuid;
        setPolygonFilters(current => ({ ...current, hasOverlap: false }));
        return;
      }

      openPolygonEditDrawerByPolygonId(polygonUuid);
    },
    [openPolygonEditDrawerByPolygonId, polygonFilters.hasOverlap, setPolygonFilters]
  );

  useEffect(() => {
    const pendingPolygonId = pendingOverlapFixPolygonIdRef.current;
    if (pendingPolygonId == null || polygonFilters.hasOverlap || isLoadingPolygons) {
      return;
    }

    pendingOverlapFixPolygonIdRef.current = null;
    openPolygonEditDrawerByPolygonId(pendingPolygonId);
  }, [openPolygonEditDrawerByPolygonId, polygonFilters.hasOverlap, isLoadingPolygons, polygonsData]);

  useEffect(() => {
    if (uploadedPolygonUuidToOpen == null || isLoadingPolygons) {
      return;
    }

    const uploadedPolygonExistsInTableData = polygonsData.some(
      polygon => polygon.uuid === uploadedPolygonUuidToOpen || polygon.polygonUuid === uploadedPolygonUuidToOpen
    );
    if (!uploadedPolygonExistsInTableData) {
      void loadAllSitePolygons({
        entityName: "sites",
        entityUuid: site.uuid,
        enabled: site.uuid != null && site.uuid !== ""
      })
        .then(allSitePolygons => {
          const uploadedPolygon = allSitePolygons.find(
            polygon => polygon.uuid === uploadedPolygonUuidToOpen || polygon.polygonUuid === uploadedPolygonUuidToOpen
          );
          if (uploadedPolygon == null) {
            return;
          }

          openPolygonEditDrawerForSitePolygon(uploadedPolygon, uploadedPolygon.name ?? undefined);
          setUploadedPolygonUuidToOpen(null);
        })
        .catch(error => {
          Log.error("Failed to auto-open uploaded polygon in edit drawer:", error);
        });
      return;
    }

    openPolygonEditDrawerByPolygonId(uploadedPolygonUuidToOpen);
    setUploadedPolygonUuidToOpen(null);
  }, [isLoadingPolygons, openPolygonEditDrawerByPolygonId, polygonsData, site.uuid, uploadedPolygonUuidToOpen]);

  useEffect(() => {
    if (isLoadingPolygons) {
      return;
    }

    const pendingFocusUuid = consumePendingPolygonFocusUuid();
    if (pendingFocusUuid == null || pendingFocusUuid === "") {
      return;
    }

    const rowId = resolvePolygonTableRowId(polygonsData, pendingFocusUuid);
    if (rowId == null) {
      return;
    }

    setPolygonTableHoveredUuid(rowId);
    setFocusPolygonUuid(pendingFocusUuid);
  }, [isLoadingPolygons, polygonsData]);

  const handleFocusPolygonConsumed = useCallback(() => {
    const focusedUuid = focusPolygonUuid;
    setFocusPolygonUuid(null);
    if (focusedUuid != null && focusedUuid !== "") {
      openPolygonPopupFromMapArea(focusedUuid);
    }
  }, [focusPolygonUuid]);

  const handleOverlapFixModalClose = useCallback(() => {
    setOverlapFixModal(false);
    window.setTimeout(() => {
      setOverlapFixResults({ polygonsFixed: [], polygonsNotFixed: [] });
    }, 0);
  }, []);

  const openOverlapFixResultsModal = useCallback(
    (results: { polygonsFixed: OverlapFixPolygon[]; polygonsNotFixed: OverlapFixPolygon[] }) => {
      if (results.polygonsFixed.length === 0 && results.polygonsNotFixed.length === 0) {
        return;
      }

      setOverlapFixResults(results);
      window.setTimeout(() => {
        setOverlapFixModal(true);
      }, 0);
    },
    []
  );

  useEffect(() => {
    setSiteData(site);
  }, [setSiteData, site]);

  useEffect(() => {
    return () => {
      resetSiteMapInteractionState();
    };
  }, [resetSiteMapInteractionState]);

  useEffect(() => {
    if (isLoadingPolygons) return;
    const visibleRowIds = new Set(polygonRows.map(row => row.id));
    setSelectedRowIds(prev => {
      const next = new Set(Array.from(prev).filter(id => visibleRowIds.has(String(id))));
      return next.size === prev.size ? prev : next;
    });
  }, [polygonRows, setSelectedRowIds, isLoadingPolygons]);

  const clearTableSelection = useCallback(() => {
    setSelectedRowIds(new Set<string>());
  }, [setSelectedRowIds]);

  const clearBulkTableSelection = useCallback(() => {
    clearTableSelection();
    closeMapPopups();
    setPolygonTableHoveredUuid(null);
  }, [clearTableSelection, closeMapPopups]);

  const handleSelectOverlapPolygons = useCallback(() => {
    const visiblePolygonIds = new Set(
      polygonsData
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((id): id is string => id != null && id !== "")
    );
    const overlapRowIds = overlapValidations
      .filter(hasOverlapValidationFailure)
      .map(validation => validation.polygonUuid)
      .filter((id): id is string => id != null && id !== "" && visiblePolygonIds.has(id));
    setSelectedRowIds(new Set(overlapRowIds));
  }, [overlapValidations, polygonsData, setSelectedRowIds]);

  const {
    bulkEditPayload,
    deletePayload,
    submitPayload,
    showBulkEditDrawer,
    showDeletePolygonModal,
    showPolygonSubmittedModal,
    showSubmitPolygonsModal,
    submittedPolygonNames,
    isBulkUpdatingPolygons,
    isDeletingPolygons,
    isDownloadingSelectedPolygons,
    isFixingOverlaps,
    isValidatingPolygons,
    deletingPolygonCount,
    fixingOverlapsCount,
    validatingPolygonCount,
    handleBulkDelete,
    handleBulkDownloadClick,
    handleBulkEditDetails,
    handleBulkEditDrawerOpenChange,
    handleBulkEditSave,
    handleConfirmBulkSubmit,
    handleConfirmMapPopupSubmit,
    handleDeletePolygonModalChange,
    handleDrawerOverlapFixed,
    handleMapPopupSubmitModalChange,
    handleOpenDeletePolygonModal,
    handleOpenSubmitPolygonsModal,
    handlePolygonDeletingChange,
    handlePolygonSubmittedModalChange,
    handleRunValidation,
    handleSubmitPolygonsModalChange,
    openPolygonEditDrawerForRow,
    runPolygonValidation
  } = useSitePolygonBulkActions({
    site,
    polygonsData,
    selectedRows,
    selectedSitePolygons,
    selectedSitePolygonUuids,
    selectedGeometryPolygonUuids,
    selectedSubmittablePolygons,
    selectedSubmittablePolygonUuids,
    selectedOverlapFixSummary,
    hasSelectedOverlapFailure,
    clearBulkTableSelection,
    refetchPolygons,
    fetchAllValidationPages,
    fetchOverlapValidations,
    onOverlapFixResultsOpen: openOverlapFixResultsModal
  });

  const isSitePolygonsLoading = isLoadingPolygons || isValidatingPolygons || isFixingOverlaps || isDeletingPolygons;
  const startDrawing = useStartSitePolygonDrawing({ onClearTableSelection: clearTableSelection });
  const { showPolygonUndoButton, handleUndoPolygonDraw } = usePolygonDrawUndo({
    isEditPolygonOpen,
    isUserDrawingEnabled,
    isExistingPolygonOpen: editPolygon.isOpen && editPolygon.uuid !== ""
  });

  const startNewPolygonFlow = useCallback(() => {
    openPolygonEditDrawerForSitePolygon();
    startDrawing();
  }, [startDrawing]);

  const { downloadAll, isDownloading: isDownloadingAllPolygons } = useDownloadSitePolygons({
    siteUuid: site.uuid,
    siteName: site.name
  });

  const polygonTableHighlight = useMemo(
    () => ({
      selectedPolygonUuids: suppressMapSelectionHighlight ? [] : selectedPolygonUuids,
      focusPolygonUuid,
      onFocusPolygonConsumed: handleFocusPolygonConsumed
    }),
    [selectedPolygonUuids, suppressMapSelectionHighlight, focusPolygonUuid, handleFocusPolygonConsumed]
  );

  const handleClearHover = useCallback(() => {
    setPolygonTableHoveredUuid(null);
  }, []);

  const hasPolygonSelection = selectedRows.length > 0;
  const shouldShowNoResults = !isSitePolygonsLoading && polygonRows.length === 0;

  useSyncPolygonTableSelectionStore(selectedRowIds);

  const polygonsTableStyles = useMemo(() => getPolygonsTableStyles(isStickyActive), [isStickyActive]);
  const bulkToolbarSubmitLabel = useMemo(() => {
    if (hasSelectedOverlapFailure) return t("Fix Overlap");
    return isAdminReview ? t("Approve") : t("Submit");
  }, [hasSelectedOverlapFailure, isAdminReview, t]);
  // The admin approve flow is pending design; keep the placeholder action disabled, while
  // overlap fixing keeps full champions parity.
  const isBulkSubmitDisabled =
    !hasSelectedOverlapFailure &&
    (isAdminReview || (hasPolygonSelection && selectedSubmittablePolygonUuids.length === 0));

  useEffect(() => {
    const container = tableContainerRef.current?.children[0]?.children[0];
    if (container == null) return;
    const handleScroll = () => {
      setIsStickyActive(container.scrollLeft > 0);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isSitePolygonsLoading, shouldShowNoResults]);

  const loadingLabel = getPolygonTableLoadingLabel({
    t,
    isFixingOverlaps,
    fixingOverlapsCount,
    isValidatingPolygons,
    validatingPolygonCount,
    isDeletingPolygons,
    deletingPolygonCount,
    polygonLoadProgress,
    polygonLoadTotal
  });

  return (
    <>
      <PolygonEditDrawerDataSync
        polygons={polygonsData}
        onRefetchPolygons={refetchPolygons}
        onOverlapFixed={handleDrawerOverlapFixed}
        onRunValidation={runPolygonValidation}
        onPolygonDeletingChange={handlePolygonDeletingChange}
      />
      <PageContent className="bg-theme-neutral-100">
        <PageItem
          title={t("Polygons")}
          flexProps={{ width: "100%" }}
          downloadButtonProps={
            isAdminReview
              ? {
                  variant: "secondary",
                  size: "small",
                  children: t("Upload Monitoring Plots"),
                  leftIcon: <UploadIcon />,
                  // Mocked admin-only action; behavior will be implemented by the design team.
                  disabled: true
                }
              : undefined
          }
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: t("Download All"),
            leftIcon: <DownloadIcon />,
            loading: isDownloadingAllPolygons,
            disabled: site.uuid == null || site.uuid === "",
            onClick: () => {
              void downloadAll();
            }
          }}
          multiActionButtonProps={{
            mainActionLabel: t("Add"),
            size: "small",
            leftIcon: <PlusIcon />,
            mainActionOnClick: startNewPolygonFlow,
            otherActions: [
              {
                label: t("Draw Polygon"),
                onClick: startNewPolygonFlow,
                value: "draw-polygon"
              },
              {
                label: t("Upload"),
                onClick: () => {
                  setShowUploadModal(true);
                },
                value: "upload"
              }
            ],
            variant: "primary"
          }}
        >
          <PolygonToolbar
            resultCount={polygonRows.length}
            polygonSearch={polygonSearch}
            polygonFilters={polygonFilters}
            activeFilterLabels={activeFilterLabels}
            onSearchChange={setPolygonSearch}
            onApplyFilters={setPolygonFilters}
            onClearFilters={handleClearPolygonFilters}
          />
        </PageItem>

        <PolygonBulkActionToolbar
          visible={hasPolygonSelection}
          itemCount={selectedRows.length}
          isBulkEditDrawerOpen={showBulkEditDrawer}
          submitLabel={bulkToolbarSubmitLabel}
          polygons={selectedRows}
          polygonValidations={polygonValidations}
          selectedGeometryPolygonUuids={selectedGeometryPolygonUuids}
          isDownloading={isDownloadingSelectedPolygons}
          isValidating={isValidatingPolygons}
          onCancel={clearBulkTableSelection}
          onClearSelection={clearBulkTableSelection}
          onDelete={handleOpenDeletePolygonModal}
          onDownload={handleBulkDownloadClick}
          onEdit={handleBulkEditDetails}
          onViewPolygonDetails={openPolygonEditDrawerForRow}
          onRunValidation={handleRunValidation}
          onSubmit={handleOpenSubmitPolygonsModal}
          isOverlapFixAction={hasSelectedOverlapFailure}
          canAutoFixOverlap={hasFixableSelectedOverlap}
          isSubmitDisabled={isBulkSubmitDisabled}
        />

        <SitePolygonModals
          siteUuid={site.uuid}
          bulkEditPayload={bulkEditPayload}
          deletePayload={deletePayload}
          submitPayload={submitPayload}
          overlapFixResults={overlapFixResults}
          editPhotoDetailsMedia={editPhotoDetailsMedia}
          openBulkEditDrawer={showBulkEditDrawer}
          openDeletePolygonModal={showDeletePolygonModal}
          openOverlapFixModal={showOverlapFixModal}
          openPolygonSubmittedModal={showPolygonSubmittedModal}
          openSubmitPolygonsModal={showSubmitPolygonsModal}
          openUploadErrorModal={showUploadErrorModal}
          openUploadModal={showUploadModal}
          openUploadPhotosModal={showUploadPhotosModal}
          openMapPopupSubmitModal={polygonSubmitConfirmation != null}
          mapPopupSubmitEligibleCount={polygonSubmitConfirmation?.eligibleCount ?? 0}
          mapPopupSubmitTotalCount={polygonSubmitConfirmation?.totalCount ?? 0}
          submittedPolygonNames={submittedPolygonNames}
          isBulkUpdatingPolygons={isBulkUpdatingPolygons}
          onBulkEditDrawerOpenChange={handleBulkEditDrawerOpenChange}
          onBulkEditSave={handleBulkEditSave}
          onDelete={handleBulkDelete}
          onDeletePolygonModalOpenChange={handleDeletePolygonModalChange}
          onEditPhotoDetailsClose={() => setEditPhotoDetailsMedia(null)}
          onMapPopupSubmitModalOpenChange={handleMapPopupSubmitModalChange}
          onMapPopupSubmit={handleConfirmMapPopupSubmit}
          onOverlapFixClose={handleOverlapFixModalClose}
          onPolygonSubmittedModalOpenChange={handlePolygonSubmittedModalChange}
          onSubmitPolygonsModalOpenChange={handleSubmitPolygonsModalChange}
          onSubmitPolygons={handleConfirmBulkSubmit}
          onUploadError={() => setUploadErrorModal(true)}
          onUploadErrorModalOpenChange={setUploadErrorModal}
          onUploadModalOpenChange={setShowUploadModal}
          onUploadPhotosModalOpenChange={setShowUploadPhotosModal}
          onUploadSuccess={({ createdSitePolygonUuid, uploadedFileCount }) => {
            if (createdSitePolygonUuid != null && uploadedFileCount === 1) {
              setUploadedPolygonUuidToOpen(createdSitePolygonUuid);
            }
            void refetchPolygons();
          }}
          onViewOverlapPolygon={handleViewOverlapFixPolygon}
        />

        <SitePolygonMapSection
          site={site}
          polygons={polygonsData}
          isEditPolygonOpen={isEditPolygonOpen}
          isSitePolygonsLoading={isSitePolygonsLoading}
          polygonTableHighlight={polygonTableHighlight}
          overlapPolygons={overlapPolygonsForMap}
          onRefetchPolygons={refetchPolygons}
          showUndoButton={showPolygonUndoButton}
          onUndoDraw={handleUndoPolygonDraw}
        />

        {polygonLoadError != null && (
          <InlineMessage
            className="mt-4"
            variant="error"
            label={t("Unable to load polygons")}
            caption={t("Please retry loading polygons.")}
            actionLabel={t("Retry")}
            onActionClick={() => {
              void refetchPolygons();
            }}
          />
        )}

        {shouldShowNoResults ? (
          <Box>
            <Text textStyle="400-bold">{t("No results found")}</Text>
            <Text textStyle="400">
              {t("We couldn’t find any site areas matching your search. Try a different keyword.")}
            </Text>
          </Box>
        ) : (
          <>
            <SitePolygonMetricsSection
              totalTreesPlanted={totalTreesPlanted}
              totalRestorationAreaHa={totalRestorationAreaHa}
              hasPolygonSelection={hasPolygonSelection}
              selectedTreesPlanted={selectedTreesPlanted}
              selectedRestorationAreaRounded={selectedRestorationAreaRounded}
              polygonsWithOverlapCount={polygonsWithOverlapCount}
              onSelectOverlapPolygons={handleSelectOverlapPolygons}
            />
            <SitePolygonTableSection
              tableContainerRef={tableContainerRef}
              tableStyles={polygonsTableStyles}
              isSitePolygonsLoading={isSitePolygonsLoading}
              polygonRows={polygonRows}
              columns={columns}
              selectedRows={selectedRows}
              loadingLabel={loadingLabel}
              onAllItemsSelected={onAllItemsSelected}
              onClearHover={handleClearHover}
              onRowSelected={handleRowSelected}
            />
          </>
        )}
      </PageContent>
    </>
  );
};

const SitePolygonsWorkspace: FC<SitePolygonsWorkspaceProps> = ({ site, variant = "champions" }) => (
  <AnrMapOverlayProvider>
    <PolygonEditDrawerProvider>
      <SitePolygonsWorkspaceContent site={site} variant={variant} />
    </PolygonEditDrawerProvider>
  </AnrMapOverlayProvider>
);

export default SitePolygonsWorkspace;
