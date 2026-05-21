import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import PolygonEditDrawer from "@/pages/site/[uuid]/components/PolygonEditDrawer";

import type { PolygonEditDrawerPolygon } from "./polygonEditDrawer.types";

export type { PolygonEditDrawerPolygon };

type PolygonEditDrawerContextValue = {
  isOpen: boolean;
  polygon: PolygonEditDrawerPolygon | null;
  openPolygonEdit: (params?: PolygonEditDrawerPolygon) => void;
  openPolygonDraw: () => void;
  closePolygonEdit: () => void;
  setOpen: (open: boolean) => void;
};

const defaultContextValue: PolygonEditDrawerContextValue = {
  isOpen: false,
  polygon: null,
  openPolygonEdit: () => {},
  openPolygonDraw: () => {},
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
};

export const PolygonEditDrawerProvider: FC<PolygonEditDrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [polygon, setPolygon] = useState<PolygonEditDrawerPolygon | null>(null);

  const openPolygonEdit = useCallback((params?: PolygonEditDrawerPolygon) => {
    setPolygon({
      polygonUuid: params?.polygonUuid,
      polygonName: params?.polygonName
    });
    setIsOpen(true);
  }, []);

  const openPolygonDraw = useCallback(() => {
    setIsOpen(true);
    setPolygon(null);
  }, []);

  const closePolygonEdit = useCallback(() => {
    setIsOpen(false);
    setPolygon({});
  }, []);

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

  useEffect(() => {
    openPolygonEditExternal = openPolygonDraw;
    return () => {
      openPolygonEditExternal = null;
    };
  }, [openPolygonDraw]);

  const value = useMemo(
    () => ({
      isOpen,
      polygon,
      openPolygonEdit,
      openPolygonDraw,
      closePolygonEdit,
      setOpen
    }),
    [closePolygonEdit, isOpen, openPolygonEdit, openPolygonDraw, polygon, setOpen]
  );

  return (
    <PolygonEditDrawerContext.Provider value={value}>
      {children}
      <PolygonEditDrawer open={isOpen} polygon={polygon} onOpenChange={setOpen} />
    </PolygonEditDrawerContext.Provider>
  );
};
