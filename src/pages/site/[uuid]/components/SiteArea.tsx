import { useInfiniteQuery } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { Dispatch, SetStateAction, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import MapPolygonPanel from "@/components/elements/MapPolygonPanel/MapPolygonPanel";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import { useModalContext } from "@/context/modal.provider";
import { fetchGetV2ProjectsUUIDSitePolygons } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import { useGetImagesGeoJSON } from "@/hooks/useImageGeoJSON";
import { useJSONParser } from "@/hooks/useJSONParser";
import { usePaginatedResult } from "@/hooks/usePaginatedResult";

interface SiteAreaProps {
  sites: any;
  editPolygon: boolean;
  setEditPolygon: Dispatch<SetStateAction<boolean>>;
}

const SiteArea = ({ sites, editPolygon, setEditPolygon }: SiteAreaProps) => {
  const t = useT();
  const { format } = useDate();
  const [query, setQuery] = useState("");
  const [tabEditPolygon, setTabEditPolygon] = useState("Attributes");
  const [selected, setSelected] = useState<any>();
  const [stateViewPanel, setStateViewPanel] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(false);

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
  const { openModal, closeModal } = useModalContext();
  const imagesGeoJson = useGetImagesGeoJSON("projects", sites.uuid);
  const geoJSON = useJSONParser(selected?.geojson || sites.boundary_geojson);
  const Polygon = usePaginatedResult<any>(data);

  const openFormModalHandlerRequestPolygonSupport = () => {
    openModal(
      <ModalWithMap
        title="Request Support"
        onClose={closeModal}
        content="Faja Lobi Project&nbsp;&nbsp;•&nbsp;&nbsp;Priceless Planet Coalition"
        primaryButtonText="Submit"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      ></ModalWithMap>
    );
  };

  return (
    <div className="relative flex h-[500px] rounded-lg  text-darkCustom wide:h-[700px]">
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
        className="absolute z-20 h-[500px] w-[23vw] p-8 wide:h-[700px] "
        onLoadMore={fetchNextPage}
        emptyText={t("No polygons are available.")}
        setStateViewPanel={setStateViewPanel}
        stateViewPanel={stateViewPanel}
        setEditPolygon={setEditPolygon}
        editPolygon={editPolygon}
        tabEditPolygon={tabEditPolygon}
        setTabEditPolygon={setTabEditPolygon}
        setPreviewVersion={setPreviewVersion}
      />
      <div className="absolute left-[24vw] top-5 z-20 rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
        <Text variant="text-10-light">Your polygons have been updated</Text>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white"
          onClick={() => setStateViewPanel(true)}
        >
          Check Polygons
        </Button>
        <Button
          variant="text"
          className="text-10-bold mt-2 flex w-full justify-center rounded-lg border border-transparent p-2 hover:border-white"
          onClick={() => openFormModalHandlerRequestPolygonSupport()}
        >
          Request Support
        </Button>
      </div>
      <When condition={tabEditPolygon === "Version" && !!editPolygon}>
        <div className="absolute top-5 left-[58%] z-20 text-center lg:left-[60%]">
          <Button variant="primary" className="" onClick={() => {}}>
            {t("Confirm Version")}
            <Icon name={IconNames.IC_INFO_WHITE} className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
          <br />
          <Button
            variant="text"
            className="text-12-bold m-auto rounded-lg bg-[#a2a295b5] px-4 py-1 text-black underline underline-offset-2 hover:text-white"
            onClick={() => {}}
          >
            {t("Cancel")}
          </Button>
        </div>
      </When>
      <When condition={!!previewVersion}>
        <div className="absolute bottom-8 right-44 z-20 rounded bg-white p-3">
          <button className="absolute top-3 right-4 hover:opacity-60" onClick={() => setPreviewVersion(false)}>
            <Icon name={IconNames.CLEAR} className="h-3 w-3 wide:h-4 wide:w-4" />
          </button>
          <Text variant="text-10-bold" className="mb-4 text-center">
            Preview Attributes
          </Text>
          <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
            <Text variant="text-10-light" className="opacity-60">
              Polygon ID
            </Text>
            <Text variant="text-10-light">1213023412</Text>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
            <Text variant="text-10-light" className="opacity-60">
              Restoration Practice
            </Text>
            <Text variant="text-10-light">1213023412</Text>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
            <Text variant="text-10-light" className="opacity-60">
              Target Land Use System
            </Text>
            <Text variant="text-10-light">Riparian Area or Wetl...</Text>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
            <Text variant="text-10-light" className="opacity-60">
              Tree Distribution
            </Text>
            <Text variant="text-10-light">Single Line</Text>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
            <Text variant="text-10-light" className="opacity-60">
              Source
            </Text>
            <Text variant="text-10-light">Flority</Text>
          </div>
        </div>
      </When>
      <MapContainer
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
