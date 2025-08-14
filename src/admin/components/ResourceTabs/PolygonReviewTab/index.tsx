import { Grid, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { Else, If, Then } from "react-if";

import ModalApprove from "@/admin/components/extensive/Modal/ModalApprove";
import Button from "@/components/elements/Button/Button";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import {
  addSourcesToLayers,
  countStatusesV3,
  downloadSiteGeoJsonPolygons,
  parsePolygonDataV3,
  storePolygon
} from "@/components/elements/Map-mapbox/utils";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM, MENU_PLACEMENT_RIGHT_TOP } from "@/components/elements/Menu/MenuVariant";
import LinearProgressBarMonitored from "@/components/elements/ProgressBar/LinearProgressBar/LineProgressBarMonitored";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useBoundingBox } from "@/connections/BoundingBox";
import { useMedias } from "@/connections/EntityAssociation";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import {
  fetchDeleteV2TerrafundPolygonUuid,
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile,
  fetchPutV2SitePolygonStatusBulk
} from "@/generated/apiComponents";
import { SitePolygonsDataResponse, SitePolygonsLoadedDataResponse } from "@/generated/apiSchemas";
import { SitePolygonFullDto } from "@/generated/v3/researchService/researchServiceSchemas";
import useLoadSitePolygonsData from "@/hooks/paginated/useLoadSitePolygonData";
import { useValueChanged } from "@/hooks/useValueChanged";
import { EntityName, FileType, UploadedFile } from "@/types/common";
import Log from "@/utils/log";

