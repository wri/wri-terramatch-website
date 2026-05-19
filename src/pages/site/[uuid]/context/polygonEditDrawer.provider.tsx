import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import PolygonEditDrawer from "../components/PolygonEditDrawer";
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

type PolygonEditDrawerProviderProps = {
  children: ReactNode;
};

export const PolygonEditDrawerProvider: FC<PolygonEditDrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [polygon, setPolygon] = useState<PolygonEditDrawerPolygon>({});

  const openPolygonEdit = useCallback((params?: PolygonEditDrawerPolygon) => {
    setPolygon({
      polygonUuid: params?.polygonUuid,
      polygonName: params?.polygonName
    });
    setIsOpen(true);
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

  return (
    <PolygonEditDrawerContext.Provider value={value}>
      {children}
      <PolygonEditDrawer open={isOpen} polygon={polygon} onOpenChange={setOpen} />
    </PolygonEditDrawerContext.Provider>
  );
};
