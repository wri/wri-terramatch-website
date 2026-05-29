import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { dispatchClearDraftDrawEvent } from "@/components/elements/Map-mapbox/interactions/draftDrawEvents";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import type { PolygonSaveCallback } from "@/pages/site/[uuid]/components/polygonEdit.types";
import PolygonEditDrawer from "@/pages/site/[uuid]/components/PolygonEditDrawer";

import type { PolygonEditDrawerPolygon } from "./polygonEditDrawer.types";

export type { PolygonEditDrawerPolygon };

export const EMPTY_POLYGONS: SitePolygonLightDto[] = [];

type PolygonEditDrawerContextValue = {
  isOpen: boolean;
  polygon: PolygonEditDrawerPolygon;
  openPolygonEdit: (params?: PolygonEditDrawerPolygon) => void;
  closePolygonEdit: () => void;
  setOpen: (open: boolean) => void;
};

const defaultContextValue: PolygonEditDrawerContextValue = {
  isOpen: false,
  polygon: {},
  openPolygonEdit: () => {},
  closePolygonEdit: () => {},
  setOpen: () => {}
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
  polygons?: SitePolygonLightDto[];
  onRefetchPolygons?: PolygonSaveCallback;
};

type PolygonEditDrawerDataSyncProps = {
  polygons?: SitePolygonLightDto[];
  onRefetchPolygons?: PolygonSaveCallback;
};

type PolygonEditDrawerDataContextValue = {
  setPolygons: (polygons: SitePolygonLightDto[]) => void;
  setOnRefetchPolygons: (onRefetch?: PolygonSaveCallback) => void;
};

const PolygonEditDrawerDataContext = createContext<PolygonEditDrawerDataContextValue | null>(null);

export const PolygonEditDrawerDataSync: FC<PolygonEditDrawerDataSyncProps> = ({
  polygons = EMPTY_POLYGONS,
  onRefetchPolygons
}) => {
  const dataContext = useContext(PolygonEditDrawerDataContext);

  useEffect(() => {
    dataContext?.setPolygons(polygons);
  }, [dataContext, polygons]);

  useEffect(() => {
    dataContext?.setOnRefetchPolygons(onRefetchPolygons);
  }, [dataContext, onRefetchPolygons]);

  return null;
};

export const PolygonEditDrawerProvider: FC<PolygonEditDrawerProviderProps> = ({
  children,
  polygons: polygonsProp = EMPTY_POLYGONS,
  onRefetchPolygons: onRefetchPolygonsProp
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [polygon, setPolygon] = useState<PolygonEditDrawerPolygon>({});
  const [polygons, setPolygons] = useState(polygonsProp);

  const onRefetchPolygonsRef = useRef<PolygonSaveCallback | undefined>(onRefetchPolygonsProp);

  useEffect(() => {
    setPolygons(polygonsProp);
  }, [polygonsProp]);

  useEffect(() => {
    onRefetchPolygonsRef.current = onRefetchPolygonsProp;
  }, [onRefetchPolygonsProp]);

  const setOnRefetchPolygons = useCallback((handler?: PolygonSaveCallback) => {
    onRefetchPolygonsRef.current = handler;
  }, []);

  const handleSaved = useCallback(() => onRefetchPolygonsRef.current?.(), []);

  const dataContextValue = useMemo(() => ({ setPolygons, setOnRefetchPolygons }), [setOnRefetchPolygons]);
  const { setEditPolygon, setIsUserDrawingEnabled, setPolygonGeometryEdit, setDraftPolygonGeometry } =
    useMapAreaContext();

  const openPolygonEdit = useCallback(
    (params?: PolygonEditDrawerPolygon) => {
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
      if (polygonUuid != null && polygonUuid !== "") {
        setEditPolygon({ isOpen: true, uuid: polygonUuid, primaryUuid: primaryUuid ?? undefined });
      }
      setIsOpen(true);
    },
    [setDraftPolygonGeometry, setEditPolygon]
  );

  const closePolygonEdit = useCallback(() => {
    setIsOpen(false);
    setPolygon({});
    dispatchClearDraftDrawEvent();
    setIsUserDrawingEnabled(false);
    setEditPolygon({ isOpen: false, uuid: "" });
    setPolygonGeometryEdit(undefined);
    setDraftPolygonGeometry(undefined);
  }, [setDraftPolygonGeometry, setEditPolygon, setIsUserDrawingEnabled, setPolygonGeometryEdit]);

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
      openPolygonEdit,
      closePolygonEdit,
      setOpen
    }),
    [closePolygonEdit, isOpen, openPolygonEdit, polygon, setOpen]
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
        {children}
        <PolygonEditDrawer
          open={isOpen}
          polygon={polygon}
          selectedPolygon={selectedPolygon}
          onOpenChange={setOpen}
          onSaved={handleSaved}
          onPolygonUpdated={setSelectedPolygon}
        />
      </PolygonEditDrawerContext.Provider>
    </PolygonEditDrawerDataContext.Provider>
  );
};
