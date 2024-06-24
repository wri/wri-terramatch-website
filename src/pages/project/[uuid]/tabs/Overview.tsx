import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import ItemMonitoringCards from "@/components/elements/Cards/ItemMonitoringCard/ItemMonitoringCards";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useFramework } from "@/hooks/useFramework";

interface ProjectOverviewTabProps {
  project: any;
}

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  const t = useT();
  const router = useRouter();
  const { isPPC } = useFramework(project);

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
              href={`/project/${router.query.uuid}?tab=goals`}
              shallow
            >
              {t("View all")}
            </Button>
          }
        >
          <div className="flex w-full text-darkCustom">
            <div className="grid w-[50%] grid-cols-2 gap-x-8 gap-y-7 pr-20">
              <If condition={isPPC}>
                <Then>
                  <GoalProgressCard label={t("Workday Count (PPC)")} value={project.self_reported_workday_count} />
                </Then>
                <Else>
                  <GoalProgressCard
                    label={t("Jobs Created")}
                    value={project.total_jobs_created}
                    limit={project.jobs_created_goal}
                  />
                </Else>
              </If>
              <GoalProgressCard
                label={t("Trees Restored")}
                value={project.trees_restored_count}
                limit={project.trees_grown_goal}
                className="flex-1"
              />
              <GoalProgressCard label={t("Hectares Restored Goal")} value={project.total_hectares_restored_goal} />
            </div>
            <div>
              <GoalProgressCard
                label={t("Hectares Restored")}
                hasProgress={false}
                items={[
                  { iconName: IconNames.TREE_CIRCLE, label: t("Trees Planted"), value: project.trees_planted_count },
                  { iconName: IconNames.LEAF_CIRCLE, label: t("Seeds Planted"), value: project.seeds_planted_count },
                  {
                    iconName: IconNames.REFRESH_CIRCLE,
                    label: t("Trees Regenerating"),
                    value: project.regenerated_trees_count
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
            title={t("Project Area")}
            headerChildren={
              <Button
                as={Link}
                variant="secondary"
                href={`/entity/sites/create/${project.framework_uuid}?parent_name=projects&parent_uuid=${project.uuid}`}
              >
                {t("Add New Site")}
              </Button>
            }
          >
            <OverviewMapArea entityModel={project} type="projects" />
          </PageCard>
        </PageColumn>
      </PageRow>

      <PageRow>
        <PageColumn>
          <PageCard title={t("Project Monitoring")} tooltip={t("Project Monitoring")}>
            <div className="flex items-center justify-between text-darkCustom">
              <Text variant="text-14-light" className="w-[65%]">
                {t(`Select all or specific sites to view remote sensing analytics such as tree counts, NDVI, and other
                metrics useful for assessing the impact of the restoration effort.`)}
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

export default ProjectOverviewTab;
