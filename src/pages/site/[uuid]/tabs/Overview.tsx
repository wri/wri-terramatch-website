import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { When } from "react-if";

import { polygonData } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/Polygons";
import Button from "@/components/elements/Button/Button";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import ItemMonitoringCards from "@/components/elements/Cards/ItemMonitoringCard/ItemMonitoringCards";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { uploadImageData } from "@/components/extensive/Modal/ModalContent/MockedData";
import ModalSubmit from "@/components/extensive/Modal/ModalSubmit";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useModalContext } from "@/context/modal.provider";
import { useGetV2MODELUUIDImageLocations } from "@/generated/apiComponents";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useFramework } from "@/hooks/useFramework";

// import SiteArea from "../components/SiteArea";

interface SiteOverviewTabProps {
  site: any;
}

const SiteOverviewTab = ({ site }: SiteOverviewTabProps) => {
  const t = useT();
  const router = useRouter();
  // const { format } = useDate();
  const { isPPC } = useFramework(site);
  const [editPolygon, setEditPolygon] = useState(false);
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
        onClose={closeModal}
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
        onClose={closeModal}
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

  const openFormModalHandlerSubmitReviewConfirm = () => {
    openModal(
      <ModalConfirm
        commentArea
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
      />
    );
  };

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

  const openFormModalHandlerSubmitPolygon = () => {
    openModal(
      <ModalSubmit
        title="Submit Polygons"
        onClose={closeModal}
        content="Project Developers may submit one or all polygons for review."
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
        site={site}
      ></ModalSubmit>
    );
  };

  const polygonStatusLabels = [
    { id: "1", label: "Site Approved" },
    { id: "2", label: "Polygons Submitted" },
    { id: "3", label: "Polygons Approved" },
    { id: "4", label: "Monitoring Begins" }
  ];

  const itemsPrimaryMenu = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          Create Polygons
        </Text>
      ),
      onClick: () => {
        console.log("Create Polygons", editPolygon);
        setEditPolygon(true);
      }
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          Upload Data
        </Text>
      ),
      onClick: () => openFormModalHandlerAddPolygon()
    },
    {
      id: "3",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          Upload Images
        </Text>
      ),
      onClick: () => openFormModalHandlerUploadImages()
    }
  ];
  const itemsSubmitPolygon = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          Request Support
        </Text>
      ),
      onClick: () => openFormModalHandlerRequestPolygonSupport()
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          Submit for Review
        </Text>
      ),
      onClick: () => openFormModalHandlerSubmitPolygon()
    }
  ];

  // const landUseTypesOptions = useGetOptions(site.land_use_types);
  // const restorationStrategyOptions = useGetOptions(site.restoration_strategy);

  const { data: allImages } = useGetV2MODELUUIDImageLocations({
    pathParams: { model: "sites", uuid: site.uuid }
  });
  console.debug(allImages);
  // const imagesGeoJson =
  //   allImages?.data?.length! > 0
  //     ? {
  //         type: "FeatureCollection",
  //         features: allImages?.data?.map(image => ({
  //           type: "Feature",
  //           properties: {
  //             id: image.uuid,
  //             image_url: image.thumb_url
  //           },
  //           geometry: {
  //             type: "Point",
  //             coordinates: [image.location?.lng, image.location?.lat]
  //           }
  //         }))
  //       }
  //     : undefined;

  // const geoJSON = useMemo(() => {
  //   try {
  //     if (site.boundary_geojson) {
  //       return JSON.parse(site.boundary_geojson);
  //     }
  //   } catch (e) {
  //     return undefined;
  //   }
  //   return undefined;
  // }, [site]);

  return (
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

        {/* <PageCard title={t("Site Area")} tooltip=" ">
          <Map className="rounded-lg" geojson={geoJSON} imageLayerGeojson={imagesGeoJson} />
        </PageCard> */}
      </PageRow>
      <PageRow>
        <PageColumn>
          <PageCard
            title={t("Site Area")}
            tooltip="Lorem ipsum dolor sit amet, urna neque viverra justo nec ultrices dui sapien eget mi proin sed libero."
          >
            <div className="flex gap-11 ">
              <div className="w-[54%]">
                <Text variant="text-14-light" className="mb-6">
                  Add, remove or edit polygons associated to a site. Polygons may be edited in the map below; exported,
                  modified in QGIS or ArcGIS and imported again; or fed through the mobile application.
                </Text>
                <div className="flex w-full gap-3">
                  <Menu placement={MENU_PLACEMENT_BOTTOM_BOTTOM} menu={itemsPrimaryMenu}>
                    <Button variant="white-border" className="" onChange={() => {}}>
                      <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
                      &nbsp; Add Data
                    </Button>
                  </Menu>
                  <Button variant="white-border" className="" onChange={() => {}}>
                    <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4" />
                    &nbsp; Download
                  </Button>
                  <Menu placement={MENU_PLACEMENT_BOTTOM_BOTTOM} menu={itemsSubmitPolygon}>
                    <Button variant="primary" className="" onChange={() => {}}>
                      SUBMIT Polygons
                    </Button>
                  </Menu>
                </div>
              </div>

              <div className="w-[46%] rounded-lg border border-neutral-200 p-4">
                <Text variant="text-14" className="mb-2">
                  Polygon Status
                </Text>
                <StepProgressbar color="primary" value={80} labels={polygonStatusLabels} classNameLabels="" />
              </div>
            </div>
            {/* <SiteArea sites={site} setEditPolygon={setEditPolygon} editPolygon={editPolygon} /> */}
          </PageCard>
        </PageColumn>
      </PageRow>
      {/* Old Site Information */}
      {/* <PageRow>
        <PageColumn>
          <PageCard title={t("Site Information")} gap={8}>
            <SelectImageListField
              title={t("Target Land Use Types")}
              options={landUseTypesOptions}
              selectedValues={site.land_use_types}
            />
            <SelectImageListField
              title={t("Restoration Strategies")}
              options={restorationStrategyOptions}
              selectedValues={site.restoration_strategy}
            />
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Site Details")} gap={4}>
            <TextField label={t("Site Name")} value={site?.name} />
            <When condition={isPPC}>
              <TextField label={t("Site type")} value={site?.control_site ? t("Control Site") : t("Site")} />
            </When>
            <TextField label={t("Planting start date")} value={format(site.start_date)} />
            <TextField label={t("Planting end date")} value={format(site.start_date)} />
            <TextField label={t("Last Updated")} value={format(site.updated_at)} />
          </PageCard>
          <Paper>
            <ButtonField
              label={t("Tree Monitoring")}
              subtitle={t(
                "Tree monitoring must be completed for each site at baseline, 2.5 years and 5 years. Tree monitoring data is used to calculate the number of trees, natural regeneration, and survival rate of planted trees."
              )}
              buttonProps={{
                as: Link,
                variant: "secondary",
                children: t("View"),
                href: "https://ee.kobotoolbox.org/x/NKctF6KV"
              }}
            />
          </Paper>
        </PageColumn> 
      </PageRow>*/}
      <PageRow>
        <PageColumn>
          <PageCard
            title={t("Project Monitoring")}
            tooltip="Lorem ipsum dolor sit amet, urna neque viverra justo nec ultrices dui sapien eget mi proin sed libero."
          >
            <div className="flex items-center justify-between text-darkCustom">
              <Text variant="text-14-light" className="w-[65%]">
                Select all or specific sites to view remote sensing analytics such as tree counts, NDVI, and other
                metrics useful for assessing the impact of the restoration effort.
              </Text>
              <div className="relative w-[25%]">
                <Dropdown
                  containerClassName="w-full"
                  placeholder="All Polygons"
                  options={[
                    {
                      title: "All Polygons",
                      value: 1
                    },
                    {
                      title: "All Polygons2",
                      value: 2
                    }
                  ]}
                  value={["All Polygons"]}
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
                leyends={[
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
  );
};

export default SiteOverviewTab;