import ModalIdentified from "../../extensive/Modal/ModalIdentified";
import AddDataButton from "./components/AddDataButton";
import SitePolygonReviewAside from "./components/PolygonReviewAside";
import { IpolygonFromMap } from "./components/Polygons";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: EntityName;
  label: string;
  setIsLoadingDelayedJob?: (isLoading: boolean) => void;
  isLoadingDelayedJob?: boolean;
  setAlertTitle?: (value: string) => void;
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
  totalPolygons?: number;
  siteUuid?: string;
  isLoading?: boolean;
}> = ({ type, data, polygonFromMap, setPolygonFromMap, refresh, mapFunctions, totalPolygons, siteUuid, isLoading }) => {
  switch (type) {
    case "sites":
      return (
        <SitePolygonReviewAside
          data={data}
          polygonFromMap={polygonFromMap}
          setPolygonFromMap={setPolygonFromMap}
          mapFunctions={mapFunctions}
          refresh={refresh}
          totalPolygons={totalPolygons}
          siteUuid={siteUuid}
          isLoading={isLoading}
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
    <div>
      <Text variant="text-14-bold" as="p">
        {recordName}
      </Text>
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
  const { selectPolygonFromMap } = useMonitoredDataContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);
  const [polygonFromMap, setPolygonFromMap] = useState<IpolygonFromMap>({ isOpen: false, uuid: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    setSelectedPolygonsInCheckbox,
    setPolygonData,
    polygonData: polygonList,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    validFilter
  } = useMapAreaContext();
  const [polygonLoaded, setPolygonLoaded] = useState<boolean>(false);
  const [submitPolygonLoaded, setSubmitPolygonLoaded] = useState<boolean>(false);
  const t = useT();

  const { openNotification } = useNotificationContext();

  const [currentPolygonUuid, setCurrentPolygonUuid] = useState<string | undefined>(undefined);
  const bbox = useBoundingBox({ polygonUuid: currentPolygonUuid ?? undefined, siteUuid: record?.uuid });
  const isValidBbox = (bbox: any): bbox is [number, number, number, number] =>
    Array.isArray(bbox) && bbox.length === 4 && bbox.every(n => typeof n === "number");
  const activeBbox = isValidBbox(bbox) ? bbox : undefined;
  const {
    data: sitePolygonData,
    refetch,
    loading,
    total
  } = useLoadSitePolygonsData(record?.uuid ?? "", "sites", undefined, "createdAt", "ASC", validFilter);
  const onSave = (geojson: any, record: any) => {
    storePolygon(geojson, record, refetch, setPolygonFromMap, refreshEntity);
  };
  const mapFunctions = useMap(onSave);

  const flyToPolygonBounds = useCallback(async (uuid: string) => {
    setCurrentPolygonUuid(uuid);
  }, []);

  useEffect(() => {
    if (selectPolygonFromMap?.uuid) {
      setPolygonFromMap(selectPolygonFromMap);
      flyToPolygonBounds(selectPolygonFromMap.uuid);
    }
  }, [flyToPolygonBounds, selectPolygonFromMap]);

  const [, { data: modelFilesData }] = useMedias({
    entity: "sites",
    uuid: record?.uuid,
    enabled: record?.uuid != null
  });

  useValueChanged(validFilter, () => {
    refetch();
  });

  // Simple transformation for MapContainer compatibility
  const transformForMapContainer = (data: SitePolygonFullDto[]) => {
    return data.map(polygon => ({
      id: undefined,
      uuid: polygon.polygonUuid ?? undefined,
      primary_uuid: polygon.primaryUuid ?? undefined,
      project_id: polygon.projectId ?? undefined,
      proj_name: polygon.projectShortName ?? undefined,
      org_name: undefined,
      poly_id: polygon.polygonUuid ?? undefined,
      poly_name: polygon.name ?? undefined,
      site_id: polygon.siteId ?? undefined,
      site_name: polygon.siteName ?? undefined,
      plantstart: polygon.plantStart ?? undefined,
      practice: polygon.practice ?? undefined,
      target_sys: polygon.targetSys ?? undefined,
      distr: polygon.distr ?? undefined,
      num_trees: polygon.numTrees ?? undefined,
      calc_area: polygon.calcArea ?? undefined,
      created_by: undefined,
      last_modified_by: undefined,
      deleted_at: undefined,
      created_at: undefined,
      updated_at: undefined,
      status: polygon.status,
      source: polygon.source ?? undefined,
      country: undefined,
      is_active: undefined,
      version_name: polygon.versionName ?? undefined,
      validation_status: polygon.validationStatus ? true : false
    }));
  };

  const sitePolygonDataTable = (sitePolygonData ?? []).map((data: SitePolygonFullDto, index) => ({
    "polygon-name": data?.name ?? `Unnamed Polygon`,
    "restoration-practice": data?.practice ?? "",
    "target-land-use-system": data?.targetSys ?? "",
    "tree-distribution": data?.distr ?? "",
    "planting-start-date": data?.plantStart ?? "",
    source: data?.source ?? "",
    uuid: data?.polygonUuid,
    ellipse: index === ((sitePolygonData ?? []) as SitePolygonFullDto[]).length - 1
  }));

  const transformedSiteDataForList = (sitePolygonData ?? []).map((data: SitePolygonFullDto, index: number) => ({
    id: (index + 1).toString(),
    status: data.status,
    label: data.name ?? `Unnamed Polygon`,
    uuid: data.polygonUuid,
    validationStatus: data.validationStatus ?? "notChecked"
  }));

  const polygonDataMap = parsePolygonDataV3(sitePolygonData);

  const dataPolygonOverview = countStatusesV3(sitePolygonData);

  const { openModal, closeModal } = useModalContext();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, saveFlags]);

  useEffect(() => {
    if (errorMessage) {
      openNotification("error", t("Error uploading file"), t(errorMessage));
      setErrorMessage(null);
    }
  }, [errorMessage, openNotification, t]);

  useEffect(() => {
    setPolygonData(sitePolygonData);
  }, [loading, setPolygonData, sitePolygonData]);

  useEffect(() => {
    if (shouldRefetchValidation) {
      refetch();
      setShouldRefetchValidation(false);
    }
  }, [refetch, setShouldRefetchValidation, shouldRefetchValidation]);
  const uploadFiles = async () => {
    const uploadPromises = [];
    closeModal(ModalId.ADD_POLYGON);
    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      const site_uuid = record?.uuid;
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
      setPolygonLoaded(false);
      setSubmitPolygonLoaded(false);
    } catch (error) {
      let errorMessage;

      if (error && typeof error === "object" && "error" in error) {
        const nestedError = error.error;
        if (typeof nestedError === "string") {
          try {
            const parsedNestedError = JSON.parse(nestedError);
            if (parsedNestedError && typeof parsedNestedError === "object" && "message" in parsedNestedError) {
              errorMessage = parsedNestedError.message;
            } else {
              errorMessage = nestedError;
            }
          } catch (parseError) {
            errorMessage = nestedError;
          }
        } else {
          errorMessage = nestedError;
        }
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = error.message;
      } else {
        errorMessage = t("An unknown error occurred");
      }
      openNotification("error", t("Error uploading file"), errorMessage || t("An unknown error occurred"));
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
        descriptionInput={`Drag and drop a GeoJSON, Shapefile, or KML for your site ${record?.name ?? ""}.`}
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
        descriptionInput={`Drag and drop a geotagged or non-geotagged PNG, GIF or JPEG for your site ${
          record?.name ?? ""
        }.`}
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
            downloadSiteGeoJsonPolygons(record?.uuid ?? "", record?.name ?? "sitePolygons");
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
            openFormModalHandlerConfirm(polygons as SitePolygonsDataResponse, record?.name ?? "");
          }
        }}
        secondaryButtonText="Cancel"
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.APPROVE_POLYGONS)
        }}
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

  if (ctxLoading) return null;

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
              <div className="flex flex-col items-start gap-3">
                <div className="mb-2 flex w-full gap-2 rounded-xl border-2 border-grey-350 bg-white p-3 shadow-monitored">
                  <div className="w-40 lg:w-48">
                    <Text variant="text-14" className="flex items-center gap-1 text-darkCustom">
                      Site Status
                      <ToolTip
                        title={""}
                        content={
                          "Site status indicates the current status of the site. Active sites that have been approved by project managers will have the status: Restoration in Progress."
                        }
                        width="w-64 lg:w-72"
                        trigger="click"
                      >
                        <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-4 lg:w-4" />
                      </ToolTip>
                    </Text>
                    <Text variant="text-14-bold" className="leading-[normal] text-black">
                      {record?.readable_status}
                    </Text>
                  </div>
                  <div className="w-full">
                    <Text variant="text-14" className="mb-2 flex items-center gap-1 text-darkCustom">
                      Polygon Overview
                      <ToolTip
                        title=""
                        content={`This graphic displays the breakdown of polygon statuses for this site. Approved Polygons are ready for monitoring, but all other statuses require polygon validation and approval. Use the 'Check Polygon' and 'Approve Polygon' features below to validate and approve the remaining polygons.`}
                        width="w-72 lg:w-80"
                        trigger="click"
                      >
                        <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-4 lg:w-4" />
                      </ToolTip>
                    </Text>
                    <If condition={sitePolygonData.length < total}>
                      <Then>
                        <Box sx={{ width: "100%" }}>
                          <LinearProgress sx={{ borderRadius: 5 }} />
                        </Box>
                      </Then>
                      <Else>
                        <LinearProgressBarMonitored data={dataPolygonOverview} />
                      </Else>
                    </If>
                  </div>
                </div>
                <div className="min-w-[450px] flex-[18]">
                  <div className="mb-2">
                    <Text variant="text-16-bold" className="mb-2 flex items-center gap-1 text-darkCustom">
                      Add or Edit Polygons
                    </Text>
                    <Text variant="text-14-light" className="text-darkCustom">
                      Add, remove or edit polygons that are associated to a site. Polygons may be edited in the map
                      below; exported, modified in QGIS or ArcGIS and imported again; or fed through the mobile
                      application.
                    </Text>
                  </div>
                  <div className="mt-8 flex w-[65%] gap-3">
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
                        downloadSiteGeoJsonPolygons(record?.uuid ?? "", record?.name ?? "sitePolygons");
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
              </div>
              <MapContainer
                record={record}
                entityData={{
                  name: record?.name,
                  project: record?.projectName ? { name: record.projectName } : undefined
                }}
                polygonsData={polygonDataMap}
                bbox={activeBbox}
                className="rounded-lg"
                status={true}
                setPolygonFromMap={setPolygonFromMap}
                polygonFromMap={polygonFromMap}
                showPopups
                showLegend
                mapFunctions={mapFunctions}
                tooltipType="edit"
                sitePolygonData={transformForMapContainer(sitePolygonData)}
                modelFilesData={modelFilesData}
                setIsLoadingDelayedJob={props.setIsLoadingDelayedJob}
                isLoadingDelayedJob={props.isLoadingDelayedJob}
                setAlertTitle={props.setAlertTitle}
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
                    { header: "Polygon Name", accessorKey: "polygon-name", meta: { style: { width: "14.63%" } } },
                    {
                      header: "Restoration Practice",
                      accessorKey: "restoration-practice",
                      cell: props => {
                        const placeholder = props.getValue() as string;
                        return (
                          <input
                            placeholder={placeholder}
                            className="text-14 w-full px-[10px] outline-primary placeholder:text-[currentColor]"
                          />
                        );
                      },
                      meta: { style: { width: "17.63%" } }
                    },
                    {
                      header: "Target Land Use System",
                      accessorKey: "target-land-use-system",
                      meta: { style: { width: "20.63%" } }
                    },
                    {
                      header: "Tree Distribution",
                      accessorKey: "tree-distribution",
                      meta: { style: { width: "15.63%" } }
                    },
                    {
                      header: "Planting Start Date",
                      accessorKey: "planting-start-date",
                      meta: { style: { width: "17.63%" } }
                    },
                    { header: "Source", accessorKey: "source", meta: { style: { width: "10.63%" } } },
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
              totalPolygons={total}
              siteUuid={record?.uuid}
              isLoading={loading && sitePolygonData.length === 0}
            />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </SitePolygonDataProvider>
  );
};

export default PolygonReviewTab;
