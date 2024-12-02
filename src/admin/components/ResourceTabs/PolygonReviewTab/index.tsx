import { Grid, Stack } from "@mui/material";
import { useT } from "@transifex/react";
import { LngLatBoundsLike } from "mapbox-gl";
import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";

import ModalApprove from "@/admin/components/extensive/Modal/ModalApprove";
import Button from "@/components/elements/Button/Button";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import {
  addSourcesToLayers,
  downloadSiteGeoJsonPolygons,
  parsePolygonData,
  storePolygon
} from "@/components/elements/Map-mapbox/utils";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM, MENU_PLACEMENT_RIGHT_TOP } from "@/components/elements/Menu/MenuVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import {
  fetchDeleteV2TerrafundPolygonUuid,
  fetchGetV2TerrafundPolygonBboxUuid,
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile,
  fetchPutV2SitePolygonStatusBulk,
  GetV2MODELUUIDFilesResponse,
  useGetV2MODELUUIDFiles,
  useGetV2SitesSiteBbox
} from "@/generated/apiComponents";
import {
  PolygonBboxResponse,
  SitePolygon,
  SitePolygonsDataResponse,
  SitePolygonsLoadedDataResponse
} from "@/generated/apiSchemas";
import useLoadCriteriaSite from "@/hooks/paginated/useLoadCriteriaSite";
import { EntityName, FileType, UploadedFile } from "@/types/common";
import Log from "@/utils/log";

import ModalIdentified from "../../extensive/Modal/ModalIdentified";
import AddDataButton from "./components/AddDataButton";
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

