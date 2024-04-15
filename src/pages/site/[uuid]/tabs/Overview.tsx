import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import ItemMonitoringCards from "@/components/extensive/PageElements/Card/ItemMonitoringCards";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useGetV2MODELUUIDImageLocations } from "@/generated/apiComponents";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useFramework } from "@/hooks/useFramework";

import SiteArea from "../components/SiteArea";

interface SiteOverviewTabProps {
  site: any;
}

const SiteOverviewTab = ({ site }: SiteOverviewTabProps) => {
  const t = useT();
  const router = useRouter();
  // const { format } = useDate();
  const { isPPC } = useFramework(site);
  const [editPolygon, setEditPolygon] = useState(false);

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
        console.log("Create Polygons");
        setEditPolygon(true);
      }
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          Upload Data
        </Text>
      )
    },
    {
      id: "3",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          Upload Images
        </Text>
      )
    }
  ];
  const itemsSubmitPolygon = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          Request Support
        </Text>
      )
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center ">
          Submit for Review
        </Text>
      )
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
                <GoalProgressCard label={t("Workday Count (PPC)")} value={site.workday_count} className="" />
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
          <PageCard title={t("Site Area")} tooltip=" ">
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

              <div className="w-[46%] rounded border border-neutral-200 p-4">
                <Text variant="text-14" className="mb-2">
                  Polygon Status
                </Text>
                <StepProgressbar color="primary" value={80} labels={polygonStatusLabels} classNameLabels="" />
              </div>
            </div>
            <SiteArea sites={site} setEditPolygon={setEditPolygon} editPolygon={editPolygon} />
          </PageCard>
        </PageColumn>
      </PageRow>
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
          <PageCard title={t("Project Monitoring")} tooltip=" ">
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
                leyends={[
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
                leyends={[
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
