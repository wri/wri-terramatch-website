import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import ItemMonitoringCards from "@/components/extensive/PageElements/Card/ItemMonitoringCards";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useFramework } from "@/hooks/useFramework";
import ProjectArea from "@/pages/project/[uuid]/components/ProjectArea";

import { ProjectMonitoring } from "./MockedData";

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
          <div className="flex w-full">
            <div className="grid w-[50%] grid-cols-2 gap-x-8 gap-y-7 pr-20">
              <If condition={isPPC}>
                <Then>
                  <GoalProgressCard label={t("Workday Count (PPC)")} value={project.workday_count} />
                </Then>
                <Else>
                  <GoalProgressCard
                    label={t("Jobs Created")}
                    value={project.total_jobs_created}
                    limit={project.jobs_created_goal}
                  />
                </Else>
              </If>
              <GoalProgressCard label={t("Hectares Restored Goal")} value={project.total_hectares_restored_goal} />
              <GoalProgressCard
                label={t("Trees Restored")}
                value={project.trees_restored_count}
                limit={project.trees_grown_goal}
                className="flex-1"
              />
              <GoalProgressCard
                label={t("Hectares Restored")}
                value={project.trees_restored_count}
                limit={project.trees_grown_goal}
                className="flex-1"
              />
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
                {t("Add Site")}
              </Button>
            }
          >
            <ProjectArea project={project} />
          </PageCard>
        </PageColumn>
      </PageRow>

      <PageRow>
        <PageColumn>
          <PageCard title={t("Project Monitoring")} tooltip=" ">
            <div className="flex items-center justify-between">
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
            <PageRow className="mx-auto grid max-w-full grid-cols-17 gap-3 first:!col-span-4">
              {ProjectMonitoring.map((item, index) => {
                console.log(item, "item");
                return <ItemMonitoringCards item={item} key={index} />;
              })}
            </PageRow>
          </PageCard>
        </PageColumn>
      </PageRow>
      <br />
      <PageFooter />
    </PageBody>
  );
};

export default ProjectOverviewTab;
