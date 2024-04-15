import { Grid, Stack } from "@mui/material";
import classNames from "classnames";
import { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import DragAndDrop from "@/components/elements/DragAndDrop/DragAndDrop";
import Map from "@/components/elements/Map-mapbox/Map";
import Menu from "@/components/elements/Menu/Menu";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import { useModalContext } from "@/context/modal.provider";
import { GetV2FormsENTITYUUIDResponse, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";
import { uploadImageData } from "@/pages/site/[uuid]/components/MockecData";
import { EntityName } from "@/types/common";

import SitePolygonReviewAside from "./components/PolygonReviewAside";
import { polygonData } from "./components/Polygons";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: EntityName;
  label: string;
}

const PolygonReviewAside: FC<{ type: EntityName }> = ({ type }) => {
  switch (type) {
    case "sites":
      return <SitePolygonReviewAside />;
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

  const { openModal, closeModal } = useModalContext();

  const openFormModalHandlerAddPolygon = () => {
    openModal(
      <ModalWithLogo
        title="Add Polygons"
        onCLose={closeModal}
        content={
          <Text variant="text-12-light" className="mt-1 mb-4" containHtml>
            Start by adding polygons to your site.
          </Text>
        }
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <DragAndDrop
          description={
            <div className="flex flex-col">
              <Text variant="text-12-bold" className="text-center text-primary">
                Click to upload
              </Text>
              <Text variant="text-12-light" className="text-center">
                or
              </Text>
              <Text variant="text-12-light" className="max-w-[210px] text-center">
                Drag and drop a GeoJSON files only to store and display on TerraMatch.
              </Text>
            </div>
          }
        />
        <div>
          <div className="m-2 flex">
            <Text variant="text-12-bold">TerraMatch upload limits:&nbsp;</Text>
            <Text variant="text-12-light">50 MB per upload</Text>
          </div>
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
        </div>
      </ModalWithLogo>
    );
  };

  const openFormModalHandlerConfirm = () => {
    openModal(
      <ModalConfirm
        title={"Confirm Polygon Approval"}
        content="Do you want to approve this polgyon?"
        onClose={closeModal}
        onConfirm={() => {}}
      />
    );
  };

  const openFormModalHandlerUploadImages = () => {
    openModal(
      <ModalWithLogo
        title="Upload Images"
        onCLose={closeModal}
        content={
          <Text variant="text-12-light" className="mt-1 mb-4" containHtml>
            Start by adding images for processing.
          </Text>
        }
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <DragAndDrop
          description={
            <div className="flex flex-col">
              <Text variant="text-12-bold" className="text-center text-primary">
                Click to upload
              </Text>
              <Text variant="text-12-light" className="text-center">
                or
              </Text>
              <Text variant="text-12-light" className="max-w-[210px] text-center">
                Drag and drop.
              </Text>
            </div>
          }
        />
        <div>
          <div className="mb-4 flex justify-between">
            <Text variant="text-12-bold">Uploaded Files</Text>
            <Text variant="text-12-bold" className="w-[146px] whitespace-nowrap pr-6 text-primary">
              Confirming Geolocation
            </Text>
          </div>
          <div className="mb-6 flex flex-col gap-4">
            {uploadImageData.map(image => (
              <div
                key={image.id}
                className="border-grey-75 flex items-center justify-between rounded-lg border border-grey-750 py-[10px] pr-6 pl-4"
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
                    "border-green-400": image.isVerified,
                    "border-red": !image.isVerified
                  })}
                >
                  <Text
                    variant="text-12-bold"
                    className={classNames({ "text-green-400": image.isVerified, "text-red": !image.isVerified })}
                  >
                    {image.isVerified ? "GeoTagged Verified" : "Not Verified"}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalWithLogo>
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
      onClick: () => openFormModalHandlerAddPolygon()
    },
    {
      id: "3",
      render: () => <Text variant="text-12-bold">Upload Images</Text>,
      onClick: () => openFormModalHandlerUploadImages()
    }
  ];

  const polygonStatusLabels = [
    { id: "1", label: "Site Approved" },
    { id: "2", label: "Polygons Submitted" },
    { id: "3", label: "Polygons Approved" },
    { id: "4", label: "Monitoring Begins" }
  ];
  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab {...props}>
        <Grid spacing={2} container>
          <Grid xs={8}>
            <Stack gap={4} className="pl-8 pt-9">
              <div className="flex items-start gap-3">
                <div className="w-full">
                  <div className="mb-2">
                    <Text variant="text-16-bold" className="mb-2 text-grey-300">
                      Polygon Review
                    </Text>
                    <Text variant="text-14-light" className="text-grey-300">
                      Add, remove or edit polygons that are associated to a site. Polygons may be edited in the map
                      below; exported, moified in QGIS or ArcGIS and imported again; or fed through the mobile
                      application.
                    </Text>
                  </div>
                  <div className="flex flex-wrap gap-3">
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
                    <Button className="flex-1 px-3" onClick={openFormModalHandlerConfirm}>
                      <Text variant="text-14-bold" className="text-white">
                        approve polygons
                      </Text>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 w-full rounded-lg border border-grey-750 p-4">
                  <Text variant="text-14" className="mb-3 text-grey-250">
                    Polygon Status
                  </Text>
                  <div className="h-fit w-full">
                    <StepProgressbar color="primary" value={80} labels={polygonStatusLabels} />
                  </div>
                </div>
              </div>

              <Map className="rounded-lg" status={true} />
              <div>
                <div>
                  <Text variant="text-16-bold" className="mb-2 text-grey-300">
                    Site Attribute Table
                  </Text>
                  <Text variant="text-14-light" className="text-grey-300">
                    Edit attribute table for all polygons quickly through the table below. Alternatively, open a polygon
                    and edit the attributes in the map above.
                  </Text>
                </div>
                {/*TODO TABLE*/}
              </div>
            </Stack>
          </Grid>
          <Grid xs={4} className="pl-8 pr-4 pt-9">
            <PolygonReviewAside type={props.type} />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default PolygonReviewTab;
