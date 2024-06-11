import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import MapSidePanel from "@/components/elements/MapSidePanel/MapSidePanel";
import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { fetchGetV2TypeEntity } from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";

interface ProjectAreaProps {
  project: any;
}

const ProjectArea = ({ project }: ProjectAreaProps) => {
  const t = useT();
  const { format } = useDate();
  const [setSelected] = useState<any>();
  const [polygonsData, setPolygonsData] = useState<any[]>([]);
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [projectBbox, setProjectBbox] = useState<BBox>();
  const mapFunctions = useMap();
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("created_at");

  const getPolygonsData = (uuid: string, statusFilter: string, sortOrder: string) => {
    fetchGetV2TypeEntity({
      queryParams: {
        uuid: uuid,
        type: "projects",
        status: statusFilter,
        [`sort[${sortOrder}]`]: sortOrder === "created_at" ? "desc" : "asc"
      }
    }).then(result => {
      if (result.polygonsData) {
        setPolygonsData(result.polygonsData);
        setProjectBbox(result.bbox as BBox);
      }
    });
  };

  useEffect(() => {
    if (project?.uuid) {
      const statusFilter = checkedValues.join(",");
      getPolygonsData(project.uuid, statusFilter, sortOrder);
    }
  }, [project, checkedValues, sortOrder]);

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
    <div className="flex h-[500px] rounded-lg  text-darkCustom">
      <MapSidePanel
        title={t("Polygons")}
        items={
          (polygonsData?.map(item => ({
            ...item,
            title: item.poly_name ?? "Unnamed Polygon",
            subtitle: t("Created {date}", { date: format(item.created_at) })
          })) || []) as any[]
        }
        mapFunctions={mapFunctions}
        onSelectItem={setSelected}
        className="absolute z-20 h-[500px] w-[23vw] bg-[#ffffff12] p-8"
        emptyText={t("No polygons are available.")}
        checkedValues={checkedValues}
        onCheckboxChange={handleCheckboxChange}
        setSortOrder={setSortOrder}
      />
      <MapContainer
        mapFunctions={mapFunctions}
        polygonsData={polygonDataMap}
        bbox={projectBbox}
        tooltipType="goTo"
        showPopups
        showLegend
        siteData={true}
        className="flex-1 rounded-r-lg"
      />
    </div>
  );
};

export default ProjectArea;
