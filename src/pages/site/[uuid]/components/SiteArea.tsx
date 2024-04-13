import { useInfiniteQuery } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Map from "@/components/elements/Map-mapbox/Map";
import MapPolygonPanel from "@/components/elements/MapPolygonPanel/MapPolygonPanel";
import Text from "@/components/elements/Text/Text";
import { fetchGetV2ProjectsUUIDSitePolygons } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import { useGetImagesGeoJSON } from "@/hooks/useImageGeoJSON";
import { useJSONParser } from "@/hooks/useJSONParser";
import { usePaginatedResult } from "@/hooks/usePaginatedResult";

interface SiteAreaProps {
  sites: any;
}

const SiteArea = ({ sites }: SiteAreaProps) => {
  const t = useT();
  const { format } = useDate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>();
  const [stateViewPanel, setStateViewPanel] = useState(false);
  const [editPolygon, setEditPolygon] = useState(false);

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
        pathParams: { uuid: sites.uuid },
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

  const imagesGeoJson = useGetImagesGeoJSON("projects", sites.uuid);
  const geoJSON = useJSONParser(selected?.geojson || sites.boundary_geojson);
  const Polygon = usePaginatedResult<any>(data);

  return (
    <div className="relative flex h-[500px] text-darkCustom">
      <MapPolygonPanel
        title={t("Sites")}
        items={
          (Polygon?.map(item => ({
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
        setStateViewPanel={setStateViewPanel}
        stateViewPanel={stateViewPanel}
        setEditPolygon={setEditPolygon}
      />
      <When condition={!stateViewPanel}>
        <div className="absolute left-[24vw] top-6 z-20 p-2 text-center text-white backdrop-blur-xl">
          <Text variant="text-10-light">Your polygons have been updated</Text>
          <Button
            variant="text"
            className="text-10-bold my-2 flex w-full justify-center rounded-lg bg-tertiary-600 p-2"
            onClick={() => {}}
          >
            Check Polygons
          </Button>
          <Text variant="text-10-bold">Request Support</Text>
        </div>
      </When>
      <Map
        geojson={geoJSON}
        siteData={true}
        imageLayerGeojson={imagesGeoJson}
        editPolygon={editPolygon}
        className="flex-1 rounded-r-lg"
      />
    </div>
  );
};

export default SiteArea;
