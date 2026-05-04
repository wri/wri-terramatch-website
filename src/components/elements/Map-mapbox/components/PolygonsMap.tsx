import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import useLoadSitePolygonsData from "@/hooks/paginated/useLoadSitePolygonData";
import { useValueChanged } from "@/hooks/useValueChanged";

import { parsePolygonDataV3, storePolygon } from "../utils";

interface PolygonsMapProps {
  entityModel: any;
  type: string;
  className?: string;
  disabledPolygonPanel?: boolean;
}

const PolygonsMap = ({ entityModel, type, className, disabledPolygonPanel = true }: PolygonsMapProps) => {
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [polygonFromMap, setPolygonFromMap] = useState<any>({ isOpen: false, uuid: "" });

  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;

  const {
    editPolygon,
    shouldRefetchPolygonData,
    setEditPolygon,
    setSelectedPolygonsInCheckbox,
    setPolygonCriteriaMap,
    setPolygonData,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    setShouldRefetchPolygonData,
    polygonData: sitePolygonDataV3,
    validFilter
  } = useMapAreaContext();

  const onSave = (geojson: any) => storePolygon(geojson, entityModel, setEditPolygon, refetch);

  const mapFunctions = useBaseMap(onSave);

  const [, { data: mediaFiles }] = useMedias({
    entity: type as SupportedEntity,
    uuid: entityModel?.uuid
  });

  const {
    data: polygonsData,
    refetch,
    polygonCriteriaMap,
    loading
  } = useLoadSitePolygonsData(entityModel?.uuid, type, "", "createdAt", "ASC", validFilter);

  const modelBbox = useBoundingBox(
    type === "sites" ? { siteUuid: entityModel?.uuid } : { projectUuid: entityModel?.uuid }
  );

  const countryBbox = useBoundingBox(
    type === "sites" ? { country: entityModel?.projectCountry } : { country: entityModel?.country }
  );

  const extentBbox = useMemo((): BBox | undefined => {
    if (polygonsData.length > 0) {
      return modelBbox as BBox | undefined;
    }
    return countryBbox as BBox | undefined;
  }, [polygonsData.length, modelBbox, countryBbox]);

  useValueChanged(loading, () => {
    setPolygonCriteriaMap(polygonCriteriaMap);
    setPolygonData(polygonsData);
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validFilter]);

  useEffect(() => {
    if (disabledPolygonPanel) {
      setPolygonFromMap({ isOpen: false, uuid: "" });
      return;
    }
    const { isOpen, uuid } = editPolygon;
    setPolygonFromMap({ isOpen, uuid });
    if (isOpen) {
      setSelectedPolygonsInCheckbox([]);
    }
  }, [editPolygon, disabledPolygonPanel, setSelectedPolygonsInCheckbox]);

  useValueChanged(shouldRefetchPolygonData, async () => {
    if (shouldRefetchPolygonData) {
      await Promise.all([refetch(), reloadSiteData?.()]);
      setShouldRefetchPolygonData(false);
    }
  });

  useValueChanged(shouldRefetchValidation, () => {
    if (shouldRefetchValidation) {
      refetch();
      setShouldRefetchValidation(false);
    }
  });

  useEffect(() => {
    if (polygonsData?.length > 0) {
      const dataMap = parsePolygonDataV3(polygonsData);
      setPolygonDataMap(dataMap);
    } else {
      setPolygonDataMap({
        [SUBMITTED]: [],
        [APPROVED]: [],
        [NEEDS_MORE_INFORMATION]: [],
        [DRAFT]: []
      });
    }
  }, [polygonsData]);

  const stateViewPanel = false;

  return (
    <AnrMapOverlayProvider>
      <MapContainer
        newStyling={true}
        mapFunctions={mapFunctions}
        polygonsData={polygonDataMap}
        bbox={extentBbox}
        tooltipType={type === "sites" ? "edit" : "goTo"}
        showPopups
        showLegend
        siteData={true}
        status={type === "sites" && !disabledPolygonPanel && (stateViewPanel || editPolygon.isOpen)}
        validationType={
          type === "sites" && !disabledPolygonPanel
            ? editPolygon.isOpen
              ? "individualValidation"
              : "bulkValidation"
            : ""
        }
        record={entityModel}
        className={classNames("h-full w-full flex-1", className)}
        polygonsExists={polygonsData.length > 0}
        setPolygonFromMap={setPolygonFromMap}
        polygonFromMap={polygonFromMap}
        shouldBboxZoom={!shouldRefetchPolygonData}
        mediaFiles={mediaFiles}
        sitePolygonData={sitePolygonDataV3 as SitePolygonLightDto[]}
        disabledPolygonPanel={disabledPolygonPanel}
      />
    </AnrMapOverlayProvider>
  );
};

export default PolygonsMap;
