import { useMemo } from "react";

import TooltipMap from "@/components/elements/TooltipMap/TooltipMap";
import { useSitePolygonByUuid } from "@/connections/SitePolygons";

import type { PopupComponentProps } from "../../Map.d";
import { findSitePolygonByMapFeatureUuid } from "../../sitePolygonPopupUtils";
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
    overviewPolygonPopup
  } = event;
  const polygonUuid = (feature.properties?.uuid ?? "") as string;

  // Fast path: reuse data we already have client-side (e.g. a fully-loaded champions polygon list).
  // Fall back to a fresh backend fetch by UUID when the clicked polygon isn't in that local set,
  // since the polygon table is paginated and no longer guarantees the full list is available here.
  const localSitePolygon = useMemo(
    () => findSitePolygonByMapFeatureUuid(sitePolygonData, polygonUuid),
    [polygonUuid, sitePolygonData]
  );
  const [, { data: fetchedSitePolygon }] = useSitePolygonByUuid(localSitePolygon == null ? polygonUuid : undefined);
  const selectedSitePolygon = localSitePolygon ?? fetchedSitePolygon;

  if (championsMap) {
    return (
      <PolygonPopupChampions
        popup={popup}
        setShouldRefetchPolygonData={setShouldRefetchPolygonData}
        sitePolygon={selectedSitePolygon}
        tooltipType={type}
        overviewPolygonPopup={overviewPolygonPopup}
      />
    );
  }

  return (
    <TooltipMap
      sitePolygon={selectedSitePolygon}
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
