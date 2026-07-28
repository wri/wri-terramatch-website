import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { dispatchClearDraftDrawEvent } from "@/components/elements/Map-mapbox/interactions/draftDrawEvents";
import { useAnrMapOverlayOptional } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import type {
  PolygonOverlapFixCallback,
  PolygonSaveCallback,
  PolygonValidationJobsStartedCallback,
  PolygonValidationPendingCallback
} from "@/pages/site/[uuid]/components/polygonEdit.types";
import PolygonEditDrawer from "@/pages/site/[uuid]/components/PolygonEditDrawer";
import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";

import type { PolygonEditDrawerPolygon, PolygonEditDrawerTab } from "./polygonEditDrawer.types";

export type { PolygonEditDrawerPolygon };

export const EMPTY_POLYGONS: SitePolygonLightDto[] = [];

type PolygonEditDrawerContextValue = {
  isOpen: boolean;
  polygon: PolygonEditDrawerPolygon;
  suppressMapSelectionHighlight: boolean;
  openPolygonEdit: (params?: PolygonEditDrawerPolygon) => void;
  closePolygonEdit: () => void;
  setOpen: (open: boolean) => void;
  setSuppressMapSelectionHighlight: (value: boolean) => void;
};

const defaultContextValue: PolygonEditDrawerContextValue = {
  isOpen: false,
  polygon: {},
  suppressMapSelectionHighlight: false,
  openPolygonEdit: () => {},
  closePolygonEdit: () => {},
  setOpen: () => {},
  setSuppressMapSelectionHighlight: () => {}
};

const PolygonEditDrawerContext = createContext<PolygonEditDrawerContextValue>(defaultContextValue);

let openPolygonEditExternal: ((params?: PolygonEditDrawerPolygon) => void) | null = null;

export const openPolygonEditDrawer = (params?: PolygonEditDrawerPolygon): void => {
  openPolygonEditExternal?.(params);
};

export const usePolygonEditDrawer = (): PolygonEditDrawerContextValue => {
  return useContext(PolygonEditDrawerContext);
};

type PolygonEditDrawerProviderProps = {
  children: ReactNode;
};

type PolygonRunValidationCallback = (geometryPolygonUuids: string[]) => Promise<void>;

type PolygonDeletingChangeCallback = (isDeleting: boolean, count?: number) => void;

export type PolygonReviewActionCallback = () => void;

type PolygonEditDrawerDataSyncProps = {
  polygons?: SitePolygonLightDto[];
  onRefetchPolygons?: PolygonSaveCallback;
  onOverlapFixed?: PolygonOverlapFixCallback;
  onRunValidation?: PolygonRunValidationCallback;
  onPolygonDeletingChange?: PolygonDeletingChangeCallback;
  onRequestApproveModal?: PolygonReviewActionCallback;
  onRequestInformationModal?: PolygonReviewActionCallback;
  onValidationJobsStarted?: PolygonValidationJobsStartedCallback;
  onOverlapFixValidationStarted?: PolygonValidationPendingCallback;
  onOverlapFixValidationFailed?: () => void;
};

type PolygonEditDrawerDataContextValue = {
  setPolygons: (polygons: SitePolygonLightDto[]) => void;
  setOnRefetchPolygons: (onRefetch?: PolygonSaveCallback) => void;
  setOnOverlapFixed: (onOverlapFixed?: PolygonOverlapFixCallback) => void;
  setOnRunValidation: (onRunValidation?: PolygonRunValidationCallback) => void;
  setOnPolygonDeletingChange: (onPolygonDeletingChange?: PolygonDeletingChangeCallback) => void;
  setOnRequestApproveModal: (cb?: PolygonReviewActionCallback) => void;
  setOnRequestInformationModal: (cb?: PolygonReviewActionCallback) => void;
  setOnValidationJobsStarted: (onValidationJobsStarted?: PolygonValidationJobsStartedCallback) => void;
  setOnOverlapFixValidationStarted: (handler?: PolygonValidationPendingCallback) => void;
  setOnOverlapFixValidationFailed: (handler?: () => void) => void;
};

const PolygonEditDrawerDataContext = createContext<PolygonEditDrawerDataContextValue | null>(null);

