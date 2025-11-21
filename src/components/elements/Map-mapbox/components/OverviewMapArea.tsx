import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import MapSidePanel from "@/components/elements/MapSidePanel/MapSidePanel";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import useLoadSitePolygonsData from "@/hooks/paginated/useLoadSitePolygonData";
import { useValueChanged } from "@/hooks/useValueChanged";

import MapPolygonPanel from "../../MapPolygonPanel/MapPolygonPanel";
import { parsePolygonDataV3, storePolygon } from "../utils";

interface EntityAreaProps {
  entityModel: any;
  type: string;
  refetch?: () => void;
  polygonVersionData?: SitePolygonsDataResponse;
  refetchPolygonVersions?: () => void;
}

const OverviewMapArea = ({
  entityModel,
  type,
  refetch: refreshEntity,
  polygonVersionData,
  refetchPolygonVersions
}: EntityAreaProps) => {
  const t = useT();
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [entityBbox, setEntityBbox] = useState<BBox>();
  const [tabEditPolygon, setTabEditPolygon] = useState("Attributes");
  const [stateViewPanel, setStateViewPanel] = useState(false);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [polygonFromMap, setPolygonFromMap] = useState<any>({ isOpen: false, uuid: "" });
  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;
  const {
    isMonitoring,
    editPolygon,
    shouldRefetchPolygonData,
    setEditPolygon,
    setSelectedPolygonsInCheckbox,
    setPolygonCriteriaMap,
    setPolygonData,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    validFilter
  } = useMapAreaContext();
  const onSave = (geojson: any) => storePolygon(geojson, entityModel, setEditPolygon, refetch);

  const mapFunctions = useMap(onSave);

  const [, { data: modelFilesData }] = useMedias({
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

  useValueChanged(loading, () => {
    setPolygonCriteriaMap(polygonCriteriaMap);
    setPolygonData(polygonsData);
    if (loading) {
      return;
    }
    if (polygonsData.length > 0) {
      if (modelBbox) {
        setEntityBbox(modelBbox as BBox);
      }
    } else if (countryBbox) {
      setEntityBbox(countryBbox as BBox);
    }
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedValues, sortField, sortDirection, validFilter]);

  useEffect(() => {
    const { isOpen, uuid } = editPolygon;
    setPolygonFromMap({ isOpen, uuid });
    if (isOpen) {
      setSelectedPolygonsInCheckbox([]);
    }
  }, [editPolygon, setSelectedPolygonsInCheckbox]);

  useValueChanged(shouldRefetchPolygonData, () => {
    if (shouldRefetchPolygonData) {
      reloadSiteData?.();
      refetch();
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

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter(val => val !== value));
    }
  };

  return (
    <>
      {isMonitoring ? (
        <MapPolygonPanel
          title={type === "sites" ? t("Site Polygons") : t("Polygons")}
          items={(polygonsData ?? []) as SitePolygonLightDto[]}
          mapFunctions={mapFunctions}
          polygonsData={polygonDataMap}
          className="absolute z-20 flex h-full w-[23vw] flex-col rounded-l bg-[#ffffff12] p-8"
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
          polygonVersionData={polygonVersionData as SitePolygonsDataResponse}
          refetchPolygonVersions={refetchPolygonVersions}
          refreshEntity={refreshEntity}
          entityUuid={entityModel?.uuid}
        />
      ) : (
        <MapSidePanel
          title={type === "sites" ? t("Site Polygons") : t("Polygons")}
          items={(polygonsData ?? []) as SitePolygonLightDto[]}
          mapFunctions={mapFunctions}
          className="absolute z-20 flex h-full w-[23vw] flex-col rounded-l bg-[#ffffff12] p-8"
          emptyText={t("No polygons are available.")}
          checkedValues={checkedValues}
          onCheckboxChange={handleCheckboxChange}
          setSortOrder={setSortField}
          sortField={sortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          type={type}
          recallEntityData={refetch}
          entityUuid={entityModel?.uuid}
        />
      )}
      <MapContainer
        mapFunctions={mapFunctions}
        polygonsData={polygonDataMap}
        bbox={entityBbox}
        tooltipType={type === "sites" ? "edit" : "goTo"}
        showPopups
        showLegend
        siteData={true}
        status={type === "sites" && (stateViewPanel || editPolygon.isOpen)}
        validationType={type === "sites" ? (editPolygon.isOpen ? "individualValidation" : "bulkValidation") : ""}
        record={entityModel}
        className="h-[650px] flex-1 rounded-r-lg wide:h-[1225px]"
        polygonsExists={polygonsData.length > 0}
        setPolygonFromMap={setPolygonFromMap}
        polygonFromMap={polygonFromMap}
        shouldBboxZoom={!shouldRefetchPolygonData}
        modelFilesData={modelFilesData}
        pdView={true}
      />
    </>
  );
};

export default OverviewMapArea;
