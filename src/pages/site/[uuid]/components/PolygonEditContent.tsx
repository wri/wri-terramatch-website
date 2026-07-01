import type { DateValue } from "@ark-ui/react";
import { Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { CalendarDate } from "@internationalized/date";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { format } from "date-fns";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

import {
  downloadGeoJsonFile,
  downloadPolygonGeoJson,
  extractGeoJsonFromResponse,
  formatFileName
} from "@/components/elements/Map-mapbox/utils";
import { loadAnrPlotGeometryGeoJson, useAnrPlotGeometry } from "@/connections/AnrPlotGeometry";
import { pruneBoundingBoxesCache } from "@/connections/BoundingBox";
import { updatePolygonVersionAsync, useListPolygonVersions } from "@/connections/PolygonVersion";
import {
  bulkUpdateSitePolygonStatus,
  deleteSitePolygon,
  PolygonStatus,
  pruneSitePolygonsCache
} from "@/connections/SitePolygons";
import {
  dropdownOptionsRestoration,
  dropdownOptionsTarget,
  dropdownOptionsTree
} from "@/constants/polygonDropdownOptions";
import { POLYGON_APPROVED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { useAnrMapOverlayOptional } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLatestRef } from "@/hooks/useLatestRef";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import LoadingTable from "@/redesignComponents/dataDisplay/Table/components/LoadingTable";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import DatePickerInput from "@/redesignComponents/Forms/Inputs/DateInputs/DatePickerInput/DatePickerInput";
import InputWithUnits from "@/redesignComponents/Forms/Inputs/InputWithUnits";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { DownloadIcon, RefreshIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import FloatingActionToolbar from "@/redesignComponents/navigation/Toolbar/FloatingActionToolbar";
import ApiSlice from "@/store/apiSlice";
import { trackPolygonDownloaded, trackPolygonStatusChanged } from "@/utils/polygonAnalytics";
import { isSitePolygonEligibleForAnrMonitoringPlots } from "@/utils/sitePolygonAnrEligibility";
import { getSingleSitePolygonApproveTooltip, isSitePolygonApprovable } from "@/utils/sitePolygonReview";
import { getSingleSitePolygonSubmitTooltip, isSitePolygonSubmittable } from "@/utils/sitePolygonSubmit";

import {
  closePolygonProgressToast,
  completePolygonProgressToast,
  getDownloadingPolygonsProgressLabel,
  getPolygonOperationToastLabels,
  POLYGON_TOAST_IDS,
  showPolygonCompleteToast,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "../utils/polygonOperationToasts";
import UploadGeotaggedPhotos from "./Modals/GeotaggedPhotos/UploadGeotaggedPhotos";
import type { PolygonSaveCallback } from "./polygonEdit.types";
import {
  type PolygonEditFormValues,
  isValidPlantStartDate,
  isValidPolygonName,
  prunePolygonValidationCache,
  runPolygonCacheCleanup,
  saveExistingPolygonVersion,
  saveNewSitePolygon
} from "./polygonEditSave";
import SubmissionValidationTags from "./SubmissionValidationTags";

type PolygonEditContentProps = {
  polygon?: SitePolygonLightDto;
  onClose?: () => void;
  onRegisterSave?: (saveHandler: () => Promise<boolean>) => void;
  onRegisterDelete: (deleteHandler: () => Promise<void>) => void;
  onRegisterSubmit: (submitHandler: (comment: string) => Promise<void>) => void;
  onRegisterPolygonName?: (getPolygonName: () => string) => void;
  onRegisterPlantStartDate?: (hasPlantStartDate: () => boolean) => void;
  onRequestDeleteModal: () => void;
  onRequestSubmitModal: () => void;
  onRequestAnrUploadModal?: (mode: "upload" | "replace") => void;
  onRequestAnrDeleteModal?: () => void;
  isAnrPlotsOperating?: boolean;
  onRequestApproveModal?: () => void;
  onRequestInformationModal?: () => void;
  onSaved?: PolygonSaveCallback;
  onPolygonUpdated?: (polygon: SitePolygonLightDto) => void;
  onSuppressMapSelectionHighlightChange?: (value: boolean) => void;
  onDeletingChange?: (isDeleting: boolean, count?: number) => void;
};

type PolygonVersionRow = SitePolygonLightDto & { id: string };

type PolygonEditAccordionSection = "details" | "monitoring-plots" | "geotagged-photos" | "versions";

const optionToSelectItem = (option: { title: string; value: string }) => ({
  label: option.title,
  value: option.value
});

const isoStringToDateValue = (value: string | null | undefined): DateValue[] => {
  if (value == null || value === "") return [];
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return [];
  return [new CalendarDate(year, month, day)];
};

const dateValueToIsoString = (value: DateValue | undefined): string | undefined => {
  if (value == null) return undefined;
  const mm = String(value.month).padStart(2, "0");
  const dd = String(value.day).padStart(2, "0");
  return `${value.year}-${mm}-${dd}T00:00:00.000Z`;
};

const normalizeTargetSystem = (value: string | null | undefined): string[] =>
  value != null && value !== "" ? value.split(",").map(item => item.trim()) : [];

const waitForMapEditCleanup = async (): Promise<void> => {
  await new Promise<void>(resolve => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
      return;
    }
    setTimeout(resolve, 0);
  });
};

const getPolygonNameForDisplay = (formName: string, polygon?: SitePolygonLightDto): string => {
  const trimmed = formName.trim();
  if (trimmed.length > 0) return trimmed;
  return polygon?.name?.trim() ?? "";
};

const hasPlantStartDateForDisplay = (formDate: DateValue[], polygon?: SitePolygonLightDto): boolean => {
  if (formDate.length > 0) return true;
  const plantStart = polygon?.plantStart;
  return plantStart != null && plantStart !== "";
};

const PolygonEditContent: FC<PolygonEditContentProps> = ({
  polygon,
  onClose,
  onRegisterSave,
  onRegisterDelete,
  onRegisterSubmit,
  onRegisterPolygonName,
  onRegisterPlantStartDate,
  onRequestDeleteModal,
  onRequestSubmitModal,
  onRequestAnrUploadModal,
  onRequestAnrDeleteModal,
  isAnrPlotsOperating = false,
  onRequestApproveModal,
  onRequestInformationModal,
  onSaved,
  onPolygonUpdated,
  onSuppressMapSelectionHighlightChange,
  onDeletingChange
}) => {
  const t = useT();
  const isAdmin = useIsAdmin();
  const toastLabels = useMemo(() => getPolygonOperationToastLabels(t), [t]);
  const showStatusToast = useCallback((type: "success" | "error" | "warning", label: string) => {
    if (type === "error") {
      showPolygonErrorToast(label);
      return;
    }
    if (type === "success") {
      showPolygonCompleteToast(label);
      return;
    }
    showToast({ label, type: "warning", placement: "bottom", duration: 5000, maxWidth: "auto" });
  }, []);
  const {
    polygonGeometryEdit,
    draftPolygonGeometry,
    siteData,
    setIsUserDrawingEnabled,
    setDraftPolygonGeometry,
    setPolygonGeometryEdit,
    setEditPolygon,
    setShouldRefetchPolygonData,
    closeMapPopups,
    invalidatePolygonMapTiles,
    setSelectedPolyVersion,
    setPreviewVersion,
    setStatusSelectedPolygon,
    showPhotosOnMap,
    setShowPhotosOnMap,
    mediaFiles
  } = useMapAreaContext();
  const [polygonName, setPolygonName] = useState("");
  const [plantStartDate, setPlantStartDate] = useState<DateValue[]>([]);
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState("");
  const [plotsVisible, setPlotsVisible] = useState(false);
  const [isVersionUpdating, setIsVersionUpdating] = useState(false);
  const [showUploadPhotosModal, setShowUploadPhotosModal] = useState(false);
  const [openAccordionSection, setOpenAccordionSection] = useState<PolygonEditAccordionSection | null>("details");

  const handleAccordionOpenChange = useCallback(
    (section: PolygonEditAccordionSection) => (open: boolean) => {
      if (open) {
        setOpenAccordionSection(section);
        return;
      }
      setOpenAccordionSection(current => (current === section ? null : current));
    },
    []
  );

  const sitePolygonUuid = polygon?.uuid ?? "";
  const geometryPolygonUuid = polygon?.polygonUuid ?? "";
  const isCreateMode = polygon?.primaryUuid == null || polygon.primaryUuid === "";
  const isPolygonSubmittable = isSitePolygonSubmittable(polygon);
  const submitTooltip = getSingleSitePolygonSubmitTooltip(polygon, t);
  const isPolygonApprovable = isSitePolygonApprovable(polygon);
  const approveTooltip = getSingleSitePolygonApproveTooltip(polygon, t);
  const shouldMapEditPolygon =
    openAccordionSection !== "monitoring-plots" && openAccordionSection !== "geotagged-photos";
  const resolvedSiteUuid = polygon?.siteId ?? (siteData != null && "uuid" in siteData ? siteData.uuid : "");
  const geotaggedPhotosCount = useMemo(
    () => mediaFiles.filter(file => file.lat != null && file.lng != null).length,
    [mediaFiles]
  );
  const geometryChanged =
    !isCreateMode &&
    polygonGeometryEdit?.polygonUuid === geometryPolygonUuid &&
    polygonGeometryEdit.isDirty &&
    polygonGeometryEdit.currentGeometry != null;
  const isAnrEligible = useMemo(() => isSitePolygonEligibleForAnrMonitoringPlots(polygon), [polygon]);
  const anrMapOverlay = useAnrMapOverlayOptional();
  // Overlay context identity changes when this effect updates it; read via ref to avoid a sync loop.
  const anrMapOverlayRef = useLatestRef(anrMapOverlay);

  const [anrConnectionReady, { data: anrPlotGeometry, isLoading: isAnrPlotGeometryLoading }] = useAnrPlotGeometry({
    sitePolygonUuid,
    enabled: sitePolygonUuid !== "" && isAnrEligible
  });
  const hasAnrPlotGeometry = (anrPlotGeometry?.geojson?.features?.length ?? 0) > 0;
  const isAnrLoading = isAnrEligible && sitePolygonUuid !== "" && (!anrConnectionReady || isAnrPlotGeometryLoading);

  const primaryUuid = polygon?.primaryUuid ?? undefined;
  const [isVersionsLoaded, { data: versionsData, refetch: refetchVersions }] = useListPolygonVersions({
    uuid: primaryUuid,
    enabled: primaryUuid != null
  });
  const isLoadingVersions = !isVersionsLoaded;

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
  const formattedArea = useMemo(
    () => polygon?.calcArea?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "",
    [polygon?.calcArea]
  );
  const versionRows = useMemo<PolygonVersionRow[]>(
    () => (versionsData ?? []).map(version => ({ ...version, id: version.uuid ?? version.polygonUuid ?? "" })),
    [versionsData]
  );
  useEffect(() => {
    setPolygonName(polygon?.name ?? "");
    setPlantStartDate(isoStringToDateValue(polygon?.plantStart));
    setRestorationPractice(polygon?.practice ?? []);
    setTargetLandUseSystem(normalizeTargetSystem(polygon?.targetSys));
    setTreeDistribution(polygon?.distr ?? []);
    setTreesPlanted(polygon?.numTrees != null ? String(polygon.numTrees) : "");
  }, [polygon]);

  const onSavedRef = useLatestRef(onSaved);
  const onCloseRef = useLatestRef(onClose);
  const onPolygonUpdatedRef = useLatestRef(onPolygonUpdated);
  const refetchVersionsRef = useLatestRef(refetchVersions);

  const getFormValues = useCallback(
    (): PolygonEditFormValues => ({
      polygonName,
      plantStartDate,
      restorationPractice,
      targetLandUseSystem,
      treeDistribution,
      treesPlanted
    }),
    [polygonName, plantStartDate, restorationPractice, targetLandUseSystem, treeDistribution, treesPlanted]
  );

  const finalizeSuccessfulSave = useCallback(
    async (
      savedPolygon: SitePolygonLightDto,
      options: { geometryChanged: boolean; refetchVersionsList: boolean; previousPolygonUuid?: string | null }
    ) => {
      runPolygonCacheCleanup({
        polygonUuid: savedPolygon.polygonUuid,
        previousPolygonUuid: options.previousPolygonUuid,
        geometryChanged: options.geometryChanged,
        invalidatePolygonMapTiles
      });
      setIsUserDrawingEnabled(false);
      setDraftPolygonGeometry(undefined);
      setPolygonGeometryEdit(undefined);
      onPolygonUpdatedRef.current?.(savedPolygon);
      setShouldRefetchPolygonData(true);
      await waitForMapEditCleanup();
      if (options.refetchVersionsList) {
        await refetchVersionsRef.current?.();
      }
      await onSavedRef.current?.();
      onCloseRef.current?.();
    },
    [
      invalidatePolygonMapTiles,
      onCloseRef,
      onPolygonUpdatedRef,
      onSavedRef,
      refetchVersionsRef,
      setDraftPolygonGeometry,
      setIsUserDrawingEnabled,
      setPolygonGeometryEdit,
      setShouldRefetchPolygonData
    ]
  );

  const saveNewPolygonFlow = useCallback(async (): Promise<boolean> => {
    if (draftPolygonGeometry == null) {
      showStatusToast("error", t("Draw a polygon before saving"));
      return false;
    }
    if (!isValidPolygonName(polygonName)) {
      showStatusToast("error", t("Polygon name is required"));
      return false;
    }
    if (!isValidPlantStartDate(plantStartDate)) {
      showStatusToast("error", t("Plant start date is required"));
      return false;
    }
    if (resolvedSiteUuid == null || resolvedSiteUuid === "") {
      showStatusToast("error", t("Missing site information"));
      return false;
    }

    showPolygonProgressToast(t, toastLabels.savingChangesProgress, POLYGON_TOAST_IDS.savingChanges);

    try {
      const createdPolygon = await saveNewSitePolygon({
        siteId: resolvedSiteUuid,
        geometry: draftPolygonGeometry,
        form: getFormValues(),
        dateValueToIso: dateValueToIsoString
      });
      await finalizeSuccessfulSave(createdPolygon, { geometryChanged: true, refetchVersionsList: false });
      completePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges, toastLabels.savingChangesComplete);
      return true;
    } catch {
      closePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges);
      showPolygonErrorToast(t("Error creating polygon"));
      return false;
    }
  }, [
    draftPolygonGeometry,
    finalizeSuccessfulSave,
    getFormValues,
    plantStartDate,
    polygonName,
    resolvedSiteUuid,
    showStatusToast,
    t,
    toastLabels
  ]);

  const saveExistingPolygonFlow = useCallback(async (): Promise<boolean> => {
    if (polygon?.primaryUuid == null || polygon.primaryUuid === "") {
      showStatusToast("error", t("Missing polygon information"));
      return false;
    }
    if (!isValidPolygonName(polygonName)) {
      showStatusToast("error", t("Polygon name is required"));
      return false;
    }
    if (!isValidPlantStartDate(plantStartDate)) {
      showStatusToast("error", t("Plant start date is required"));
      return false;
    }
    if (geometryChanged && (polygon.siteId == null || polygon.siteId === "")) {
      showStatusToast("error", t("Missing site information"));
      return false;
    }

    showPolygonProgressToast(t, toastLabels.savingChangesProgress, POLYGON_TOAST_IDS.savingChanges);

    try {
      const previousPolygonUuid = geometryPolygonUuid !== "" ? geometryPolygonUuid : undefined;
      const updatedPolygon = await saveExistingPolygonVersion({
        primaryUuid: polygon.primaryUuid,
        siteId: polygon.siteId as string,
        form: getFormValues(),
        geometryChanged,
        currentGeometry: polygonGeometryEdit?.currentGeometry,
        dateValueToIso: dateValueToIsoString
      });
      await finalizeSuccessfulSave(updatedPolygon, {
        geometryChanged,
        refetchVersionsList: true,
        previousPolygonUuid
      });
      completePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges, toastLabels.savingChangesComplete);
      return true;
    } catch {
      closePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges);
      showPolygonErrorToast(t("Error creating polygon version"));
      return false;
    }
  }, [
    finalizeSuccessfulSave,
    geometryChanged,
    geometryPolygonUuid,
    getFormValues,
    polygon?.primaryUuid,
    polygon?.siteId,
    polygonGeometryEdit?.currentGeometry,
    plantStartDate,
    polygonName,
    showStatusToast,
    t,
    toastLabels
  ]);

  const savePolygonData = useCallback(async () => {
    if (isCreateMode) return saveNewPolygonFlow();
    return saveExistingPolygonFlow();
  }, [isCreateMode, saveExistingPolygonFlow, saveNewPolygonFlow]);

  useEffect(() => {
    setPlotsVisible(false);
  }, [sitePolygonUuid]);

  useEffect(() => {
    if (!hasAnrPlotGeometry) {
      setPlotsVisible(false);
    }
  }, [hasAnrPlotGeometry]);

  useEffect(() => {
    if (!isAnrEligible) {
      setPlotsVisible(false);
      setOpenAccordionSection(current => (current === "monitoring-plots" ? "details" : current));
    }
  }, [isAnrEligible]);

  useEffect(() => {
    if (isCreateMode || geometryPolygonUuid === "") {
      onSuppressMapSelectionHighlightChange?.(false);
      return;
    }

    onSuppressMapSelectionHighlightChange?.(!shouldMapEditPolygon);
    setEditPolygon({
      isOpen: shouldMapEditPolygon,
      uuid: shouldMapEditPolygon ? geometryPolygonUuid : "",
      primaryUuid: shouldMapEditPolygon ? primaryUuid : undefined
    });

    if (!shouldMapEditPolygon) {
      setIsUserDrawingEnabled(false);
      setPolygonGeometryEdit(undefined);
    }
  }, [
    geometryPolygonUuid,
    isCreateMode,
    onSuppressMapSelectionHighlightChange,
    primaryUuid,
    setEditPolygon,
    setIsUserDrawingEnabled,
    setPolygonGeometryEdit,
    shouldMapEditPolygon
  ]);

  useEffect(
    () => () => {
      onSuppressMapSelectionHighlightChange?.(false);
    },
    [onSuppressMapSelectionHighlightChange]
  );

  useEffect(() => {
    const overlay = anrMapOverlayRef.current;
    if (overlay == null) return;

    const isMonitoringPlotsSectionActive = openAccordionSection === "monitoring-plots" || plotsVisible;
    const canShowAnrPlots = isAnrEligible && hasAnrPlotGeometry;
    overlay.setDrawerOpen(true);
    overlay.setAnrTabActive(canShowAnrPlots && isMonitoringPlotsSectionActive);
    overlay.setShowPlotsOnMap(canShowAnrPlots && plotsVisible);

    if (sitePolygonUuid !== "" && geometryPolygonUuid !== "") {
      overlay.syncDrawerSelection({
        sitePolygonUuid,
        geometryPolygonUuid,
        polygonStatus: polygon?.status ?? null,
        polygonName: polygon?.name ?? null
      });
    }
  }, [
    anrMapOverlayRef,
    geometryPolygonUuid,
    hasAnrPlotGeometry,
    isAnrEligible,
    openAccordionSection,
    plotsVisible,
    polygon?.name,
    polygon?.status,
    sitePolygonUuid
  ]);

  useEffect(
    () => () => {
      anrMapOverlayRef.current?.resetAnrMapOverlay();
    },
    [anrMapOverlayRef]
  );

  useEffect(() => {
    if (openAccordionSection !== "geotagged-photos") {
      setShowPhotosOnMap(false);
    }
  }, [openAccordionSection, setShowPhotosOnMap]);

  useEffect(
    () => () => {
      setShowPhotosOnMap(false);
    },
    [setShowPhotosOnMap]
  );

  const downloadMonitoringPlots = useCallback(async () => {
    if (sitePolygonUuid === "" || !isAnrEligible) {
      showStatusToast("error", t("ANR monitoring plots are not available for this polygon"));
      return;
    }

    showPolygonProgressToast(t, toastLabels.downloadingSamplePlotsProgress, POLYGON_TOAST_IDS.downloadingSamplePlots);

    try {
      const response = await loadAnrPlotGeometryGeoJson({ sitePolygonUuid });
      const geojson = extractGeoJsonFromResponse(response.data);
      if (geojson == null) {
        throw new Error("Failed to extract ANR monitoring plots GeoJSON");
      }
      const filename = formatFileName(`${polygon?.name ?? "polygon"}_anr_monitoring_plots`);
      downloadGeoJsonFile(geojson, filename);
      if (resolvedSiteUuid !== "" && geometryPolygonUuid !== "") {
        trackPolygonDownloaded({
          siteUuid: resolvedSiteUuid,
          polygonType: "monitoring_plot",
          polygonId: geometryPolygonUuid,
          polygonCount: 1
        });
      }
      completePolygonProgressToast(
        POLYGON_TOAST_IDS.downloadingSamplePlots,
        toastLabels.downloadingSamplePlotsComplete
      );
    } catch (error) {
      closePolygonProgressToast(POLYGON_TOAST_IDS.downloadingSamplePlots);
      showPolygonErrorToast(t("Error downloading ANR monitoring plots"));
    }
  }, [
    geometryPolygonUuid,
    isAnrEligible,
    polygon?.name,
    resolvedSiteUuid,
    showStatusToast,
    sitePolygonUuid,
    t,
    toastLabels
  ]);

  const makeVersionActive = useCallback(
    async (version: SitePolygonLightDto) => {
      if (version.uuid == null || version.uuid === "") {
        showStatusToast("error", t("Missing polygon version information"));
        return;
      }

      if (version.isActive) {
        showStatusToast("warning", t("Polygon version is already active"));
        return;
      }

      try {
        setIsVersionUpdating(true);
        const previousGeometryUuid = geometryPolygonUuid;
        const updatedVersion = await updatePolygonVersionAsync(version.uuid, { isActive: true });

        setPolygonGeometryEdit(undefined);
        setSelectedPolyVersion(undefined);
        setPreviewVersion(false);

        pruneSitePolygonsCache();
        prunePolygonValidationCache(previousGeometryUuid, updatedVersion.polygonUuid);
        if (previousGeometryUuid !== "") {
          ApiSlice.pruneCache("geojsonExports", [previousGeometryUuid]);
        }
        if (updatedVersion.polygonUuid != null && updatedVersion.polygonUuid !== "") {
          ApiSlice.pruneCache("geojsonExports", [updatedVersion.polygonUuid]);
        }
        pruneBoundingBoxesCache();
        invalidatePolygonMapTiles();

        await refetchVersions?.();
        await onSaved?.();
        onPolygonUpdated?.(updatedVersion);
        setStatusSelectedPolygon(updatedVersion.status ?? "");
        setShouldRefetchPolygonData(true);

        showStatusToast("success", t("Polygon version updated successfully"));
      } catch (error) {
        showStatusToast("error", t("Error updating polygon version"));
      } finally {
        setIsVersionUpdating(false);
      }
    },
    [
      geometryPolygonUuid,
      invalidatePolygonMapTiles,
      onPolygonUpdated,
      onSaved,
      showStatusToast,
      refetchVersions,
      setPolygonGeometryEdit,
      setPreviewVersion,
      setSelectedPolyVersion,
      setShouldRefetchPolygonData,
      setStatusSelectedPolygon,
      t
    ]
  );

  const handleDownloadPolygon = useCallback(async () => {
    if (geometryPolygonUuid === "") {
      showStatusToast("error", t("Missing polygon information"));
      return;
    }

    showPolygonProgressToast(t, getDownloadingPolygonsProgressLabel(t, 1), POLYGON_TOAST_IDS.downloading);

    try {
      await downloadPolygonGeoJson(geometryPolygonUuid, polygon?.name ?? "polygon", { includeExtendedData: true });
      if (resolvedSiteUuid !== "") {
        trackPolygonDownloaded({
          siteUuid: resolvedSiteUuid,
          polygonType: "standard",
          polygonId: geometryPolygonUuid,
          polygonCount: 1
        });
      }
      onClose?.();
      completePolygonProgressToast(POLYGON_TOAST_IDS.downloading, toastLabels.downloadingPolygonsComplete);
    } catch (error) {
      closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
      showPolygonErrorToast(t("Error downloading polygon"));
    }
  }, [geometryPolygonUuid, onClose, polygon?.name, resolvedSiteUuid, showStatusToast, t, toastLabels]);

  const handleSubmitPolygon = useCallback(
    async (comment: string) => {
      if (polygon?.uuid == null || polygon.uuid === "") {
        showStatusToast("error", t("Missing polygon information"));
        return;
      }

      if (polygon.status === POLYGON_PENDING_APPROVAL || polygon.status === POLYGON_APPROVED) {
        showStatusToast("error", t("This polygon has already been submitted"));
        return;
      }

      try {
        await bulkUpdateSitePolygonStatus([polygon.uuid], POLYGON_PENDING_APPROVAL as PolygonStatus, comment);
        if (resolvedSiteUuid !== "" && geometryPolygonUuid !== "") {
          trackPolygonStatusChanged({
            siteUuid: resolvedSiteUuid,
            polygonId: geometryPolygonUuid,
            fromStatus: polygon.status ?? "draft",
            toStatus: POLYGON_PENDING_APPROVAL
          });
        }
        pruneSitePolygonsCache();
        closeMapPopups();
        invalidatePolygonMapTiles();
        setIsUserDrawingEnabled(false);
        setPolygonGeometryEdit(undefined);
        setStatusSelectedPolygon(POLYGON_PENDING_APPROVAL);
        setShouldRefetchPolygonData(true);
        onClose?.();
        await waitForMapEditCleanup();
        await onSaved?.();
      } catch (error) {
        closePolygonProgressToast(POLYGON_TOAST_IDS.submitting);
        showPolygonErrorToast(t("Error submitting polygon"));
      }
    },
    [
      closeMapPopups,
      invalidatePolygonMapTiles,
      onClose,
      onSaved,
      geometryPolygonUuid,
      polygon?.status,
      polygon?.uuid,
      resolvedSiteUuid,
      setIsUserDrawingEnabled,
      setPolygonGeometryEdit,
      setShouldRefetchPolygonData,
      setStatusSelectedPolygon,
      showStatusToast,
      t
    ]
  );

  const handleDeletePolygon = useCallback(async () => {
    if (polygon?.uuid == null || polygon.uuid === "") {
      showStatusToast("error", t("Missing polygon information"));
      return;
    }

    onDeletingChange?.(true, 1);

    try {
      await deleteSitePolygon(polygon.uuid);
      pruneSitePolygonsCache();
      if (geometryPolygonUuid !== "") {
        prunePolygonValidationCache(geometryPolygonUuid);
        ApiSlice.pruneCache("geojsonExports", [geometryPolygonUuid]);
      }
      closeMapPopups();
      setIsUserDrawingEnabled(false);
      setPolygonGeometryEdit(undefined);
      invalidatePolygonMapTiles();
      setShouldRefetchPolygonData(true);
      onClose?.();
      await waitForMapEditCleanup();
      await onSaved?.();
      completePolygonProgressToast(POLYGON_TOAST_IDS.deleting, toastLabels.deletingComplete);
    } catch (error) {
      closePolygonProgressToast(POLYGON_TOAST_IDS.deleting);
      showPolygonErrorToast(t("Error deleting polygon"));
      throw error;
    } finally {
      onDeletingChange?.(false);
    }
  }, [
    closeMapPopups,
    geometryPolygonUuid,
    invalidatePolygonMapTiles,
    onClose,
    onDeletingChange,
    onSaved,
    polygon?.uuid,
    setIsUserDrawingEnabled,
    setPolygonGeometryEdit,
    setShouldRefetchPolygonData,
    showStatusToast,
    t,
    toastLabels
  ]);

  useEffect(() => {
    onRegisterSave?.(savePolygonData);
  }, [onRegisterSave, savePolygonData]);

  useEffect(() => {
    onRegisterDelete(handleDeletePolygon);
  }, [handleDeletePolygon, onRegisterDelete]);

  useEffect(() => {
    onRegisterSubmit(handleSubmitPolygon);
  }, [handleSubmitPolygon, onRegisterSubmit]);

  useEffect(() => {
    onRegisterPolygonName?.(() => getPolygonNameForDisplay(polygonName, polygon));
  }, [onRegisterPolygonName, polygon, polygonName]);

  useEffect(() => {
    onRegisterPlantStartDate?.(() => hasPlantStartDateForDisplay(plantStartDate, polygon));
  }, [onRegisterPlantStartDate, plantStartDate, polygon]);

  return (
    <Flex className="min-h-0 flex-1 flex-col gap-2">
      <UploadGeotaggedPhotos
        open={showUploadPhotosModal}
        siteUuid={resolvedSiteUuid}
        onOpenChange={setShowUploadPhotosModal}
      />
      <Flex className="mr-[0.25rem] min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden py-5 px-2 pl-6 pr-7">
        <SubmissionValidationTags polygon={polygon} />
        <Accordion
          header={<AccordionHeader title={t("Details")} />}
          open={openAccordionSection === "details"}
          onOpenChange={handleAccordionOpenChange("details")}
        >
          <Flex className="mb-4 flex-1 flex-col gap-4">
            <TextInput
              label={t("Polygon Name")}
              name="polygonName"
              placeholder={t("Full Polygon Name")}
              value={polygonName}
              onChange={event => setPolygonName(event.target.value)}
              required
            />
            <DatePickerInput
              required
              showOptionalLabel={false}
              label={t("Plant Start Date")}
              value={plantStartDate}
              onValueChange={setPlantStartDate}
            />
            <SelectInput
              key={`restoration-practice-${sitePolygonUuid}-${(polygon?.practice ?? []).join("|")}`}
              items={restorationOptions}
              label={t("Restoration Practice")}
              defaultValue={polygon?.practice ?? []}
              onChange={setRestorationPractice}
              placeholder={t("Select...")}
              multiple
            />
            <SelectInput
              items={targetOptions}
              label={t("Target Land Use")}
              value={targetLandUseSystem}
              onChange={value => setTargetLandUseSystem(value.slice(0, 1))}
              placeholder={t("Select...")}
            />
            <SelectInput
              key={`tree-distribution-${sitePolygonUuid}-${(polygon?.distr ?? []).join("|")}`}
              items={treeOptions}
              label={t("Tree Distribution")}
              defaultValue={polygon?.distr ?? []}
              onChange={setTreeDistribution}
              placeholder={t("Select...")}
              multiple
            />
            <TextInput
              label={t("Trees Planted")}
              name="treesPlanted"
              placeholder={t("Enter Trees Planted")}
              value={treesPlanted}
              onChange={event => setTreesPlanted(event.target.value.replace(/\D/g, ""))}
            />
            <InputWithUnits
              key={polygon?.uuid}
              label={t("Estimated Area")}
              onChange={function noRefCheck() {}}
              disabled
              defaultValue={formattedArea}
              defaultUnit="ha"
              units={[
                {
                  label: t("ha"),
                  value: "ha"
                }
              ]}
            />
          </Flex>
        </Accordion>
        {isAnrEligible ? (
          <Accordion
            header={<AccordionHeader title={t("Monitoring Plots")} />}
            open={openAccordionSection === "monitoring-plots"}
            onOpenChange={handleAccordionOpenChange("monitoring-plots")}
            actions={
              <Flex gap={2}>
                {hasAnrPlotGeometry ? (
                  <>
                    <Button
                      leftIcon={<DownloadIcon />}
                      onClick={() => void downloadMonitoringPlots()}
                      size="small"
                      variant="secondary"
                      disabled={isAnrPlotsOperating}
                    >
                      {t("Download")}
                    </Button>
                    <Button
                      leftIcon={<RefreshIcon />}
                      onClick={() => onRequestAnrUploadModal?.("replace")}
                      size="small"
                      variant="secondary"
                      disabled={isAnrPlotsOperating}
                    >
                      {t("Update")}
                    </Button>
                  </>
                ) : (
                  <Button
                    leftIcon={<UploadIcon />}
                    onClick={() => onRequestAnrUploadModal?.("upload")}
                    size="small"
                    variant="secondary"
                    disabled={isAnrPlotsOperating}
                  >
                    {t("Upload")}
                  </Button>
                )}
              </Flex>
            }
          >
            <Flex className="mb-4 flex-1 flex-col gap-4">
              {isAnrLoading ? (
                <Text>{t("Loading ANR monitoring plots...")}</Text>
              ) : hasAnrPlotGeometry ? (
                <>
                  <Switch
                    name="showPlotsOnMap"
                    checked={plotsVisible}
                    onCheckedChange={({ checked }: { checked?: boolean | "indeterminate" }) =>
                      setPlotsVisible(checked === true)
                    }
                  >
                    {t("Show Plots on Map")}
                  </Switch>
                  <Text>
                    {t(
                      "These monitoring plots mark the specific areas where tree counts are conducted to track natural regeneration over time."
                    )}
                  </Text>
                  <Button
                    variant="borderless"
                    typeVariant="negative"
                    className="!justify-start !px-0"
                    disabled={isAnrPlotsOperating}
                    onClick={() => onRequestAnrDeleteModal?.()}
                  >
                    {t("Delete Plots")}
                  </Button>
                </>
              ) : (
                <Text textStyle="400-bold" color="neutral.900">
                  {t("No monitoring plots yet.")}
                </Text>
              )}
            </Flex>
          </Accordion>
        ) : null}
        <Accordion
          header={<AccordionHeader title={t("Geotagged Photos")} />}
          open={openAccordionSection === "geotagged-photos"}
          onOpenChange={handleAccordionOpenChange("geotagged-photos")}
          actions={
            <Button
              leftIcon={<UploadIcon />}
              onClick={() => setShowUploadPhotosModal(true)}
              size="small"
              variant="secondary"
            >
              {t("Upload")}
            </Button>
          }
        >
          <Flex className="mb-4 flex-1 flex-col gap-4">
            <Flex className="items-center gap-1">
              <Text textStyle="400-bold" color="neutral.900">{`${geotaggedPhotosCount} ${t("Photos")}`}</Text>
              <Text textStyle="400" color="neutral.900">
                {t("available")}
              </Text>
            </Flex>
            <Switch
              name="showPhotosOnMap"
              checked={showPhotosOnMap}
              onCheckedChange={({ checked }: { checked?: boolean | "indeterminate" }) =>
                setShowPhotosOnMap(checked === true)
              }
            >
              {t("Show Photos on Map")}
            </Switch>
          </Flex>
        </Accordion>
        <Accordion
          header={t("Versions")}
          open={openAccordionSection === "versions"}
          onOpenChange={handleAccordionOpenChange("versions")}
        >
          <Table<PolygonVersionRow>
            columns={[
              {
                key: "name",
                label: t("Version Name")
              },
              {
                key: "createdAt",
                label: t("Date")
              },
              {
                key: "isActive",
                label: t("State")
              }
            ]}
            data={versionRows}
            renderRow={row => (
              <TableRow key={row.uuid}>
                <TableCell>
                  <Text title={row.versionName ?? row.name ?? t("Unnamed Polygon")} className="max-w-[10rem] truncate">
                    {row.versionName ?? row.name ?? t("Unnamed Polygon")}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text>{row.createdAt != null ? format(new Date(row.createdAt), "MM/dd/yyyy") : "-"}</Text>
                </TableCell>
                <TableCell>
                  <MultiActionButton
                    mainActionLabel={row.isActive ? t("Active") : t("Inactive")}
                    mainActionOnClick={() => {
                      if (!row.isActive) {
                        void makeVersionActive(row);
                      }
                    }}
                    otherActions={[
                      {
                        label: t("Active"),
                        onClick: () => void makeVersionActive(row),
                        value: "active"
                      }
                    ]}
                    disabled={isVersionUpdating || row.isActive}
                    size="small"
                    variant="secondary"
                  />
                </TableCell>
              </TableRow>
            )}
          />
          {isLoadingVersions ? <LoadingTable text="Loading Versions" /> : null}
        </Accordion>
      </Flex>
      {!isCreateMode && (
        <>
          <Flex className="w-full justify-center pb-2 wriDrawer:pb-0">
            <FloatingActionToolbar
              className="bg-theme-neutral-200"
              items={[
                { label: t("Delete"), onClick: onRequestDeleteModal, labelColor: "error.500" },
                { label: t("Download"), onClick: () => void handleDownloadPolygon() },
                isAdmin
                  ? {
                      label: t("Review"),
                      onClick: () => {},
                      infoTooltip: !isPolygonApprovable ? approveTooltip : undefined,
                      otherActions: [
                        { label: t("Approve"), value: "approve", onClick: onRequestApproveModal ?? (() => {}) },
                        {
                          label: t("Request information"),
                          value: "request-information",
                          onClick: onRequestInformationModal ?? (() => {})
                        }
                      ]
                    }
                  : {
                      label: t("Submit"),
                      disabled: !isPolygonSubmittable,
                      infoTooltip: !isPolygonSubmittable ? submitTooltip : undefined,
                      onClick: onRequestSubmitModal
                    }
              ]}
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default PolygonEditContent;
