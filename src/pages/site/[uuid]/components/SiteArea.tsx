import { useInfiniteQuery } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { Dispatch, SetStateAction, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import DragAndDrop from "@/components/elements/DragAndDrop/DragAndDrop";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Map from "@/components/elements/Map-mapbox/Map";
import MapPolygonPanel from "@/components/elements/MapPolygonPanel/MapPolygonPanel";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { dataSubmitPolygons } from "@/components/extensive/Modal/ModalContent/MockedData";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import { useModalContext } from "@/context/modal.provider";
import { fetchGetV2ProjectsUUIDSitePolygons } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import { useGetImagesGeoJSON } from "@/hooks/useImageGeoJSON";
import { useJSONParser } from "@/hooks/useJSONParser";
import { usePaginatedResult } from "@/hooks/usePaginatedResult";

import { polygonStatusLabels } from "./MockecData";

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
        onCLose={closeModal}
        content={
          <Text variant="text-16-bold" className="mt-1 mb-8" containHtml>
            Faja Lobi Project&nbsp;&nbsp;•&nbsp;&nbsp;Priceless Planet Coalition
          </Text>
        }
        primaryButtonText="Submit"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <div className="mb-[72px]">
          <StepProgressbar value={80} labels={polygonStatusLabels} />
        </div>
        <TextArea
          name={""}
          label="Comment"
          labelVariant="text-12-light"
          labelClassname="capitalize "
          className="text-12-light max-h-72 !min-h-0 resize-none"
          placeholder="Insert my comment"
          rows={4}
        />
        <Text variant="text-12-light" className="mt-6 mb-2">
          Attachments
        </Text>
        <DragAndDrop
          description={
            <div className="flex flex-col">
              <Text variant="text-12-bold" className="text-center text-primary">
                Click to upload
              </Text>
              <Text variant="text-12-bold" className="whitespace-nowrap text-center text-primary">
                documents or images to help reviewer
              </Text>
            </div>
          }
        />
      </ModalWithMap>
    );
  };

  const openFormModalHandlerSubmitReviewConfirm = () => {
    openModal(
      <ModalConfirm
        className="max-w-xs"
        title={"Confirm Polygon Submission"}
        content={
          <Text variant="text-12-light" as="p" className="text-center">
            Are your sure you want to submit your polygons for the site <b style={{ fontSize: "inherit" }}>Iseme.</b>?
          </Text>
        }
        onClose={closeModal}
        onConfirm={() => {
          closeModal;
        }}
      >
        <div className="rounded-lg border border-grey-750 p-3">
          <TextArea
            placeholder="Type comment here..."
            name=""
            className="max-h-72 !min-h-0 resize-none border-none !p-0 text-xs"
            containerClassName="w-full"
            rows={4}
          />
        </div>
      </ModalConfirm>
    );
  };

  const openFormModalHandlerSubmitPolygon = () => {
    openModal(
      <ModalWithLogo
        title="Submit Polygons"
        onCLose={closeModal}
        content={
          <Text variant="text-12-light" className="mt-1 mb-8" containHtml>
            Project Developers may submit one or all polygons for review.
          </Text>
        }
        primaryButtonText="Next"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            closeModal();
            openFormModalHandlerSubmitReviewConfirm();
          }
        }}
        secondaryButtonText="Cancel"
        secondaryButtonProps={{ className: "px-8 py-3", variant: "white-page-admin", onClick: closeModal }}
      >
        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              Name
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              Status
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              Submit
            </Text>
          </header>
          {dataSubmitPolygons.map(item => (
            <div key={item.id} className="flex items-center px-4 py-2">
              <Text variant="text-12" className="flex-[2]">
                {item.name}
              </Text>
              <div className="flex flex-1 items-center justify-center">
                <Status status={item.status} />
              </div>
              <div className="flex flex-1 items-center justify-center">
                <Checkbox name={""} />
              </div>
            </div>
          ))}
        </div>
      </ModalWithLogo>
    );
  };

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
        editPolygon={editPolygon}
        tabEditPolygon={tabEditPolygon}
        setTabEditPolygon={setTabEditPolygon}
        setPreviewVersion={setPreviewVersion}
      />
      <When condition={!stateViewPanel}>
        <div className="absolute left-[24vw] top-5 z-20 rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
          <Text variant="text-10-light">Your polygons have been updated</Text>
          <Button
            variant="text"
            className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white"
            onClick={() => openFormModalHandlerSubmitPolygon()}
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
      </When>
      <When condition={tabEditPolygon === "Version" && !editPolygon}>
        <Button variant="primary" className=" absolute top-5 left-[58%] z-20 lg:left-[60%]" onClick={() => {}}>
          {t("Confirm Version")}
          <Icon name={IconNames.IC_INFO_WHITE} className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
        </Button>
      </When>
      <When condition={!!previewVersion}>
        <div className="absolute bottom-8 right-44 z-20 rounded bg-white p-3">
          <button className="absolute top-4 right-4" onClick={() => setPreviewVersion(false)}>
            <Icon name={IconNames.CLEAR} className="h-4 w-4" />
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
              Restoration Practice*
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
