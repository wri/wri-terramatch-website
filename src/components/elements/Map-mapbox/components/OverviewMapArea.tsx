import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import MapSidePanel from "@/components/elements/MapSidePanel/MapSidePanel";
import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchGetV2DashboardCountryCountry,
  GetV2MODELUUIDFilesResponse,
  useGetV2MODELUUIDFiles
} from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import useLoadSitePolygonsData from "@/hooks/paginated/useLoadSitePolygonData";
import { useDate } from "@/hooks/useDate";
import { useValueChanged } from "@/hooks/useValueChanged";

import MapPolygonPanel from "../../MapPolygonPanel/MapPolygonPanel";
import { callEntityBbox, parsePolygonData, storePolygon } from "../utils";

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
  const { format } = useDate();
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [entityBbox, setEntityBbox] = useState<BBox>();
  const [tabEditPolygon, setTabEditPolygon] = useState("Attributes");
  const [stateViewPanel, setStateViewPanel] = useState(false);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("created_at");
  const [polygonFromMap, setPolygonFromMap] = useState<any>({ isOpen: false, uuid: "" });
  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;
  const {
    isMonitoring,
    editPolygon,
    shouldRefetchPolygonData,
    setShouldRefetchPolygonData,
    setEditPolygon,
    setSelectedPolygonsInCheckbox,
    setPolygonCriteriaMap,
    setPolygonData,
    shouldRefetchValidation,
    setShouldRefetchValidation
  } = useMapAreaContext();
  const handleRefetchPolygon = () => {
    setShouldRefetchPolygonData(true);
  };
  const onSave = (geojson: any) =>
    storePolygon(geojson, entityModel, handleRefetchPolygon, setEditPolygon, refreshEntity);

  const mapFunctions = useMap(onSave);

  const { data: modelFilesData } = useGetV2MODELUUIDFiles<GetV2MODELUUIDFilesResponse>({
    pathParams: { model: type, uuid: entityModel?.uuid }
  });
  const {
    data: polygonsData,
    refetch,
    polygonCriteriaMap,
    loading
  } = useLoadSitePolygonsData(entityModel.uuid, type, checkedValues.join(","), sortOrder);

  useValueChanged(loading, () => {
    setPolygonCriteriaMap(polygonCriteriaMap);
    setPolygonData(polygonsData);
    if (loading) {
      return;
    }
    if (polygonsData.length > 0) {
      callEntityBbox(type, entityModel).then(bbox => {
        if (bbox) {
          setEntityBbox(bbox);
        }
      });
    } else {
      callCountryBBox();
    }
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedValues, sortOrder]);

  const callCountryBBox = async () => {
    let currentCountry = entityModel?.country;
    if (type === "sites") {
      currentCountry = entityModel?.projectCountry;
    }
    const countryBbox = await fetchGetV2DashboardCountryCountry({
      pathParams: { country: currentCountry }
    });
    if (Array.isArray(countryBbox.bbox) && countryBbox.bbox.length > 1) {
      const bboxFormat = countryBbox.bbox[1] as unknown as BBox;
      setEntityBbox(bboxFormat);
    }
  };
  useEffect(() => {
    if (entityBbox !== null) {
      setShouldRefetchPolygonData(false);
    }
  }, [entityBbox, polygonsData, setShouldRefetchPolygonData]);

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
      const dataMap = parsePolygonData(polygonsData);
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
          items={
            (polygonsData?.map(item => ({
              ...item,
              title: item.poly_name ?? t("Unnamed Polygon"),
              subtitle: t("Created {date}", { date: format(item.created_at) }),
              isValid: item.is_valid ?? "notChecked"
            })) || []) as any[]
          }
          mapFunctions={mapFunctions}
          polygonsData={polygonDataMap}
          className="absolute z-20 flex h-[500px] w-[23vw] flex-col bg-[#ffffff12] p-8 wide:h-[700px]"
          emptyText={t("No polygons are available.")}
          checkedValues={checkedValues}
          onCheckboxChange={handleCheckboxChange}
          setSortOrder={setSortOrder}
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
          items={
            (polygonsData?.map(item => ({
              ...item,
              title: item.poly_name ?? t("Unnamed Polygon"),
              subtitle: t("Created {date}", { date: format(item.created_at) }),
              isValid: item.is_valid ?? "notChecked"
            })) || []) as any[]
          }
          mapFunctions={mapFunctions}
          className="absolute z-20 flex h-[500px] w-[23vw] flex-col bg-[#ffffff12] p-8 wide:h-[700px]"
          emptyText={t("No polygons are available.")}
          checkedValues={checkedValues}
          onCheckboxChange={handleCheckboxChange}
          setSortOrder={setSortOrder}
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
        className="flex-1 rounded-r-lg"
        polygonsExists={polygonsData.length > 0}
        setPolygonFromMap={setPolygonFromMap}
        polygonFromMap={polygonFromMap}
        shouldBboxZoom={!shouldRefetchPolygonData}
        modelFilesData={modelFilesData?.data}
        pdView={true}
      />
    </>
  );
};

export default OverviewMapArea;
