import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import MapSidePanel from "@/components/elements/MapSidePanel/MapSidePanel";
import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { useMonitoringPartner } from "@/context/monitoringPartner.provider";
import { fetchGetV2DashboardCountryCountry, useGetV2TypeEntity } from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";

import MapPolygonPanel from "../../MapPolygonPanel/MapPolygonPanel";

interface EntityAreaProps {
  entityModel: any;
  type: string;
}

const OverviewMapArea = ({ entityModel, type }: EntityAreaProps) => {
  const t = useT();
  const { format } = useDate();
  const [polygonsData, setPolygonsData] = useState<any[]>([]);
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [entityBbox, setEntityBbox] = useState<BBox>();
  const mapFunctions = useMap();
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("created_at");
  const { isMonitoring } = useMonitoringPartner();
  const { data: entityData, refetch } = useGetV2TypeEntity({
    queryParams: {
      uuid: entityModel?.uuid,
      type: type,
      status: checkedValues.join(","),
      [`sort[${sortOrder}]`]: sortOrder === "created_at" ? "desc" : "asc"
    }
  });
  const setResultValues = (result: any) => {
    if (result?.polygonsData) {
      setPolygonsData(result.polygonsData);
      setEntityBbox(result.bbox as BBox);
      if (result.polygonsData?.length === 0) {
        callCountryBBox();
      }
    }
  };
  const callCountryBBox = async () => {
    let currentCountry = entityModel?.country;
    if (type === "sites") {
      currentCountry = entityModel?.project?.country;
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
    setResultValues(entityData);
  }, [entityData]);

  useEffect(() => {
    if (polygonsData?.length > 0) {
      const dataMap = ((polygonsData ?? []) as SitePolygonsDataResponse).reduce((acc: any, data: any) => {
        if (!acc[data.status]) {
          acc[data.status] = [];
        }
        acc[data.status].push(data.poly_id);
        return acc;
      }, {});
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
          title={t(type === "sites" ? "Site Polygons" : "Polygons")}
          items={
            (polygonsData?.map(item => ({
              ...item,
              title: item.poly_name ?? t("Unnamed Polygon"),
              subtitle: t("Created {date}", { date: format(item.created_at) })
            })) || []) as any[]
          }
          mapFunctions={mapFunctions}
          className="absolute z-20 flex h-[500px] w-[23vw] flex-col bg-[#ffffff12] p-8 wide:h-[700px]"
          emptyText={t("No polygons are available.")}
          checkedValues={checkedValues}
          onCheckboxChange={handleCheckboxChange}
          setSortOrder={setSortOrder}
          type={type}
          onSelectItem={() => {}}
          onLoadMore={() => {}}
          setEditPolygon={() => {}}
          editPolygon={false}
          tabEditPolygon=""
          setTabEditPolygon={() => {}}
          setPreviewVersion={() => {}}
          recallEntityData={refetch}
        />
      ) : (
        <MapSidePanel
          title={t(type === "sites" ? "Site Polygons" : "Polygons")}
          items={
            (polygonsData?.map(item => ({
              ...item,
              title: item.poly_name ?? t("Unnamed Polygon"),
              subtitle: t("Created {date}", { date: format(item.created_at) })
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
        />
      )}
      <MapContainer
        mapFunctions={mapFunctions}
        polygonsData={polygonDataMap}
        bbox={entityBbox}
        tooltipType={type === "sites" ? "view" : "goTo"}
        showPopups
        showLegend
        siteData={true}
        className="flex-1 rounded-r-lg"
        polygonsExists={polygonsData.length > 0}
      />
    </>
  );
};

export default OverviewMapArea;
