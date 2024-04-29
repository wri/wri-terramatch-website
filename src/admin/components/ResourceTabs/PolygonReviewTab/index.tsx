import { Grid, Stack } from "@mui/material";
import classNames from "classnames";
import { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import MapSite from "@/components/elements/Map-mapbox/MapSites";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM, MENU_PLACEMENT_RIGHT_TOP } from "@/components/elements/Menu/MenuVariant";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import ModalSubmit from "@/components/extensive/Modal/ModalSubmit";
import { useModalContext } from "@/context/modal.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import {
  GetV2FormsENTITYUUIDResponse,
  useGetV2FormsENTITYUUID,
  useGetV2SitesSiteBbox,
  useGetV2SitesSitePolygon
} from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { uploadImageData } from "@/pages/site/[uuid]/components/MockecData";
import { EntityName } from "@/types/common";

import SitePolygonReviewAside from "./components/PolygonReviewAside";
import { polygonData } from "./components/Polygons";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: EntityName;
  label: string;
}
export interface IPolygonItem {
  id: string;
  status: "Draft" | "Submitted" | "Approved" | "Needs More Info";
  label: string;
  uuid: string;
}

const PolygonReviewAside: FC<{ type: EntityName; data: IPolygonItem[] }> = ({ type, data }) => {
  switch (type) {
    case "sites":
      return <SitePolygonReviewAside data={data} />;
    default:
      return null;
  }
};

