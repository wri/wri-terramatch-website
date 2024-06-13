import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { getPolygonsData } from "@/components/elements/Map-mapbox/utils";
import MapSidePanel from "@/components/elements/MapSidePanel/MapSidePanel";
import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { fetchGetV2DashboardCountryCountry } from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";

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
  const setResultValues = (result: any) => {
    if (result.polygonsData) {
      setPolygonsData(result.polygonsData);
      setEntityBbox(result.bbox as BBox);
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
    if (entityModel?.uuid) {
      const statusFilter = checkedValues.join(",");
      getPolygonsData(entityModel.uuid, statusFilter, sortOrder, type, setResultValues);
    }
  }, [entityModel, checkedValues, sortOrder]);

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
      callCountryBBox();
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
        className="absolute z-20 h-[500px] w-[23vw] bg-[#ffffff12] p-8"
        emptyText={t("No polygons are available.")}
        checkedValues={checkedValues}
        onCheckboxChange={handleCheckboxChange}
        setSortOrder={setSortOrder}
        type={type}
      />
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
