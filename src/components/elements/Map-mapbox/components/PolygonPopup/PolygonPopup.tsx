import { useMemo } from "react";

import TooltipMap from "@/components/elements/TooltipMap/TooltipMap";

import type { PopupComponentProps } from "../../Map.d";
import { findSitePolygonByMapFeatureUuid } from "../../sitePolygonMapLookup";
import { PolygonPopupChampions } from "./PolygonPopupChampions";

export function PolygonPopup(event: PopupComponentProps) {
  const { feature, popup, setPolygonFromMap, type, setEditPolygon, championsMap, sitePolygonData } = event;
  const polygonUuid = (feature.properties?.uuid ?? "") as string;

  const selectedSitePolygon = useMemo(
    () => findSitePolygonByMapFeatureUuid(sitePolygonData, polygonUuid),
    [polygonUuid, sitePolygonData]
  );

  if (championsMap) {
    return <PolygonPopupChampions popup={popup} polygonUuid={polygonUuid} sitePolygon={selectedSitePolygon} />;
  }

  return (
    <TooltipMap
      polygonUuid={polygonUuid}
      sitePolygonData={sitePolygonData}
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
