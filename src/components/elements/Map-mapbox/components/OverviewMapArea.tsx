import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { useBoundingBox } from "@/connections/BoundingBox";
import { useDelayedJobs } from "@/connections/DelayedJob";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import useLoadSitePolygonsData from "@/hooks/paginated/useLoadSitePolygonData";
import { useValueChanged } from "@/hooks/useValueChanged";

import MapPolygonPanel from "../../MapPolygonPanel/MapPolygonPanel";
import { parsePolygonDataV3, storePolygon } from "../utils";

interface EntityAreaProps {
  entityModel: any;
  type: string;
  refetch?: () => void;
  polygonVersionData?: SitePolygonLightDto[];
  refetchPolygonVersions?: () => void;
  className?: string;
  disabledPolygonPanel?: boolean;
}

const OverviewMapArea = ({
  entityModel,
  type,
  refetch: refreshEntity,
  polygonVersionData,
  refetchPolygonVersions,
  className,
  disabledPolygonPanel
}: EntityAreaProps) => {
  const t = useT();
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [tabEditPolygon, setTabEditPolygon] = useState("Attributes");
  const [stateViewPanel, setStateViewPanel] = useState(false);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [polygonFromMap, setPolygonFromMap] = useState<any>({ isOpen: false, uuid: "" });
  const [processedPolyValidationJobs, setProcessedPolyValidationJobs] = useState<Set<string>>(new Set());
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

  const [, { delayedJobs }] = useDelayedJobs();
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
  } = useLoadSitePolygonsData(entityModel.uuid, type, checkedValues.join(","), sortField, sortDirection, validFilter);

  const modelBbox = useBoundingBox(
    type === "sites" ? { siteUuid: entityModel.uuid } : { projectUuid: entityModel.uuid }
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
  }, [checkedValues, sortField, sortDirection, validFilter]);

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
    if (delayedJobs == null || delayedJobs.length === 0) return;

    const newlyCompleted = delayedJobs.filter(
      job => job.name === "Polygon Validation" && job.status !== "pending" && !processedPolyValidationJobs.has(job.uuid)
    );

    if (newlyCompleted.length > 0) {
      setProcessedPolyValidationJobs(prev => {
        const next = new Set(prev);
        newlyCompleted.forEach(j => next.add(j.uuid));
        return next;
      });
      refetch();
    }
  }, [delayedJobs, processedPolyValidationJobs, refetch]);
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

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter(val => val !== value));
    }
  };

  return (
    <AnrMapOverlayProvider>
      {!disabledPolygonPanel && (
        <MapPolygonPanel
          title={type === "sites" ? t("Site Polygons") : t("Polygons")}
          items={(polygonsData ?? []) as SitePolygonLightDto[]}
          mapFunctions={mapFunctions}
          polygonsData={polygonDataMap}
          className="absolute z-[19] flex h-full w-[29vw] flex-col rounded-l bg-[#ffffff12] p-6"
          emptyText={t("No polygons are available.")}
          checkedValues={checkedValues}
          onCheckboxChange={handleCheckboxChange}
          setSortOrder={setSortField}
          sortField={sortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          type={type}
          onSelectItem={() => {}}
          onLoadMore={() => {}}
          stateViewPanel={stateViewPanel}
          setStateViewPanel={setStateViewPanel}
          tabEditPolygon={tabEditPolygon}
          setTabEditPolygon={setTabEditPolygon}
          recallEntityData={refetch}
          polygonVersionData={polygonVersionData}
          refetchPolygonVersions={refetchPolygonVersions}
          refreshEntity={refreshEntity}
          entityUuid={entityModel?.uuid}
        />
      )}
      <MapContainer
        mapFunctions={mapFunctions}
        polygonsData={polygonDataMap}
        bbox={extentBbox}
        tooltipType={disabledPolygonPanel ? "view" : type === "sites" ? "edit" : "goTo"}
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
        className={classNames("h-[650px] flex-1 rounded-r-lg wide:h-[1225px]", className)}
        polygonsExists={polygonsData.length > 0}
        setPolygonFromMap={setPolygonFromMap}
        polygonFromMap={polygonFromMap}
        shouldBboxZoom={!shouldRefetchPolygonData}
        mediaFiles={mediaFiles}
        sitePolygonData={sitePolygonDataV3}
        disabledPolygonPanel={disabledPolygonPanel}
      />
    </AnrMapOverlayProvider>
  );
};

export default OverviewMapArea;
