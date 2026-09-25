import type { PopupComponentProps } from "../../Map.d";
import { findMapIndexEntryByMapFeatureUuid } from "../../sitePolygonPopupUtils";
import { PolygonPopupChampions } from "./PolygonPopupChampions";

export function PolygonPopup(event: PopupComponentProps) {
  const { feature, popup, setShouldRefetchPolygonData, type, mapIndexPolygons, overviewPolygonPopup } = event;
  const polygonUuid = (feature.properties?.uuid ?? "") as string;
  const mapIndexEntry = findMapIndexEntryByMapFeatureUuid(mapIndexPolygons, polygonUuid);
  const isPolygonDataLoading = mapIndexEntry == null && (mapIndexPolygons == null || mapIndexPolygons.length === 0);

  return (
    <PolygonPopupChampions
      popup={popup}
      setShouldRefetchPolygonData={setShouldRefetchPolygonData}
      sitePolygon={mapIndexEntry}
      isLoading={isPolygonDataLoading}
      tooltipType={type}
      overviewPolygonPopup={overviewPolygonPopup}
    />
  );
}
