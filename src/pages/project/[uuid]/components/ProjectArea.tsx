import { useInfiniteQuery } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useState } from "react";

// import Map from "@/components/elements/Map-mapbox/Map";
import MapSidePanel from "@/components/elements/MapSidePanel/MapSidePanel";
import { fetchGetV2ProjectsUUIDSitePolygons } from "@/generated/apiComponents";
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

  console.warn(selected);

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

  // const imagesGeoJson = useGetImagesGeoJSON("projects", project.uuid);
  // const geoJSON = useJSONParser(selected?.geojson || project.boundary_geojson);
  const sites = usePaginatedResult<any>(data);

  return (
    <div className="flex h-[500px] rounded-lg  text-darkCustom">
      <MapSidePanel
        title={t("Sites")}
        items={
          (sites?.map(item => ({
            ...item,
            title: item.name,
            subtitle: t("Created {date}", { date: format(item.created_at) })
          })) || []) as any[]
        }
        onSelectItem={setSelected}
        onSearch={setQuery}
        className="absolute z-20 h-[500px] w-[23vw] p-8"
        onLoadMore={fetchNextPage}
        emptyText={t("No polygons are available.")}
      />
      {/* <Map geojson={geoJSON} siteData={true} imageLayerGeojson={imagesGeoJson} className="flex-1 rounded-r-lg" /> */}
    </div>
  );
};

export default ProjectArea;
