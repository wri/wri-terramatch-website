import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ModalIdentified from "@/admin/components/extensive/Modal/ModalIdentified";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import AddDataButton from "@/admin/components/ResourceTabs/PolygonReviewTab/components/AddDataButton";
import Button from "@/components/elements/Button/Button";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { downloadSiteGeoJsonPolygons } from "@/components/elements/Map-mapbox/utils";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalSubmit from "@/components/extensive/Modal/ModalSubmit";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { prepareGeometryForUpload, useUploadGeometry } from "@/connections/GeometryUpload";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import {
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile,
  fetchPutV2SitePolygonStatusBulk
} from "@/generated/apiComponents";
import { SitePolygonsDataResponse, SitePolygonsLoadedDataResponse } from "@/generated/apiSchemas";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useStatusActionsMap } from "@/hooks/AuditStatus/useStatusActionsMap";
import { FileType, UploadedFile } from "@/types/common";
import { getErrorMessageFromPayload } from "@/utils/errors";
import Log from "@/utils/log";

import GoalsAndProgressEntityTab from "../components/GoalsAndProgressEntityTab";
import SiteArea from "../components/SiteArea";

interface SiteOverviewTabProps {
  site: SiteFullDto;
  refetch?: () => void;
}

const ContentForSubmission = ({ siteName, polygons }: { siteName: string; polygons: SitePolygonsDataResponse }) => {
  const t = useT();
  return (
    <>
      <Text
        variant="text-12-light"
        as="p"
        className="text-center"
        dangerouslySetInnerHTML={{
          __html: t(`Are your sure you want to submit your polygons for the site <strong> {siteName}. </strong> ?`, {
            siteName: siteName
          })
        }}
      />
      <div className="ml-6">
        <ul style={{ listStyleType: "circle" }}>
          {(polygons as SitePolygonsDataResponse)?.map(polygon => (
            <li key={polygon.id}>
              <Text variant="text-12-light" as="p">
                {polygon?.poly_name ?? t("Unnamed Polygon")}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const SiteOverviewTab = ({ site, refetch: refetchEntity }: SiteOverviewTabProps) => {
  const t = useT();
  const router = useRouter();
  const [editPolygon, setEditPolygon] = useState(false);
  const contextMapArea = useMapAreaContext();
  const {
    isMonitoring,
    checkIsMonitoringPartner,
    setSiteData,
    setShouldRefetchPolygonData,
    setSelectedPolygonsInCheckbox,
    polygonData: polygonList
  } = contextMapArea;
  const { openModal, closeModal } = useModalContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);
  const { openNotification } = useNotificationContext();
  const { hideLoader } = useLoading();
  const uploadGeometry = useUploadGeometry({});

  const [polygonLoaded, setPolygonLoaded] = useState<boolean>(false);
  const [submitPolygonLoaded, setSubmitPolygonLoaded] = useState<boolean>(false);
  const { data: sitePolygonDataV3, refetch: refetchV3 } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: !!site.uuid
  });
  const reload = () => {
    refetchV3();
  };
  useEffect(() => {
    setSiteData(site);
    if (site.projectUuid) {
      checkIsMonitoringPartner(site.projectUuid);
    }
  }, [checkIsMonitoringPartner, setSiteData, site]);

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
      closeModal(ModalId.ADD_POLYGONS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, saveFlags]);

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.fileName.split(".").pop()?.toLowerCase();
    return ["geojson", "zip", "kml"].includes(fileType as string) ? (fileType == "zip" ? "shapefile" : fileType) : null;
  };

  const uploadFiles = async () => {
    const siteUuid = site.uuid;

    if (!polygonLoaded) {
      const uploadPromises = files.map(
        file =>
          new Promise((resolve, reject) => {
            const fileToUpload = file.rawFile as File;
            const attributes = prepareGeometryForUpload(fileToUpload, siteUuid);

            (uploadGeometry as any)(attributes, {
              onSuccess: (response: any) => resolve(response),
              onError: (error: any) => reject(error)
            });
          })
      );

      try {
        await Promise.all(uploadPromises);
        setShouldRefetchPolygonData(true);
        openNotification("success", t("Success!"), t("File uploaded successfully"));
        closeModal(ModalId.UPLOAD_IMAGES);
      } catch (error) {
        const errorMessage =
          error && typeof error === "object" && "message" in error
            ? (error.message as string)
            : t("An unknown error occurred");
        openNotification("error", t("Error uploading file"), errorMessage);
      } finally {
        setPolygonLoaded(false);
        setSubmitPolygonLoaded(false);
        hideLoader();
      }
      return;
    }

    const uploadPromises = [];
    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      const formData = new FormData();
      const fileType = getFileType(file);
      formData.append("file", fileToUpload);
      formData.append("uuid", siteUuid);
      formData.append("polygon_loaded", polygonLoaded.toString());
      formData.append("submit_polygon_loaded", submitPolygonLoaded.toString());
      const newRequest: any = formData;

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
      openFormModalHandlerIdentifiedPolygons(promise);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        let errorMessage = (error as { message: string }).message;
        const parsedMessage = JSON.parse(errorMessage);
        if (parsedMessage && typeof parsedMessage === "object" && "message" in parsedMessage) {
          errorMessage = parsedMessage.message;
        }
        openNotification("error", t("Error uploading file"), errorMessage);
      } else {
        const errorMessage = getErrorMessageFromPayload(error);
        openNotification("error", t("Error uploading file"), t(errorMessage));
      }
    } finally {
      setPolygonLoaded(false);
      setSubmitPolygonLoaded(false);
      hideLoader();
    }
  };

  const openFormModalHandlerAddPolygon = () => {
    setPolygonLoaded(false);
    setSubmitPolygonLoaded(false);
    openModal(
      ModalId.ADD_POLYGONS,
      <ModalAdd
        title={t("Add Polygons")}
        descriptionInput={`${t("Drag and drop a GeoJSON, Shapefile, or KML for your site")} ${site?.name}.`}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">{t("TerraMatch upload limits")}:&nbsp;</Text>
            <Text variant="text-12-light">{t("50 MB per upload")}</Text>
          </div>
        }
        onClose={() => closeModal(ModalId.ADD_POLYGONS)}
        content={t("Start by adding polygons to your site.")}
        primaryButtonText={t("Save")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            setSaveFlags(true);
          }
        }}
        acceptedTypes={FileType.AcceptedShapefiles.split(",") as FileType[]}
        maxFileSize={2 * 1024 * 1024}
        setErrorMessage={(message: string) => openNotification("error", t("Error uploading file"), t(message))}
        setFile={setFiles}
      ></ModalAdd>
    );
  };

  const openFormModalHandlerUploadImages = () => {
    openModal(
      ModalId.UPLOAD_IMAGES,
      <ModalAdd
        title={t("Upload Images")}
        variantFileInput={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES}
        descriptionInput={t(
          "Drag and drop a geotagged or non-geotagged PNG, GIF or JPEG for your site Tannous/Brayton Road."
        )}
        descriptionList={
          <Text variant="text-12-bold" className="mt-9 ">
            {t("Uploaded Files")}
          </Text>
        }
        onClose={() => closeModal(ModalId.UPLOAD_IMAGES)}
        content={t("Start by adding images for processing.")}
        primaryButtonText={t("Save")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => closeModal(ModalId.UPLOAD_IMAGES)
        }}
      ></ModalAdd>
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
            downloadSiteGeoJsonPolygons(site?.uuid, site?.name ?? "");
          }
        }}
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
          closeModal(ModalId.REPLACEMENT_POLYGONS);
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

  const openFormModalHandlerSubmitReviewConfirm = (polygons: unknown) => {
    openModal(
      ModalId.CONFIRM_POLYGON_SUBMISSION,
      <ModalConfirm
        commentArea
        className="max-w-xs"
        title={t("Confirm Polygon Submission")}
        content={<ContentForSubmission polygons={polygons as SitePolygonsDataResponse} siteName={site.name ?? ""} />}
        onClose={() => closeModal(ModalId.CONFIRM_POLYGON_SUBMISSION)}
        onConfirm={async data => {
          closeModal(ModalId.CONFIRM_POLYGON_SUBMISSION);
          try {
            await fetchPutV2SitePolygonStatusBulk({
              body: {
                comment: data,
                updatePolygons: (polygons as SitePolygonsDataResponse).map(polygon => {
                  return { uuid: polygon.uuid, status: "submitted" };
                })
              }
            });
            setShouldRefetchPolygonData(true);
            openNotification("success", t("Success! Your polygons were submitted."));
          } catch (error) {
            Log.error("Failed to fetch polygon statuses", error);
          }
        }}
      />
    );
  };

  const openFormModalHandlerSubmitPolygon = () => {
    openModal(
      ModalId.SUBMIT_POLYGONS,
      <ModalSubmit
        title={t("Submit Polygons")}
        onClose={() => closeModal(ModalId.SUBMIT_POLYGONS)}
        content={t("Project Developers may submit one, many, or all polygons for review.")}
        primaryButtonText={t("Next")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: (polygons: unknown) => {
            closeModal(ModalId.SUBMIT_POLYGONS);
            openFormModalHandlerSubmitReviewConfirm(polygons);
          }
        }}
        secondaryButtonText={t("Cancel")}
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.SUBMIT_POLYGONS)
        }}
        site={site}
        polygonList={polygonList}
      />,
      true
    );
  };

  const { valuesForStatus, statusLabels } = useStatusActionsMap(AuditLogButtonStates.SITE);

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonDataV3} reloadSiteData={reload}>
      <PageBody>
        <PageRow>
          <PageCard
            title={t("Progress & Goals")}
            headerChildren={
              <Button
                as={Link}
                variant="secondary"
                className="m-auto"
                href={getEntityDetailPageLink("sites", router.query.uuid as string, "goals")}
                shallow
              >
                {t("View all")}
              </Button>
            }
          >
            <GoalsAndProgressEntityTab entity={site} />
          </PageCard>
        </PageRow>
        <PageRow>
          <PageColumn>
            <PageCard title={t("Site Area")}>
              <div className="flex gap-11 ">
                <div className="w-[54%]">
                  <Text variant="text-14-light" className="mb-6">
                    {t("Use the map below to view, add, remove or edit polygons associated to a site. ")}
                    <a
                      className="text-14-light text-primary-500 hover:underline"
                      target="_blank"
                      href={
                        "https://terramatchsupport.zendesk.com/hc/en-us/articles/27065988566811-How-to-Add-Polygons-to-TerraMatch-Sites"
                      }
                      rel="noreferrer"
                    >
                      {t("Access our guide for adding polygons to a site on TerraMatch here.")}
                    </a>
                  </Text>
                  <div className="flex w-full gap-3">
                    {isMonitoring && (
                      <AddDataButton
                        openFormModalHandlerAddPolygon={openFormModalHandlerAddPolygon}
                        openFormModalHandlerUploadImages={openFormModalHandlerUploadImages}
                        openFormModalHandlerAddPolygons={openFormModalHandlerAddPolygons}
                      />
                    )}
                    <Button
                      variant="white-border"
                      className=""
                      onClick={() => {
                        setSelectedPolygonsInCheckbox([]);
                        downloadSiteGeoJsonPolygons(site?.uuid, site?.name ?? "");
                      }}
                    >
                      <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4" />
                      &nbsp; {t("Download")}
                    </Button>
                    {isMonitoring && (
                      <Button
                        variant="primary"
                        className=""
                        onClick={() => {
                          openFormModalHandlerSubmitPolygon();
                          setSelectedPolygonsInCheckbox([]);
                        }}
                      >
                        {t("SUBMIT Polygons")}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="w-[46%]">
                  <StepProgressbar
                    color="secondary"
                    value={valuesForStatus?.(site?.status as string) ?? 0}
                    labels={statusLabels}
                    classNameLabels="min-w-[99px]"
                    className={"w-[98%] pl-[1%]"}
                  />
                </div>
              </div>
              <SiteArea
                sites={site}
                setEditPolygon={setEditPolygon}
                editPolygon={editPolygon}
                refetch={refetchEntity}
              />
            </PageCard>
          </PageColumn>
        </PageRow>
        <br />
        <br />
      </PageBody>
    </SitePolygonDataProvider>
  );
};

export default SiteOverviewTab;
