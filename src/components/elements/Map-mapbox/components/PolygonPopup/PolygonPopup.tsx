import { useMemo } from "react";

import TooltipMap from "@/components/elements/TooltipMap/TooltipMap";
import { useSitePolygons } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import type { PopupComponentProps } from "../../Map.d";
import {
  type SitePolygonPopupFields,
  findMapIndexEntryByMapFeatureUuid,
  findSitePolygonByMapFeatureUuid
} from "../../sitePolygonPopupUtils";
import { PolygonPopupChampions } from "./PolygonPopupChampions";

export function PolygonPopup(event: PopupComponentProps) {
  const {
    feature,
    popup,
    setPolygonFromMap,
    setShouldRefetchPolygonData,
    type,
    setEditPolygon,
    championsMap,
    sitePolygonData,
    polygonEntityScope,
    mapIndexPolygons,
    overviewPolygonPopup
  } = event;
  const polygonUuid = (feature.properties?.uuid ?? "") as string;
  const useMapIndexPopup = overviewPolygonPopup !== true;

  const shouldLoadByUuid =
    !useMapIndexPopup && polygonEntityScope != null && polygonEntityScope.entityUuid !== "" && polygonUuid !== "";

  const [polygonByUuidLoaded, { data: loadedPolygons }] = useSitePolygons({
    entityName: polygonEntityScope?.entityName,
    entityUuid: polygonEntityScope?.entityUuid ?? "",
    enabled: shouldLoadByUuid,
    filter: { "polygonUuid[]": [polygonUuid] },
    pageNumber: 1,
    pageSize: 1
  });

  const loadedSitePolygon = useMemo<SitePolygonLightDto | undefined>(() => {
    if (!shouldLoadByUuid || !polygonByUuidLoaded) {
      return undefined;
    }
    return (loadedPolygons ?? []).find(polygon => polygon.polygonUuid === polygonUuid || polygon.uuid === polygonUuid);
  }, [shouldLoadByUuid, polygonByUuidLoaded, loadedPolygons, polygonUuid]);

  const cachedSitePolygon = useMemo(
    () => findSitePolygonByMapFeatureUuid(sitePolygonData, polygonUuid),
    [sitePolygonData, polygonUuid]
  );

  const mapIndexEntry = useMemo(
    () => (useMapIndexPopup ? findMapIndexEntryByMapFeatureUuid(mapIndexPolygons, polygonUuid) : undefined),
    [useMapIndexPopup, mapIndexPolygons, polygonUuid]
  );

  const isPolygonDataLoading = useMapIndexPopup
    ? mapIndexEntry == null && (mapIndexPolygons == null || mapIndexPolygons.length === 0)
    : shouldLoadByUuid && !polygonByUuidLoaded && cachedSitePolygon == null;

  const resolvedSitePolygon: SitePolygonPopupFields | undefined = useMapIndexPopup
    ? mapIndexEntry
    : shouldLoadByUuid
    ? loadedSitePolygon ?? (polygonByUuidLoaded ? undefined : cachedSitePolygon)
    : cachedSitePolygon;

  const resolvedSitePolygonData = useMemo(() => {
    if (useMapIndexPopup || resolvedSitePolygon == null) {
      return sitePolygonData;
    }
    return [resolvedSitePolygon as SitePolygonLightDto];
  }, [useMapIndexPopup, resolvedSitePolygon, sitePolygonData]);

  if (championsMap) {
    return (
      <PolygonPopupChampions
        popup={popup}
        setShouldRefetchPolygonData={setShouldRefetchPolygonData}
        sitePolygon={resolvedSitePolygon}
        isLoading={isPolygonDataLoading}
        tooltipType={type}
        overviewPolygonPopup={overviewPolygonPopup}
      />
    );
  }

  return (
    <TooltipMap
      polygonUuid={polygonUuid}
      sitePolygonData={resolvedSitePolygonData}
      type={type}
      setTooltipOpen={() => {
        if (popup) {
          popup.remove();
          setPolygonFromMap?.({ isOpen: false, uuid: "" });
          setEditPolygon?.({ isOpen: false, uuid: "" });
        }
      }}
      setEditPolygon={(primaryUuid?: string) => {
        setPolygonFromMap?.({ isOpen: true, uuid: polygonUuid });
        setEditPolygon?.({
          isOpen: true,
          uuid: polygonUuid,
          primaryUuid
        });
        if (popup) {
          popup.remove();
        }
      }}
    />
  );
}
