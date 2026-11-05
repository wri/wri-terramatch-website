import { useEffect, useState } from "react";

import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import type { PolygonFromMapState } from "@/components/elements/Map-mapbox/Map.d";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useValueChanged } from "@/hooks/useValueChanged";

export const usePolygonMapEditing = (onRefetchPolygons: () => void | Promise<void>) => {
  const mapFunctions = useBaseMap(undefined, undefined, { deferDrawCreateSave: true });
  const [polygonFromMap, setPolygonFromMap] = useState<PolygonFromMapState>({ isOpen: false, uuid: "" });
  const reloadSiteData = useSitePolygonData()?.reloadSiteData;
  const {
    editPolygon,
    polygonData,
    setSelectedPolygonsInCheckbox,
    shouldRefetchPolygonData,
    setShouldRefetchPolygonData,
    shouldRefetchValidation,
    setShouldRefetchValidation
  } = useMapAreaContext();

  useEffect(() => {
    const { isOpen, uuid, status } = editPolygon;
    setPolygonFromMap({ isOpen, uuid, status });
    if (isOpen) {
      setSelectedPolygonsInCheckbox([]);
    }
  }, [editPolygon, setSelectedPolygonsInCheckbox]);

  useValueChanged(shouldRefetchPolygonData, async () => {
    if (shouldRefetchPolygonData) {
      await Promise.all([onRefetchPolygons(), reloadSiteData?.()]);
      setShouldRefetchPolygonData(false);
    }
  });

  useValueChanged(shouldRefetchValidation, () => {
    if (shouldRefetchValidation) {
      void onRefetchPolygons();
      setShouldRefetchValidation(false);
    }
  });

  return {
    mapFunctions,
    polygonFromMap,
    setPolygonFromMap,
    sitePolygonData: polygonData,
    autoEditPolygon: editPolygon.isOpen,
    isRefetchingPolygonData: shouldRefetchPolygonData
  };
};