const ContentForApproval = ({
  polygonsForApprovals,
  recordName
}: {
  polygonsForApprovals: SitePolygonsDataResponse;
  recordName: string;
}) => (
  <>
    <Text variant="text-12-light" as="p" className="text-center">
      Are you sure you want to approve the following polygons for&nbsp;
      <b style={{ fontSize: "inherit" }}>{recordName}</b>?
    </Text>
    <div className="ml-6">
      <ul style={{ listStyleType: "circle" }}>
        {polygonsForApprovals?.map(polygon => (
          <li key={polygon.id}>
            <Text variant="text-12-light" as="p">
              {polygon?.poly_name ?? "Unnamed Polygon"}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  </>
);

const PolygonReviewTab: FC<IProps> = props => {
  const { isLoading: ctxLoading, record, refetch: refreshEntity } = useShowContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);
  const [polygonFromMap, setPolygonFromMap] = useState<IpolygonFromMap>({ isOpen: false, uuid: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showLoader, hideLoader } = useLoading();
  const {
    setSelectedPolygonsInCheckbox,
    setPolygonCriteriaMap,
    setPolygonData,
    polygonCriteriaMap: polygonsCriteriaData,
    polygonData: polygonList,
    shouldRefetchValidation,
    setShouldRefetchValidation
  } = useMapAreaContext();
  const [polygonLoaded, setPolygonLoaded] = useState<boolean>(false);
  const [submitPolygonLoaded, setSubmitPolygonLoaded] = useState<boolean>(false);
  const t = useT();

  const { openNotification } = useNotificationContext();

  const onSave = (geojson: any, record: any) => {
    storePolygon(geojson, record, refetch, setPolygonFromMap, refreshEntity);
  };
  const mapFunctions = useMap(onSave);
  const { data: sitePolygonData, refetch, polygonCriteriaMap, loading } = useLoadCriteriaSite(record.uuid, "sites");

  const { data: modelFilesData } = useGetV2MODELUUIDFiles<GetV2MODELUUIDFilesResponse>({
    pathParams: { model: "sites", uuid: record.uuid }
  });

  const { data: sitePolygonBbox, refetch: refetchSiteBbox } = useGetV2SitesSiteBbox({
    pathParams: {
      site: record.uuid
    }
  });

  const siteBbox = sitePolygonBbox?.bbox as BBox;

  const parseText = (text: string) => {
    return text
      .split(",")
      .map(segment => {
        return segment
          .trim()
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      })
      .join(", ");
  };

  const sitePolygonDataTable = (sitePolygonData ?? []).map((data: SitePolygon, index) => ({
    "polygon-name": data.poly_name ?? `Unnamed Polygon`,
    "restoration-practice": parseText(data.practice ?? ""),
    "target-land-use-system": parseText(data.target_sys ?? ""),
    "tree-distribution": parseText(data.distr ?? ""),
    "planting-start-date": data.plantstart,
    source: parseText(data.source ?? ""),
    uuid: data.poly_id,
    ellipse: index === ((sitePolygonData ?? []) as SitePolygon[]).length - 1
  }));

  const transformedSiteDataForList = (sitePolygonData ?? []).map((data: SitePolygon, index: number) => ({
    id: (index + 1).toString(),
    status: data.status,
    label: data.poly_name ?? `Unnamed Polygon`,
    uuid: data.poly_id
  }));

  const polygonDataMap = parsePolygonData(sitePolygonData);

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
      Log.error("Bounding box is not in the expected format");
    }
  };

  const deletePolygon = (uuid: string) => {
    fetchDeleteV2TerrafundPolygonUuid({ pathParams: { uuid } })
      .then((response: DeletePolygonProps | undefined) => {
        if (response && response?.uuid) {
          refetch?.();
          const { map } = mapFunctions;
          if (map?.current) {
            addSourcesToLayers(map.current, polygonDataMap, undefined);
          }
          closeModal(ModalId.DELETE_POLYGON);
        }
      })
      .catch(error => {
        Log.error("Error deleting polygon:", error);
      });
  };

  const openFormModalHandlerConfirmDeletion = (uuid: string) => {
    openModal(
      ModalId.DELETE_POLYGON,
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polygon?"
        onClose={() => closeModal(ModalId.DELETE_POLYGON)}
        onConfirm={() => {
          deletePolygon(uuid);
        }}
      />
    );
  };

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
    }
  }, [files, saveFlags]);

  useEffect(() => {
    if (errorMessage) {
      openNotification("error", t("Error uploading file"), t(errorMessage));
      setErrorMessage(null);
    }
  }, [errorMessage]);

  useEffect(() => {
    setPolygonCriteriaMap(polygonCriteriaMap);
    setPolygonData(sitePolygonData);
  }, [loading]);
  useEffect(() => {
    if (shouldRefetchValidation) {
      refetch();
      setShouldRefetchValidation(false);
    }
  }, [shouldRefetchValidation]);
  const uploadFiles = async () => {
    const uploadPromises = [];
    showLoader();

    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      const site_uuid = record.uuid;
      const formData = new FormData();
      const fileType = getFileType(file);
      formData.append("file", fileToUpload);
      formData.append("uuid", site_uuid);
      formData.append("polygon_loaded", polygonLoaded.toString());
      formData.append("submit_polygon_loaded", submitPolygonLoaded.toString());
      let newRequest: any = formData;

      switch (fileType) {
        case "geojson":
          uploadPromises.push(fetchPostV2TerrafundUploadGeojson({ body: newRequest }));
          break;
        case "shapefile":
          uploadPromises.push(fetchPostV2TerrafundUploadShapefile({ body: newRequest }));
          break;
        case "kml":
          uploadPromises.push(fetchPostV2TerrafundUploadKml({ body: newRequest }));
          break;
        default:
          break;
      }
    }
    try {
      const promise = await Promise.all(uploadPromises);
      if (polygonLoaded) {
        openFormModalHandlerIdentifiedPolygons(promise);
      } else {
        openNotification("success", t("Success!"), t("Polygon uploaded successfully"));
      }
      refetch();
      refetchSiteBbox();
      closeModal(ModalId.ADD_POLYGON);
      setPolygonLoaded(false);
      setSubmitPolygonLoaded(false);
      hideLoader();
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        let errorMessage = error.message;
        if (typeof errorMessage === "string") {
          const parsedMessage = JSON.parse(errorMessage);
          if (parsedMessage && typeof parsedMessage === "object" && "message" in parsedMessage) {
            errorMessage = parsedMessage.message;
          }
        }
        if (errorMessage && typeof errorMessage === "object" && "message" in errorMessage) {
          errorMessage = errorMessage.message;
        }
        openNotification("error", t("Error uploading file"), errorMessage);
        hideLoader();
      } else {
        openNotification("error", t("Error uploading file"), t("An unknown error occurred"));
        hideLoader();
      }
    }
  };

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.file_name.split(".").pop()?.toLowerCase();
    return ["geojson", "zip", "kml"].includes(fileType as string) ? (fileType == "zip" ? "shapefile" : fileType) : null;
  };
  const openFormModalHandlerAddPolygon = () => {
    setPolygonLoaded(false);
    setSubmitPolygonLoaded(false);
    openModal(
      ModalId.ADD_POLYGON,
      <ModalAdd
        title="Add Polygons"
        descriptionInput={`Drag and drop a GeoJSON, Shapefile, or KML for your site ${record.name}.`}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">TerraMatch upload limits:&nbsp;</Text>
            <Text variant="text-12-light">50 MB per upload</Text>
          </div>
        }
        onClose={() => closeModal(ModalId.ADD_POLYGON)}
        content="Start by adding polygons to your site."
        primaryButtonText="Save"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: () => setSaveFlags(true) }}
        acceptedTypes={FileType.AcceptedShapefiles.split(",") as FileType[]}
        maxFileSize={2 * 1024 * 1024}
        setErrorMessage={setErrorMessage}
        setFile={setFiles}
      />
    );
  };
  const openFormModalHandlerConfirm = (polygonsForApprovals: SitePolygonsDataResponse, recordName: string) => {
    openModal(
      ModalId.CONFIRM_POLYGON_APPROVAL,
      <ModalConfirm
        title={"Confirm Polygon Approval"}
        content={<ContentForApproval polygonsForApprovals={polygonsForApprovals} recordName={recordName} />}
        commentArea
        onClose={() => closeModal(ModalId.CONFIRM_POLYGON_APPROVAL)}
        onConfirm={async data => {
          closeModal(ModalId.CONFIRM_POLYGON_APPROVAL);
          try {
            await fetchPutV2SitePolygonStatusBulk({
              body: {
                comment: data,
                updatePolygons: polygonsForApprovals.map(polygon => {
                  return { uuid: polygon.uuid, status: "approved" };
                })
              }
            });
            openNotification("success", "Success, Your Polygons were approved!", "");
            refetch();
          } catch (error) {
            Log.error("Polygon approval error", error);
          }
        }}
      />
    );
  };

  const openFormModalHandlerUploadImages = () => {
    openModal(
      ModalId.UPLOAD_IMAGES,
      <ModalAdd
        title="Upload Images"
        variantFileInput={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES}
        descriptionInput={`Drag and drop a geotagged or non-geotagged PNG, GIF or JPEG for your site ${record.name}.`}
        descriptionList={
          <Text variant="text-12-bold" className="mt-9 ">
            Uploaded Files
          </Text>
        }
        onClose={() => closeModal(ModalId.UPLOAD_IMAGES)}
        content="Start by adding images for processing."
        primaryButtonText="Save"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => closeModal(ModalId.APPROVE_POLYGONS)
        }}
      />
    );
  };

  const openFormModalHandlerAddPolygons = () => {
    openModal(
      ModalId.REPLACEMENT_POLYGONS,
      <ModalAdd
        title={t("Download All Polygons")}
        secondTitle={t("Upload All Polygons")}
        descriptionInput={t("Drag and drop a single GeoJSON, KML or SHP to create a new version of your polygon.")}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">{t("TerraMatch upload limits")}:&nbsp;</Text>
            <Text variant="text-12-light">{t("50 MB per upload")}</Text>
          </div>
        }
        onClose={() => {
          closeModal(ModalId.REPLACEMENT_POLYGONS);
          setPolygonLoaded(false);
          setSubmitPolygonLoaded(false);
        }}
        content={t(
          "Click the button below to download all polygons related to the site. All Available attributes - including the Site indentifier (UUID) - are included."
        )}
        secondContent={t(
          "As a single SHP, KML or GeoJSON, upload all polygons (and make sure to include the Site identifier)."
        )}
        primaryButtonText={t("Next")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            setPolygonLoaded(true);
            setSaveFlags(true);
          }
        }}
        acceptedTypes={FileType.AcceptedShapefiles.split(",") as FileType[]}
        setFile={setFiles}
        allowMultiple={false}
        btnDownload={true}
        btnDownloadProps={{
          onClick: () => {
            downloadSiteGeoJsonPolygons(record.uuid, record?.name ?? "sitePolygons");
          }
        }}
      />
    );
  };

  const openFormModalHandlerSubmitPolygon = () => {
    openModal(
      ModalId.APPROVE_POLYGONS,
      <ModalApprove
        title="Approve Polygons"
        site={record}
        onClose={() => closeModal(ModalId.APPROVE_POLYGONS)}
        content="Administrators may approve polygons only if all checks pass."
        primaryButtonText="Next"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: (polygons: unknown) => {
            closeModal(ModalId.APPROVE_POLYGONS);
            openFormModalHandlerConfirm(polygons as SitePolygonsDataResponse, record.name);
          }
        }}
        secondaryButtonText="Cancel"
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.APPROVE_POLYGONS)
        }}
        polygonsCriteriaData={polygonsCriteriaData}
        polygonList={polygonList}
      />
    );
  };

  const openFormModalHandlerIdentifiedPolygons = (polygonsLoaded: SitePolygonsLoadedDataResponse) => {
    openModal(
      ModalId.IDENTIFIED_POLYGONS,
      <ModalIdentified
        title={t("Polygons Identified")}
        polygonsList={polygonsLoaded[0] as SitePolygonsLoadedDataResponse}
        setSubmitPolygonLoaded={setSubmitPolygonLoaded}
        setSaveFlags={setSaveFlags}
        setPolygonLoaded={setPolygonLoaded}
        onClose={() => {
          closeModal(ModalId.IDENTIFIED_POLYGONS);
          setPolygonLoaded(false);
        }}
        content={t(
          "Based on the recent upload, the following polygons were identified and will be used to create new versions. Polygons within the site that are not shown have not been uploaded will not be affected."
        )}
        primaryButtonText={t("Submit")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            setPolygonLoaded(false);
            setSubmitPolygonLoaded(true);
            setSaveFlags(true);
            closeModal(ModalId.REPLACEMENT_POLYGONS);
            closeModal(ModalId.IDENTIFIED_POLYGONS);
          }
        }}
        secondaryButtonText={t("Cancel")}
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => {
            setPolygonLoaded(false);
            setSubmitPolygonLoaded(false);
            closeModal(ModalId.IDENTIFIED_POLYGONS);
            setSaveFlags(false);
          }
        }}
      />
    );
  };

  const isLoading = ctxLoading;

  if (isLoading) return null;

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
          <Icon name={IconNames.TRASH_PA} className="h-5 w-5" />
          <Text variant="text-12-bold">Delete Polygon</Text>
        </div>
      )
    }
  ];

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonData} reloadSiteData={refetch}>
      <TabbedShowLayout.Tab {...props}>
        <Grid spacing={2} container>
          <Grid xs={9}>
            <Stack gap={4} className="pl-8 pt-9">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-[450px] flex-[18]">
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
                    <AddDataButton
                      classNameContent="flex-1"
                      openFormModalHandlerAddPolygon={openFormModalHandlerAddPolygon}
                      openFormModalHandlerUploadImages={openFormModalHandlerUploadImages}
                      openFormModalHandlerAddPolygons={openFormModalHandlerAddPolygons}
                    />

                    <Button
                      variant="white-page-admin"
                      className="flex-1"
                      iconProps={{
                        className: "w-4 h-4 group-hover-text-primary-500",
                        name: IconNames.DOWNLOAD_PA
                      }}
                      onClick={() => {
                        setSelectedPolygonsInCheckbox([]);
                        downloadSiteGeoJsonPolygons(record.uuid, record?.name ?? "sitePolygons");
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      className="flex-1 px-3"
                      onClick={() => {
                        setSelectedPolygonsInCheckbox([]);
                        openFormModalHandlerSubmitPolygon();
                      }}
                    >
                      <Text variant="text-14-bold" className="text-white">
                        approve polygons
                      </Text>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 min-w-[310px] flex-[11] rounded-lg border border-grey-750 p-4">
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
                showPopups
                showLegend
                mapFunctions={mapFunctions}
                tooltipType="edit"
                sitePolygonData={sitePolygonData}
                modelFilesData={modelFilesData?.data}
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
                  classNameWrapper="max-h-[560px]"
                  initialTableState={{
                    pagination: { pageSize: 10000000 }
                  }}
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
              refresh={refetch}
            />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </SitePolygonDataProvider>
  );
};

export default PolygonReviewTab;