export const PolygonEditDrawerDataSync: FC<PolygonEditDrawerDataSyncProps> = ({
  polygons = EMPTY_POLYGONS,
  onRefetchPolygons,
  onOverlapFixed,
  onRunValidation,
  onPolygonDeletingChange,
  onRequestApproveModal,
  onRequestInformationModal,
  onValidationJobsStarted,
  onOverlapFixValidationStarted,
  onOverlapFixValidationFailed
}) => {
  const dataContext = useContext(PolygonEditDrawerDataContext);

  useEffect(() => {
    dataContext?.setPolygons(polygons);
  }, [dataContext, polygons]);

  useEffect(() => {
    dataContext?.setOnRefetchPolygons(onRefetchPolygons);
  }, [dataContext, onRefetchPolygons]);

  useEffect(() => {
    dataContext?.setOnOverlapFixed(onOverlapFixed);
  }, [dataContext, onOverlapFixed]);

  useEffect(() => {
    dataContext?.setOnRunValidation(onRunValidation);
  }, [dataContext, onRunValidation]);

  useEffect(() => {
    dataContext?.setOnPolygonDeletingChange(onPolygonDeletingChange);
  }, [dataContext, onPolygonDeletingChange]);

  useEffect(() => {
    dataContext?.setOnRequestApproveModal(onRequestApproveModal);
  }, [dataContext, onRequestApproveModal]);

  useEffect(() => {
    dataContext?.setOnRequestInformationModal(onRequestInformationModal);
  }, [dataContext, onRequestInformationModal]);

  useEffect(() => {
    dataContext?.setOnValidationJobsStarted(onValidationJobsStarted);
  }, [dataContext, onValidationJobsStarted]);

  useEffect(() => {
    dataContext?.setOnOverlapFixValidationStarted(onOverlapFixValidationStarted);
  }, [dataContext, onOverlapFixValidationStarted]);

  useEffect(() => {
    dataContext?.setOnOverlapFixValidationFailed(onOverlapFixValidationFailed);
  }, [dataContext, onOverlapFixValidationFailed]);

  return null;
};

const PolygonEditDrawerLayoutShellSync: FC = () => {
  const { isOpen } = usePolygonEditDrawer();
  const { setSidebarCollapseDisabled } = useLayoutShell();

  useEffect(() => {
    setSidebarCollapseDisabled(isOpen);
    return () => setSidebarCollapseDisabled(false);
  }, [isOpen, setSidebarCollapseDisabled]);

  return null;
};

