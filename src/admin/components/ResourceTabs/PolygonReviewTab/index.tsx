import { Grid, Stack } from "@mui/material";
import classNames from "classnames";
import { LngLatBoundsLike } from "mapbox-gl";
import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { addSourcesToLayers } from "@/components/elements/Map-mapbox/utils";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM, MENU_PLACEMENT_RIGHT_TOP } from "@/components/elements/Menu/MenuVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalApprove from "@/components/extensive/Modal/ModalApprove";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import {
  fetchDeleteV2TerrafundPolygonUuid,
  fetchGetV2TerrafundGeojsonSite,
  fetchGetV2TerrafundPolygonBboxUuid,
  fetchPostV2TerrafundPolygon,
  fetchPostV2TerrafundSitePolygonUuidSiteUuid,
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile,
  PostV2TerrafundUploadGeojsonRequestBody,
  PostV2TerrafundUploadKmlRequestBody,
  PostV2TerrafundUploadShapefileRequestBody,
  useGetV2SitesSiteBbox,
  useGetV2SitesSitePolygon
} from "@/generated/apiComponents";
import { PolygonBboxResponse, SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { uploadImageData } from "@/pages/site/[uuid]/components/MockecData";
import { EntityName, FileType, UploadedFile } from "@/types/common";

import SitePolygonReviewAside from "./components/PolygonReviewAside";
import { IpolygonFromMap } from "./components/Polygons";
import SitePolygonStatus from "./components/SitePolygonStatus/SitePolygonStatus";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: EntityName;
  label: string;
}
export interface IPolygonItem {
  id: string;
  status: "draft" | "submitted" | "approved" | "needs-more-information";
  label: string;
  uuid: string;
}

interface TableItemMenuProps {
  ellipse: boolean;
  "planting-start-date": string | null;
  "polygon-name": string;
  "restoration-practice": string;
  source?: string;
  "target-land-use-system": string | null;
  "tree-distribution": string | null;
  uuid: string;
}

interface DeletePolygonProps {
  uuid: string;
  message: string;
}

const PolygonReviewAside: FC<{
  type: EntityName;
  data: IPolygonItem[];
  polygonFromMap: IpolygonFromMap;
  setPolygonFromMap: any;
  refresh?: () => void;
  mapFunctions: any;
}> = ({ type, data, polygonFromMap, setPolygonFromMap, refresh, mapFunctions }) => {
  switch (type) {
    case "sites":
      return (
        <SitePolygonReviewAside
          data={data}
          polygonFromMap={polygonFromMap}
          setPolygonFromMap={setPolygonFromMap}
          mapFunctions={mapFunctions}
          refresh={refresh}
        />
      );
    default:
      return null;
  }
};