const PolygonReviewTab: FC<IProps> = props => {
  const { isLoading: ctxLoading, record } = useShowContext();

  const { isLoading: queryLoading } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>({
    pathParams: {
      uuid: record.uuid,
      entity: props.type
    }
  });

  const { data: sitePolygonData } = useGetV2SitesSitePolygon<{
    data: SitePolygonsDataResponse;
  }>({
    pathParams: {
      site: record.uuid
    }
  });

  const { data: sitePolygonBbox } = useGetV2SitesSiteBbox({
    pathParams: {
      site: record.uuid
    }
  });

  const siteBbox = sitePolygonBbox?.bbox;
  const sitePolygonDataTable = ((sitePolygonData ?? []) as SitePolygonsDataResponse).map((data: SitePolygon) => ({
    "polygon-id": data.id,
    "restoration-practice": data.practice,
    "target-land-use-system": data.target_sys,
    "tree-distribution": data.distr,
    "planting-start-date": data.plantstart,
    source: data.org_name,
    ellipse: false
  }));

  const transformedSiteDataForList = ((sitePolygonData ?? []) as SitePolygonsDataResponse).map(
    (data: SitePolygon, index: number) => ({
      id: (index + 1).toString(),
      status: data.status,
      label: data.poly_name || `Unnamed Polygon`,
      uuid: data.poly_id
    })
  );

  const polygonDataMap = ((sitePolygonData ?? []) as SitePolygonsDataResponse).reduce((acc: any, data: any) => {
    if (!acc[data.status]) {
      acc[data.status] = [];
    }
    acc[data.status].push(data.poly_id);
    return acc;
  }, {});

  const { openModal, closeModal } = useModalContext();

  const openFormModalHandlerAddPolygon = () => {
    openModal(
      <ModalAdd
        title="Add Polygons"
        descriptionInput="Drag and drop a GeoJSON, Shapefile, or KML for your site Tannous/Brayton Road."
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">TerraMatch upload limits:&nbsp;</Text>
            <Text variant="text-12-light">50 MB per upload</Text>
          </div>
        }
        onCLose={closeModal}
        content="Start by adding polygons to your site."
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        {/* Next div is only Mocked data delete this children later*/}
        <div className="mb-6 flex flex-col gap-4">
          {polygonData.map(polygon => (
            <div
              key={polygon.id}
              className="border-grey-75 flex items-center justify-between rounded-lg border border-grey-750 py-[10px] pr-6 pl-4"
            >
              <div className="flex gap-3">
                <div className="rounded-lg bg-neutral-150 p-2">
                  <Icon name={IconNames.POLYGON} className="h-6 w-6 text-grey-720" />
                </div>
                <div>
                  <Text variant="text-12">{polygon.name}</Text>
                  <Text variant="text-12" className="opacity-50">
                    {polygon.status}
                  </Text>
                </div>
              </div>
              <Icon
                name={polygon.isUploaded ? IconNames.CHECK_POLYGON : IconNames.ELLIPSE_POLYGON}
                className="h-6 w-6"
              />
            </div>
          ))}
        </div>
      </ModalAdd>
    );
  };

  const openFormModalHandlerConfirm = () => {
    openModal(
      <ModalConfirm
        title={"Confirm Polygon Approval"}
        content={contentForApproval}
        commentArea
        onClose={closeModal}
        onConfirm={() => {}}
      />
    );
  };

  const openFormModalHandlerUploadImages = () => {
    openModal(
      <ModalAdd
        title="Upload Images"
        variantFileInput={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES}
        descriptionInput="Drag and drop a geotagged or non-geotagged PNG, GIF or JPEG for your site Tannous/Brayton Road."
        descriptionList={
          <Text variant="text-12-bold" className="mt-9 ">
            Uploaded Files
          </Text>
        }
        onCLose={closeModal}
        content="Start by adding images for processing."
        primaryButtonText="Save"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        {/* Next div is only Mocked data delete this children later*/}
        <div className="mb-6 flex flex-col gap-4">
          {uploadImageData.map(image => (
            <div
              key={image.id}
              className="border-grey-75 flex items-center justify-between rounded-lg border border-grey-750 py-[10px] px-4"
            >
              <div className="flex gap-3">
                <div className="rounded-lg bg-neutral-150 p-2">
                  <Icon name={IconNames.IMAGE} className="h-6 w-6 text-grey-720" />
                </div>
                <div>
                  <Text variant="text-12">{image.name}</Text>
                  <Text variant="text-12" className="opacity-50">
                    {image.status}
                  </Text>
                </div>
              </div>
              <div
                className={classNames("flex w-[146px] items-center justify-center rounded border py-2", {
                  "border-blue": image.isVerified,
                  "border-red": !image.isVerified
                })}
              >
                <Text
                  variant="text-12-bold"
                  className={classNames({ "text-blue": image.isVerified, "text-red": !image.isVerified })}
                >
                  {image.isVerified ? "GeoTagged Verified" : "Not Verified"}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </ModalAdd>
    );
  };

  const openFormModalHandlerSubmitPolygon = () => {
    openModal(
      <ModalSubmit
        title="Submit Polygons"
        onCLose={closeModal}
        content="Project Developers may submit one or all polygons for review."
        primaryButtonText="Next"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            closeModal();
            openFormModalHandlerConfirm();
          }
        }}
        secondaryButtonText="Cancel"
        secondaryButtonProps={{ className: "px-8 py-3", variant: "white-page-admin", onClick: closeModal }}
      ></ModalSubmit>
    );
  };

  const isLoading = ctxLoading || queryLoading;

  if (isLoading) return null;

  const addMenuItems = [
    {
      id: "1",
      render: () => <Text variant="text-12-bold">Create Polygons</Text>
    },
    {
      id: "2",
      render: () => <Text variant="text-12-bold">Add Polygon Data</Text>,
      onClick: openFormModalHandlerAddPolygon
    },
    {
      id: "3",
      render: () => <Text variant="text-12-bold">Upload Images</Text>,
      onClick: openFormModalHandlerUploadImages
    }
  ];

  const polygonStatusLabels = [
    { id: "1", label: "Draft" },
    { id: "2", label: "Awaiting Approval" },
    { id: "3", label: "Needs More Information" },
    { id: "4", label: "Planting In Progress" },
    { id: "5", label: "Approved" }
  ];

  const tableItemMenu = [
    {
      id: "1",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.POLYGON} className="h-6 w-6" />
          <Text variant="text-12-bold">Open Polygon</Text>
        </div>
      )
    },
    {
      id: "2",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.SEARCH_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Zoom to</Text>
        </div>
      )
    },
    {
      id: "3",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.TRASH_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Delete Polygon</Text>
        </div>
      )
    }
  ];

  const contentForApproval = (
    <Text variant="text-12-light" as="p" className="text-center">
      Are you sure you want to approve the polygons for&nbsp;
      <b style={{ fontSize: "inherit" }}>Tannous/Brayrton Road</b>?
    </Text>
  );

  return (
    <When condition={!isLoading}>
      <SitePolygonDataProvider sitePolygonData={sitePolygonData}>
        <TabbedShowLayout.Tab {...props}>
          <Grid spacing={2} container>
            <Grid xs={9}>
              <Stack gap={4} className="pl-8 pt-9">
                <div className="flex items-start gap-3">
                  <div className="w-full">
                    <div className="mb-2">
                      <Text variant="text-16-bold" className="mb-2 text-grey-300">
                        Polygon Review
                      </Text>
                      <Text variant="text-14-light" className="text-grey-300">
                        Add, remove or edit polygons that are associated to a site. Polygons may be edited in the map
                        below; exported, modified in QGIS or ArcGIS and imported again; or fed through the mobile
                        application.
                      </Text>
                    </div>
                    <div className="flex gap-3">
                      <Menu menu={addMenuItems} className="flex-1">
                        <Button
                          variant="sky-page-admin"
                          className="h-fit w-full whitespace-nowrap"
                          iconProps={{
                            className: "w-4 h-4",
                            name: IconNames.PLUS_PA
                          }}
                        >
                          Add Data
                        </Button>
                      </Menu>
                      <Button
                        variant="white-page-admin"
                        className="flex-1"
                        iconProps={{
                          className: "w-4 h-4 group-hover-text-primary-500",
                          name: IconNames.DOWNLOAD_PA
                        }}
                      >
                        Download
                      </Button>
                      <Button className="flex-1 px-3" onClick={openFormModalHandlerSubmitPolygon}>
                        <Text variant="text-14-bold" className="text-white">
                          approve polygons
                        </Text>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 w-full rounded-lg border border-grey-750 p-4">
                    <Text variant="text-14" className="mb-3 text-grey-250">
                      Site Status
                    </Text>
                    <div className="h-fit w-full">
                      <StepProgressbar color="primary" value={50} labels={polygonStatusLabels} labelVariant="text-10" />
                    </div>
                  </div>
                </div>

                <MapSite polygonsData={polygonDataMap} bbox={siteBbox} className="rounded-lg" status={true} />
                <div className="mb-6">
                  <div className="mb-4">
                    <Text variant="text-16-bold" className="mb-2 text-grey-300">
                      Site Attribute Table
                    </Text>
                    <Text variant="text-14-light" className="text-grey-300">
                      Edit attribute table for all polygons quickly through the table below. Alternatively, open a
                      polygon and edit the attributes in the map above.
                    </Text>
                  </div>
                  <Table
                    variant={VARIANT_TABLE_SITE_POLYGON_REVIEW}
                    classNameWrapper="max-h-[176px]"
                    columns={[
                      { header: "Polygon ID", accessorKey: "polygon-id" },
                      {
                        header: "Restoration Practice",
                        accessorKey: "restoration-practice",
                        cell: props => {
                          const placeholder = props.getValue() as string;
                          return (
                            <input
                              placeholder={placeholder}
                              className="w-[118px] px-[10px] outline-primary placeholder:text-[currentColor]"
                            />
                          );
                        }
                      },
                      { header: "Target Land Use System", accessorKey: "target-land-use-system" },
                      { header: "Tree Distribution", accessorKey: "tree-distribution" },
                      { header: "Planting Start Date", accessorKey: "planting-start-date" },
                      { header: "Source", accessorKey: "source" },
                      {
                        header: "",
                        accessorKey: "ellipse",
                        enableSorting: false,
                        cell: props => (
                          <Menu
                            menu={tableItemMenu}
                            placement={
                              (props.getValue() as boolean) ? MENU_PLACEMENT_RIGHT_TOP : MENU_PLACEMENT_RIGHT_BOTTOM
                            }
                          >
                            <div className="rounded p-1 hover:bg-primary-200">
                              <Icon
                                name={IconNames.ELIPSES}
                                className="roudn h-4 w-4 rounded-sm text-grey-720 hover:bg-primary-200"
                              />
                            </div>
                          </Menu>
                        )
                      }
                    ]}
                    data={sitePolygonDataTable}
                  ></Table>
                </div>
              </Stack>
            </Grid>
            <Grid xs={3} className="pl-8 pr-4 pt-9">
              <PolygonReviewAside type={props.type} data={transformedSiteDataForList as IPolygonItem[]} />
            </Grid>
          </Grid>
        </TabbedShowLayout.Tab>
      </SitePolygonDataProvider>
    </When>
  );
};

export default PolygonReviewTab;