export const PolygonEditDrawerProvider: FC<PolygonEditDrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [polygon, setPolygon] = useState<PolygonEditDrawerPolygon>({});
  const [defaultTab, setDefaultTab] = useState<PolygonEditDrawerTab>("edit");
  const [polygons, setPolygons] = useState(EMPTY_POLYGONS);
  const [suppressMapSelectionHighlight, setSuppressMapSelectionHighlight] = useState(false);

  const onRefetchPolygonsRef = useRef<PolygonSaveCallback | undefined>(undefined);
  const onOverlapFixedRef = useRef<PolygonOverlapFixCallback | undefined>(undefined);
  const onRunValidationRef = useRef<PolygonRunValidationCallback | undefined>(undefined);
  const onPolygonDeletingChangeRef = useRef<PolygonDeletingChangeCallback | undefined>(undefined);
  const onRequestApproveModalRef = useRef<PolygonReviewActionCallback | undefined>(undefined);
  const onRequestInformationModalRef = useRef<PolygonReviewActionCallback | undefined>(undefined);
  const onValidationJobsStartedRef = useRef<PolygonValidationJobsStartedCallback | undefined>(undefined);
  const onOverlapFixValidationStartedRef = useRef<PolygonValidationPendingCallback | undefined>(undefined);
  const onOverlapFixValidationFailedRef = useRef<(() => void) | undefined>(undefined);

  const setOnRefetchPolygons = useCallback((handler?: PolygonSaveCallback) => {
    onRefetchPolygonsRef.current = handler;
  }, []);

  const setOnOverlapFixed = useCallback((handler?: PolygonOverlapFixCallback) => {
    onOverlapFixedRef.current = handler;
  }, []);

  const setOnRunValidation = useCallback((handler?: PolygonRunValidationCallback) => {
    onRunValidationRef.current = handler;
  }, []);

  const setOnPolygonDeletingChange = useCallback((handler?: PolygonDeletingChangeCallback) => {
    onPolygonDeletingChangeRef.current = handler;
  }, []);

  const setOnRequestApproveModal = useCallback((cb?: PolygonReviewActionCallback) => {
    onRequestApproveModalRef.current = cb;
  }, []);

  const setOnRequestInformationModal = useCallback((cb?: PolygonReviewActionCallback) => {
    onRequestInformationModalRef.current = cb;
  }, []);

  const setOnValidationJobsStarted = useCallback((handler?: PolygonValidationJobsStartedCallback) => {
    onValidationJobsStartedRef.current = handler;
  }, []);

  const setOnOverlapFixValidationStarted = useCallback((handler?: PolygonValidationPendingCallback) => {
    onOverlapFixValidationStartedRef.current = handler;
  }, []);

  const setOnOverlapFixValidationFailed = useCallback((handler?: () => void) => {
    onOverlapFixValidationFailedRef.current = handler;
  }, []);

  const handlePolygonDeletingChange = useCallback((isDeleting: boolean, count?: number) => {
    onPolygonDeletingChangeRef.current?.(isDeleting, count);
  }, []);

  const handleRunValidation = useCallback(async (geometryPolygonUuids: string[]) => {
    await onRunValidationRef.current?.(geometryPolygonUuids);
  }, []);

  const handleRequestApproveModal = useCallback(() => {
    onRequestApproveModalRef.current?.();
  }, []);

  const handleRequestInformationModal = useCallback(() => {
    onRequestInformationModalRef.current?.();
  }, []);

  const handleValidationJobsStarted = useCallback(
    (geometryPolygonUuids: string[], options?: { trackBulkCompletion?: boolean }) => {
      onValidationJobsStartedRef.current?.(geometryPolygonUuids, options);
    },
    []
  );

  const handleOverlapFixValidationStarted = useCallback(
    (geometryPolygonUuids: string[], options?: { poll?: boolean }) => {
      onOverlapFixValidationStartedRef.current?.(geometryPolygonUuids, options);
    },
    []
  );

  const handleOverlapFixValidationFailed = useCallback(() => {
    onOverlapFixValidationFailedRef.current?.();
  }, []);

  const handleSaved = useCallback(() => onRefetchPolygonsRef.current?.(), []);

  const dataContextValue = useMemo(
    () => ({
      setPolygons,
      setOnRefetchPolygons,
      setOnOverlapFixed,
      setOnRunValidation,
      setOnPolygonDeletingChange,
      setOnRequestApproveModal,
      setOnRequestInformationModal,
      setOnValidationJobsStarted,
      setOnOverlapFixValidationStarted,
      setOnOverlapFixValidationFailed
    }),
    [
      setOnRefetchPolygons,
      setOnOverlapFixed,
      setOnRunValidation,
      setOnPolygonDeletingChange,
      setOnRequestApproveModal,
      setOnRequestInformationModal,
      setOnValidationJobsStarted,
      setOnOverlapFixValidationStarted,
      setOnOverlapFixValidationFailed
    ]
  );
  const {
    closeMapPopups,
    setEditPolygon,
    setIsUserDrawingEnabled,
    setPolygonGeometryEdit,
    setDraftPolygonGeometry,
    setShouldRefetchPolygonData,
    setShowPhotosOnMap,
    setGeotaggedPhotosMapVisible
  } = useMapAreaContext();
  const anrMapOverlay = useAnrMapOverlayOptional();

  const openPolygonEdit = useCallback(
    (params?: PolygonEditDrawerPolygon) => {
      closeMapPopups();
      setShowPhotosOnMap(false);
      setGeotaggedPhotosMapVisible(false);
      const polygonUuid = params?.polygonUuid ?? params?.sitePolygon?.polygonUuid ?? undefined;
      const primaryUuid = params?.sitePolygon?.primaryUuid;
      if (polygonUuid == null || polygonUuid === "") {
        setDraftPolygonGeometry(undefined);
      }
      setPolygon({
        polygonUuid,
        polygonName: params?.polygonName,
        sitePolygon: params?.sitePolygon
      });
      setDefaultTab(params?.defaultTab ?? "edit");
      if (polygonUuid != null && polygonUuid !== "") {
        setEditPolygon({ isOpen: true, uuid: polygonUuid, primaryUuid: primaryUuid ?? undefined });
      }
      setIsOpen(true);
    },
    [closeMapPopups, setDraftPolygonGeometry, setEditPolygon, setGeotaggedPhotosMapVisible, setShowPhotosOnMap]
  );

  const closePolygonEdit = useCallback(() => {
    setIsOpen(false);
    setPolygon({});
    setDefaultTab("edit");
    setSuppressMapSelectionHighlight(false);
    dispatchClearDraftDrawEvent();
    setIsUserDrawingEnabled(false);
    setEditPolygon({ isOpen: false, uuid: "" });
    setPolygonGeometryEdit(undefined);
    setDraftPolygonGeometry(undefined);
    setShowPhotosOnMap(false);
    setGeotaggedPhotosMapVisible(false);
    anrMapOverlay?.resetAnrMapOverlay();
  }, [
    anrMapOverlay,
    setDraftPolygonGeometry,
    setEditPolygon,
    setGeotaggedPhotosMapVisible,
    setIsUserDrawingEnabled,
    setPolygonGeometryEdit,
    setShowPhotosOnMap
  ]);

  const setSelectedPolygon = useCallback(
    (sitePolygon: SitePolygonLightDto) => {
      setPolygon({
        polygonUuid: sitePolygon.polygonUuid ?? undefined,
        polygonName: sitePolygon.name ?? undefined,
        sitePolygon
      });
      if (isOpen && sitePolygon.polygonUuid != null && sitePolygon.polygonUuid !== "") {
        setEditPolygon({
          isOpen: true,
          uuid: sitePolygon.polygonUuid,
          primaryUuid: sitePolygon.primaryUuid ?? undefined
        });
      }
    },
    [isOpen, setEditPolygon]
  );

  const handleOverlapFixed = useCallback(
    async (params: Parameters<PolygonOverlapFixCallback>[0]) => {
      const updatedPolygon = await onOverlapFixedRef.current?.(params);
      if (updatedPolygon == null) {
        return undefined;
      }

      setSelectedPolygon(updatedPolygon);
      setShouldRefetchPolygonData(true);
      return updatedPolygon;
    },
    [setSelectedPolygon, setShouldRefetchPolygonData]
  );

  const setOpen = useCallback(
    (open: boolean) => {
      if (open) {
        setIsOpen(true);
        return;
      }
      closePolygonEdit();
    },
    [closePolygonEdit]
  );

  useEffect(() => {
    openPolygonEditExternal = openPolygonEdit;
    return () => {
      openPolygonEditExternal = null;
    };
  }, [openPolygonEdit]);

  const value = useMemo(
    () => ({
      isOpen,
      polygon,
      suppressMapSelectionHighlight,
      openPolygonEdit,
      closePolygonEdit,
      setOpen,
      setSuppressMapSelectionHighlight
    }),
    [closePolygonEdit, isOpen, openPolygonEdit, polygon, setOpen, suppressMapSelectionHighlight]
  );

  const selectedPolygon = useMemo(() => {
    if (polygon.polygonUuid == null || polygon.polygonUuid === "") {
      return polygon.sitePolygon;
    }

    return (
      polygons.find(item => item.polygonUuid === polygon.polygonUuid || item.uuid === polygon.sitePolygon?.uuid) ??
      polygon.sitePolygon
    );
  }, [polygon, polygons]);

  return (
    <PolygonEditDrawerDataContext.Provider value={dataContextValue}>
      <PolygonEditDrawerContext.Provider value={value}>
        <PolygonEditDrawerLayoutShellSync />
        {children}
        <PolygonEditDrawer
          open={isOpen}
          polygon={polygon}
          selectedPolygon={selectedPolygon}
          onOpenChange={setOpen}
          onSaved={handleSaved}
          onOverlapFixed={handleOverlapFixed}
          onRunValidation={handleRunValidation}
          onValidationJobsStarted={handleValidationJobsStarted}
          onOverlapFixValidationStarted={handleOverlapFixValidationStarted}
          onOverlapFixValidationFailed={handleOverlapFixValidationFailed}
          onPolygonUpdated={setSelectedPolygon}
          onSuppressMapSelectionHighlightChange={setSuppressMapSelectionHighlight}
          onDeletingChange={handlePolygonDeletingChange}
          onRequestApproveModal={handleRequestApproveModal}
          onRequestInformationModal={handleRequestInformationModal}
          defaultTab={defaultTab}
        />
      </PolygonEditDrawerContext.Provider>
    </PolygonEditDrawerDataContext.Provider>
  );
};
