import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { When } from "react-if";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import AddDataButton from "@/admin/components/ResourceTabs/PolygonReviewTab/components/AddDataButton";
import Button from "@/components/elements/Button/Button";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import ItemMonitoringCards from "@/components/elements/Cards/ItemMonitoringCard/ItemMonitoringCards";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { downloadSiteGeoJsonPolygons } from "@/components/elements/Map-mapbox/utils";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import Notification from "@/components/elements/Notification/Notification";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import ModalSubmit from "@/components/extensive/Modal/ModalSubmit";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import {
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile,
  fetchPutV2SitePolygonStatusBulk,
  useGetV2SitesSitePolygon
} from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { statusActionsMap } from "@/hooks/AuditStatus/useAuditLogActions";
import { useFramework } from "@/hooks/useFramework";
import { FileType, UploadedFile } from "@/types/common";

import SiteArea from "../components/SiteArea";

interface SiteOverviewTabProps {
  site: any;
}

const SiteOverviewTab = ({ site }: SiteOverviewTabProps) => {
  const t = useT();
  const router = useRouter();
  const { isPPC } = useFramework(site);
  const [editPolygon, setEditPolygon] = useState(false);
  const contextMapArea = useMapAreaContext();
  const { isMonitoring, checkIsMonitoringPartner, setSiteData, setShouldRefetchPolygonData } = contextMapArea;
  const { openModal, closeModal } = useModalContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState<boolean>(false);
  const [polygonsForSubmissions, setPolygonsForSubmissions] = useState<SitePolygonsDataResponse>([]);
  const { data: sitePolygonData, refetch } = useGetV2SitesSitePolygon<SitePolygonsDataResponse>({
    pathParams: {
      site: site.uuid
    }
  });
  useEffect(() => {
    setSiteData(site);
    if (site.project?.uuid) {
      checkIsMonitoringPartner(site.project?.uuid);
    }
  }, [site]);

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
    }
  }, [files, saveFlags]);

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.file_name.split(".").pop()?.toLowerCase();
    if (fileType === "geojson") return "geojson";
    if (fileType === "zip") return "shapefile";
    if (fileType === "kml") return "kml";
    return null;
  };

  const uploadFiles = async () => {
    const uploadPromises = [];

    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      const site_uuid = site.uuid;
      const formData = new FormData();
      const fileType = getFileType(file);
      formData.append("file", fileToUpload);
      formData.append("uuid", site_uuid);
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

    await Promise.all(uploadPromises);

    setShouldRefetchPolygonData(true);
    closeModal();
  };

  const openFormModalHandlerAddPolygon = () => {
    openModal(
      <ModalAdd
        title={t("Add Polygons")}
        descriptionInput={`${t("Drag and drop a GeoJSON, Shapefile, or KML for your site")} ${site?.name}.`}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">{t("TerraMatch upload limits")}:&nbsp;</Text>
            <Text variant="text-12-light">{t("50 MB per upload")}</Text>
          </div>
        }
        onClose={closeModal}
        content={t("Start by adding polygons to your site.")}
        primaryButtonText={t("Save")}
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: () => setSaveFlags(true) }}
        acceptedTYpes={FileType.ShapeFiles.split(",") as FileType[]}
        setFile={setFiles}
      ></ModalAdd>
    );
  };

  const openFormModalHandlerUploadImages = () => {
    openModal(
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
        onClose={closeModal}
        content={t("Start by adding images for processing.")}
        primaryButtonText={t("Save")}
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      ></ModalAdd>
    );
  };

  const openFormModalHandlerSubmitReviewConfirm = (polygons: unknown) => {
    openModal(
      <ModalConfirm
        commentArea
        className="max-w-xs"
        title={t("Confirm Polygon Submission")}
        content={
          <div className="ml-6">
            <ul style={{ listStyleType: "circle" }}>
              {(polygons as SitePolygonsDataResponse)?.map(polygon => (
                <li key={polygon.id}>
                  <Text variant="text-12-light" as="p">
                    {polygon?.poly_name}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        }
        onClose={closeModal}
        onConfirm={async data => {
          closeModal();
          try {
            await fetchPutV2SitePolygonStatusBulk({
              body: {
                comment: data,
                updatePolygons: polygonsForSubmissions.map(polygon => {
                  return { uuid: polygon.uuid, status: polygon.status };
                })
              }
            });
            setShowSubmissionSuccess(true);
            setTimeout(() => {
              setShowSubmissionSuccess(false);
            }, 3000);
          } catch (error) {
            console.log(error);
          }
        }}
      />
    );
  };

  const openFormModalHandlerSubmitPolygon = () => {
    openModal(
      <ModalSubmit
        title={t("Submit Polygons")}
        onClose={closeModal}
        content={t("Project Developers may submit one, many, or all polygons for review.")}
        primaryButtonText={t("Next")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: (polygons: unknown) => {
            setPolygonsForSubmissions(polygons as SitePolygonsDataResponse);
            closeModal();
            openFormModalHandlerSubmitReviewConfirm(polygons);
          }
        }}
        secondaryButtonText={t("Cancel")}
        secondaryButtonProps={{ className: "px-8 py-3", variant: "white-page-admin", onClick: closeModal }}
        site={site}
      />
    );
  };

  const itemsSubmitPolygon = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          {t("Request Support")}
        </Text>
      ),
      onClick: () => {}
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          {t("Submit for Review")}
        </Text>
      ),
      onClick: () => openFormModalHandlerSubmitPolygon()
    }
  ];

  const { valuesForStatus, statusLabels } = statusActionsMap[AuditLogButtonStates.SITE];

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonData} reloadSiteData={refetch}>
      <Notification
        open={showSubmissionSuccess}
        title={t("Success, Your Polygons were submitted!")}
        message={t(
          "Admins have been notified and a confirmation email has been sent. Follow-up through the Audit Log."
        )}
        type="success"
      />
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
            <div className="flex w-full">
              <div className="grid w-[50%] grid-cols-2 content-start gap-x-8 gap-y-7 pr-20">
                <When condition={isPPC}>
                  <GoalProgressCard label={t("Workday Count (PPC)")} value={site.workday_count} />
                </When>
                <GoalProgressCard label={t("Hectares Restored Goal")} value={site.hectares_to_restore_goal} />
              </div>
              <div>
                <GoalProgressCard
                  label={t("Trees restored")}
                  hasProgress={false}
                  items={[
                    { iconName: IconNames.TREE_CIRCLE, label: t("Trees Planted"), value: site.trees_planted_count },
                    { iconName: IconNames.LEAF_CIRCLE, label: t("Seeds Planted"), value: site.seeds_planted_count },
                    {
                      iconName: IconNames.REFRESH_CIRCLE,
                      label: t("Trees Regenerating"),
                      value: site.regenerated_trees_count
                    }
                  ]}
                  className="flex-1"
                />
              </div>
            </div>
          </PageCard>
        </PageRow>
        <PageRow>
          <PageColumn>
            <PageCard title={t("Site Area")}>
              <div className="flex gap-11 ">
                <div className="w-[54%]">
                  <Text variant="text-14-light" className="mb-6">
                    {t(
                      "Add, remove or edit polygons associated to a site. Polygons may be edited in the map below; exported, modified in QGIS or ArcGIS and imported again; or fed through the mobile application."
                    )}
                  </Text>
                  <div className="flex w-full gap-3">
                    {isMonitoring && (
                      <AddDataButton
                        openFormModalHandlerAddPolygon={openFormModalHandlerAddPolygon}
                        openFormModalHandlerUploadImages={openFormModalHandlerUploadImages}
                      />
                    )}
                    <Button
                      variant="white-border"
                      className=""
                      onClick={() => {
                        downloadSiteGeoJsonPolygons(site?.uuid);
                      }}
                    >
                      <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4" />
                      &nbsp; {t("Download")}
                    </Button>
                    {isMonitoring && (
                      <Menu placement={MENU_PLACEMENT_BOTTOM_BOTTOM} menu={itemsSubmitPolygon}>
                        <Button variant="primary" className="" onChange={() => {}}>
                          {t("SUBMIT Polygons")}
                        </Button>
                      </Menu>
                    )}
                  </div>
                </div>
                <div className="w-[46%]">
                  <StepProgressbar
                    color="secondary"
                    value={valuesForStatus?.(site?.status) ?? 0}
                    labels={statusLabels}
                    classNameLabels="min-w-[99px]"
                    className={"w-[98%] pl-[1%]"}
                  />
                </div>
              </div>
              <SiteArea sites={site} setEditPolygon={setEditPolygon} editPolygon={editPolygon} />
            </PageCard>
          </PageColumn>
        </PageRow>
        <PageRow>
          <PageColumn>
            <PageCard title={t("Project Monitoring")}>
              <div className="flex items-center justify-between text-darkCustom">
                <Text variant="text-14-light" className="w-[65%]">
                  {t(
                    "Select all or specific sites to view remote sensing analytics such as tree counts, NDVI, and other metrics useful for assessing the impact of the restoration effort."
                  )}
                </Text>
                <div className="relative w-[25%]">
                  <Dropdown
                    containerClassName="w-full"
                    placeholder={t("All Polygons")}
                    options={[]}
                    value={[]}
                    onChange={() => {}}
                  />
                </div>
              </div>
              <PageRow className="mx-auto grid max-w-full grid-cols-17 gap-3">
                <ItemMonitoringCards title={t("Tree Count")} className="col-span-4" value="462" />
                <ItemMonitoringCards title={t("Tree Cover 2024")} className="col-span-3" value="53.23%" />
                <ItemMonitoringCards title={t("Total Area (ha)")} className="col-span-3" value="300.12" />
                <ItemMonitoringCards title={t("Lookback Disturbance")} className="col-span-3" value="2.1%" />
                <ItemMonitoringCards className="col-span-4" type="map" />
                <ItemMonitoringCards
                  title={t("Tree Count")}
                  className="col-span-4"
                  type="graph"
                  img={IconNames.GRAPH1}
                  legends={[
                    {
                      color: "bg-blueCustom",
                      title: t("Average Number of Trees per hectare")
                    },
                    {
                      color: "bg-primary",
                      title: t("Number of Trees")
                    }
                  ]}
                />
                <ItemMonitoringCards
                  title={t("EMA SNOVO")}
                  type="graph-button"
                  className="col-span-9 row-span-2"
                  img={IconNames.GRAPH2}
                />
                <ItemMonitoringCards
                  title={t("Tree Cover Loss (ha)")}
                  className="col-span-4"
                  type="graph"
                  img={IconNames.GRAPH3}
                />
                <ItemMonitoringCards
                  title={t("Interventions (ha)")}
                  className="col-span-4"
                  type="graph"
                  legends={[
                    {
                      color: "bg-black",
                      title: t("Agroforestry")
                    },
                    {
                      color: "bg-blueCustom",
                      title: t("Silvipasture")
                    },
                    {
                      color: "bg-primary",
                      title: t("Tree Planting")
                    }
                  ]}
                  img={IconNames.GRAPH4}
                />
                <ItemMonitoringCards
                  title={t("Tree Cover Loss")}
                  className="col-span-4"
                  type="graph"
                  legends={[
                    {
                      color: "bg-blueCustom",
                      title: t("Tree Cover Loss by Fires (ha)")
                    },
                    {
                      color: "bg-primary",
                      title: t("Tree Cover Loss by Non-Fires (ha)")
                    }
                  ]}
                  img={IconNames.GRAPH5}
                />
              </PageRow>
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
