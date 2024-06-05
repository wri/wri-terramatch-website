import { useInfiniteQuery } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import MapSidePanel from "@/components/elements/MapSidePanel/MapSidePanel";
import { fetchGetV2ProjectsUUIDSitePolygons, fetchGetV2TypeEntity } from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";
// import { useGetImagesGeoJSON } from "@/hooks/useImageGeoJSON";
// import { useJSONParser } from "@/hooks/useJSONParser";
import { usePaginatedResult } from "@/hooks/usePaginatedResult";

interface ProjectAreaProps {
  project: any;
}

const ProjectArea = ({ project }: ProjectAreaProps) => {
  const t = useT();
  const { format } = useDate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>();
  const [polygonsData, setPolygonsData] = useState<any[]>([]);
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [projectBbox, setProjectBbox] = useState<BBox>();
  const mapFunctions = useMap();
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  console.warn(selected);

  const getPolygonsData = (uuid: string) => {
    fetchGetV2TypeEntity({
      queryParams: {
        uuid: uuid,
        type: "projects"
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
      getPolygonsData(project.uuid);
    }
  }, [project]);

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
    }
  }, [polygonsData]);

  const { data, fetchNextPage } = useInfiniteQuery<any>({
    queryKey: ["sites", query],
    queryFn: ({ pageParam }) => {
      const queryParams: any = {
        sort: "created_at",
        page: pageParam || 1,
        per_page: 5
      };
      if (query) queryParams.search = query;

      return fetchGetV2ProjectsUUIDSitePolygons({
        pathParams: { uuid: project.uuid },
        queryParams
      });
    },
    getNextPageParam: (lastPage: number) => {
      //@ts-ignore
      const meta: any = lastPage.meta;
      if (!meta) return 1;
      return meta?.last_page > meta?.current_page ? meta?.current_page + 1 : undefined;
    },
    keepPreviousData: true
  });
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter(val => val !== value));
    }
  };
  // const imagesGeoJson = useGetImagesGeoJSON("projects", project.uuid);
  // const geoJSON = useJSONParser(selected?.geojson || project.boundary_geojson);
  const sites = usePaginatedResult<any>(data);
  console.log(sites);
  return (
    <div className="flex h-[500px] rounded-lg  text-darkCustom">
      <MapSidePanel
        title={t("Polygons")}
        items={
          (polygonsData?.map(item => ({
            ...item,
            title: item.poly_name || "Unnamed Polygon",
            subtitle: t("Created {date}", { date: format(item.created_at) })
          })) || []) as any[]
        }
        mapFunctions={mapFunctions}
        onSelectItem={setSelected}
        onSearch={setQuery}
        className="absolute z-20 h-[500px] w-[23vw] bg-[#ffffff12] p-8"
        onLoadMore={fetchNextPage}
        emptyText={t("No polygons are available.")}
        checkedValues={checkedValues}
        onCheckboxChange={handleCheckboxChange}
      />
      {projectBbox && projectBbox.length > 0 && (
        <MapContainer
          mapFunctions={mapFunctions}
          polygonsData={polygonDataMap}
          bbox={projectBbox}
          tooltipType="goTo"
          showPopups
          className="flex-1 rounded-r-lg"
        />
      )}
    </div>
  );
};

export default ProjectArea;
