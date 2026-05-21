import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import PolygonEditDrawer from "@/pages/site/[uuid]/components/PolygonEditDrawer";

import type { PolygonEditDrawerPolygon } from "./polygonEditDrawer.types";

export type { PolygonEditDrawerPolygon };

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

type RefetchPolygonsHandler = () => unknown | Promise<unknown>;

type PolygonEditDrawerProviderProps = {
  children: ReactNode;
  polygons?: SitePolygonLightDto[];
  onRefetchPolygons?: RefetchPolygonsHandler;
};

type PolygonEditDrawerDataSyncProps = {
  polygons?: SitePolygonLightDto[];
  onRefetchPolygons?: RefetchPolygonsHandler;
};

type PolygonEditDrawerDataContextValue = {
  setPolygons: (polygons: SitePolygonLightDto[]) => void;
  setOnRefetchPolygons: (onRefetch?: RefetchPolygonsHandler) => void;
};

const PolygonEditDrawerDataContext = createContext<PolygonEditDrawerDataContextValue | null>(null);

export const PolygonEditDrawerDataSync: FC<PolygonEditDrawerDataSyncProps> = ({ polygons = [], onRefetchPolygons }) => {
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
  polygons: polygonsProp = [],
  onRefetchPolygons: onRefetchPolygonsProp
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [polygon, setPolygon] = useState<PolygonEditDrawerPolygon>({});
  const [polygons, setPolygons] = useState(polygonsProp);
  const [onRefetchPolygons, setOnRefetchPolygons] = useState<RefetchPolygonsHandler | undefined>(onRefetchPolygonsProp);

  useEffect(() => {
    setPolygons(polygonsProp);
  }, [polygonsProp]);

  useEffect(() => {
    setOnRefetchPolygons(onRefetchPolygonsProp);
  }, [onRefetchPolygonsProp]);

  const dataContextValue = useMemo(
    () => ({
      setPolygons,
      setOnRefetchPolygons
    }),
    []
  );
  const { setEditPolygon, setIsUserDrawingEnabled, setPolygonGeometryEdit } = useMapAreaContext();

  const openPolygonEdit = useCallback(
    (params?: PolygonEditDrawerPolygon) => {
      const polygonUuid = params?.polygonUuid ?? params?.sitePolygon?.polygonUuid ?? undefined;
      const primaryUuid = params?.sitePolygon?.primaryUuid;
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
    [setEditPolygon]
  );

  const closePolygonEdit = useCallback(() => {
    setIsOpen(false);
    setPolygon({});
    setIsUserDrawingEnabled(false);
    setEditPolygon({ isOpen: false, uuid: "" });
    setPolygonGeometryEdit(undefined);
  }, [setEditPolygon, setIsUserDrawingEnabled, setPolygonGeometryEdit]);

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
          onSaved={onRefetchPolygons}
          onPolygonUpdated={setSelectedPolygon}
        />
      </PolygonEditDrawerContext.Provider>
    </PolygonEditDrawerDataContext.Provider>
  );
};
