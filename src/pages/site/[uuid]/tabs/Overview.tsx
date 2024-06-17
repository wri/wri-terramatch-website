import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import ItemMonitoringCards from "@/components/elements/Cards/ItemMonitoringCard/ItemMonitoringCards";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { downloadSiteGeoJsonPolygons } from "@/components/elements/Map-mapbox/utils";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useFramework } from "@/hooks/useFramework";

import SiteArea from "../components/SiteArea";

interface SiteOverviewTabProps {
  site: any;
}

const SiteOverviewTab = ({ site }: SiteOverviewTabProps) => {
  const t = useT();
  const router = useRouter();
  const { isPPC } = useFramework(site);
  const [editPolygon, setEditPolygon] = useState(false);

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
                  <Button
                    variant="white-border"
                    className=""
                    onClick={() => {
                      downloadSiteGeoJsonPolygons(site?.uuid);
                    }}
                  >
                    <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4" />
                    &nbsp; Download
                  </Button>
                </div>
              </div>
            </div>
            <SiteArea sites={site} setEditPolygon={setEditPolygon} editPolygon={editPolygon} />
          </PageCard>
        </PageColumn>
      </PageRow>
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
  );
};

export default SiteOverviewTab;