const PolygonReviewTab: FC<IProps> = props => {
  const { isLoading: ctxLoading, record } = useShowContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);
  const [isUserDrawing, setIsUserDrawing] = useState<boolean>(false);

  const [polygonFromMap, setPolygonFromMap] = useState<IpolygonFromMap>({ isOpen: false, uuid: "" });

  async function storePolygon(geojson: any, record: any) {
    if (geojson?.length) {
      const response = await fetchPostV2TerrafundPolygon({
        body: { geometry: JSON.stringify(geojson[0].geometry) }
      });
      const polygonUUID = response.uuid;
      if (polygonUUID) {
        const site_id = record.uuid;
        await fetchPostV2TerrafundSitePolygonUuidSiteUuid({
          body: {},
          pathParams: { uuid: polygonUUID, siteUuid: site_id }
        }).then(() => {
          refetch();
          setPolygonFromMap({ uuid: polygonUUID, isOpen: true });
        });
      }
    }
  }

  const mapFunctions = useMap(storePolygon);

  const { data: sitePolygonData, refetch } = useGetV2SitesSitePolygon<{
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
  const sitePolygonDataTable = ((sitePolygonData ?? []) as SitePolygonsDataResponse).map(
    (data: SitePolygon, index) => ({
      "polygon-name": data.poly_name || `Unnamed Polygon`,
      "restoration-practice": data.practice,
      "target-land-use-system": data.target_sys,
      "tree-distribution": data.distr,
      "planting-start-date": data.plantstart,
      source: data.org_name,
      uuid: data.poly_id,
      ellipse: index === ((sitePolygonData ?? []) as SitePolygon[]).length - 1
    })
  );

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

  const flyToPolygonBounds = async (uuid: string) => {
    const bbox: PolygonBboxResponse = await fetchGetV2TerrafundPolygonBboxUuid({ pathParams: { uuid } });
    const bboxArray = bbox?.bbox;
    const { map } = mapFunctions;
    if (bboxArray && map?.current) {
      const bounds: LngLatBoundsLike = [
        [bboxArray[0], bboxArray[1]],
        [bboxArray[2], bboxArray[3]]
      ];
      map.current.fitBounds(bounds, {
        padding: 100,
        linear: false
      });
    } else {
      console.error("Bounding box is not in the expected format");
    }
  };

  const deletePolygon = (uuid: string) => {
    fetchDeleteV2TerrafundPolygonUuid({ pathParams: { uuid } })
      .then((response: DeletePolygonProps | undefined) => {
        if (response && response?.uuid) {
          if (reloadSiteData) {
            reloadSiteData();
          }
          const { map } = mapFunctions;
          if (map?.current) {
            addSourcesToLayers(map.current, polygonDataMap);
          }
          closeModal();
        }
      })
      .catch(error => {
        console.error("Error deleting polygon:", error);
      });
  };

  const openFormModalHandlerConfirmDeletion = (uuid: string) => {
    openModal(
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polygon?"
        onClose={closeModal}
        onConfirm={() => {
          deletePolygon(uuid);
        }}
      />
    );
  };

  const downloadSiteGeoJsonPolygons = async (siteUuid: string) => {
    const polygonGeojson = await fetchGetV2TerrafundGeojsonSite({
      queryParams: { uuid: siteUuid }
    });
    const blob = new Blob([JSON.stringify(polygonGeojson)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SitePolygons.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
    }
  }, [files, saveFlags]);

  const uploadFiles = async () => {
    const uploadPromises = [];

    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      const site_uuid = record.uuid;
      const formData = new FormData();
      const fileType = getFileType(file);
      formData.append("file", fileToUpload);
      formData.append("uuid", site_uuid);
      let newRequest: any;

      switch (fileType) {
        case "geojson":
          newRequest = formData as PostV2TerrafundUploadGeojsonRequestBody;
          uploadPromises.push(fetchPostV2TerrafundUploadGeojson({ body: newRequest }));
          break;
        case "shapefile":
          newRequest = formData as PostV2TerrafundUploadShapefileRequestBody;
          uploadPromises.push(fetchPostV2TerrafundUploadShapefile({ body: newRequest }));
          break;
        case "kml":
          newRequest = formData as PostV2TerrafundUploadKmlRequestBody;
          uploadPromises.push(fetchPostV2TerrafundUploadKml({ body: newRequest }));
          break;
        default:
          break;
      }
    }

    await Promise.all(uploadPromises);

    refetch();
    closeModal();
  };

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.file_name.split(".").pop()?.toLowerCase();
    if (fileType === "geojson") return "geojson";
    if (fileType === "zip") return "shapefile";
    if (fileType === "kml") return "kml";
    return null;
  };
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
        primaryButtonText="Save"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: () => setSaveFlags(true) }}
        acceptedTYpes={FileType.ShapeFiles.split(",") as FileType[]}
        setFile={setFiles}
      >
        {/* Next div is only Mocked data delete this children later*/}
        {/* <div className="flex flex-col gap-4 mb-6">
          {polygonData.map(polygon => (
            <div
              key={polygon.id}
              className="border-grey-75 flex items-center justify-between rounded-lg border border-grey-750 py-[10px] pr-6 pl-4"
            >
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-neutral-150">
                  <Icon name={IconNames.POLYGON} className="w-6 h-6 text-grey-720" />
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
                className={classNames("h-6 w-6", { "animate-spin": !polygon.isUploaded })}
              />
            </div>
          ))}
        </div> */}
      </ModalAdd>
    );
  };
  const reloadSiteData = () => {
    refetch();
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
                  className={classNames("text-center", {
                    "text-blue": image.isVerified,
                    "text-red": !image.isVerified
                  })}
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
      <ModalApprove
        title="Approve Polygons"
        onCLose={closeModal}
        content="Administrators may approve polygons only if all checks pass."
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
      ></ModalApprove>
    );
  };

  const isLoading = ctxLoading;

  if (isLoading) return null;

  const addMenuItems = [
    {
      id: "1",
      render: () => <Text variant="text-12-bold">Create Polygons</Text>,
      onClick: () => setIsUserDrawing(true)
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

  const tableItemMenu = (props: TableItemMenuProps) => [
    {
      id: "1",
      render: () => (
        <div className="flex items-center gap-2" onClick={() => setPolygonFromMap({ isOpen: true, uuid: props.uuid })}>
          <Icon name={IconNames.POLYGON} className="h-6 w-6" />
          <Text variant="text-12-bold">Open Polygon</Text>
        </div>
      )
    },
    {
      id: "2",
      render: () => (
        <div className="flex items-center gap-2" onClick={() => flyToPolygonBounds(props.uuid)}>
          <Icon name={IconNames.SEARCH_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Zoom to</Text>
        </div>
      )
    },
    {
      id: "3",
      render: () => (
        <div className="flex items-center gap-2" onClick={() => openFormModalHandlerConfirmDeletion(props.uuid)}>
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
    <SitePolygonDataProvider sitePolygonData={sitePolygonData} reloadSiteData={reloadSiteData}>
      <TabbedShowLayout.Tab {...props}>
        <Grid spacing={2} container>
          <Grid xs={9}>
            <Stack gap={4} className="pl-8 pt-9">
              <div className="flex items-start gap-3">
                <div className="w-full">
                  <div className="mb-2">
                    <Text variant="text-16-bold" className="mb-2 text-darkCustom">
                      Polygon Review
                    </Text>
                    <Text variant="text-14-light" className="text-darkCustom">
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
                      onClick={() => {
                        downloadSiteGeoJsonPolygons(record.uuid);
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
                  <Text variant="text-14" className="mb-3 text-blueCustom-250">
                    Site Status
                  </Text>
                  <div className="h-fit w-full">
                    <SitePolygonStatus statusLabel={record.readable_status} />
                  </div>
                </div>
              </div>
              <MapContainer
                record={record}
                polygonsData={polygonDataMap}
                bbox={siteBbox}
                className="rounded-lg"
                status={true}
                setPolygonFromMap={setPolygonFromMap}
                polygonFromMap={polygonFromMap}
                isUserDrawing={isUserDrawing}
                setIsUserDrawing={setIsUserDrawing}
                showPopups
                showLegend
                mapFunctions={mapFunctions}
              />
              <div className="mb-6">
                <div className="mb-4">
                  <Text variant="text-16-bold" className="mb-2 text-darkCustom">
                    Site Attribute Table
                  </Text>
                  <Text variant="text-14-light" className="text-darkCustom">
                    Edit attribute table for all polygons quickly through the table below. Alternatively, open a polygon
                    and edit the attributes in the map above.
                  </Text>
                </div>
                <Table
                  variant={VARIANT_TABLE_SITE_POLYGON_REVIEW}
                  hasPagination={false}
                  classNameWrapper="max-h-[176px]"
                  columns={[
                    { header: "Polygon Name", accessorKey: "polygon-name" },
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
                          menu={tableItemMenu(props?.row?.original as TableItemMenuProps)}
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
            <PolygonReviewAside
              type={props.type}
              data={transformedSiteDataForList as IPolygonItem[]}
              polygonFromMap={polygonFromMap}
              setPolygonFromMap={setPolygonFromMap}
              mapFunctions={mapFunctions}
            />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </SitePolygonDataProvider>
  );
};

export default PolygonReviewTab;
