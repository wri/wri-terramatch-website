import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import LongTextField from "@/components/elements/Field/LongTextField";
import SelectImageListField from "@/components/elements/Field/SelectImageListField";
import TextField from "@/components/elements/Field/TextField";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { getCountriesOptions } from "@/constants/options/countries";
import { useDate } from "@/hooks/useDate";
import { useFramework } from "@/hooks/useFramework";
import { useGetOptions } from "@/hooks/useGetOptions";
import ProjectArea from "@/pages/project/[uuid]/components/ProjectArea";
import { formatOptionsList } from "@/utils/options";

interface ProjectOverviewTabProps {
  project: any;
}

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  const t = useT();
  const router = useRouter();
  const { isPPC } = useFramework(project);
  const { format } = useDate();
  const landUseTypesOptions = useGetOptions(project.land_use_types);
  const restorationStrategyOptions = useGetOptions(project.restoration_strategy);

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
          <div className="flex w-full flex-wrap gap-6">
            <If condition={isPPC}>
              <Then>
                <GoalProgressCard label={t("Workday (PPC)")} value={project.workday_count} className="w-[170px]" />
              </Then>
              <Else>
                <GoalProgressCard
                  label={t("Jobs Created")}
                  value={project.total_jobs_created}
                  limit={project.jobs_created_goal}
                  className="w-[170px]"
                />
              </Else>
            </If>
            <GoalProgressCard
              label={t("Hectares Restored Goal")}
              value={project.total_hectares_restored_goal}
              className="w-[170px]"
            />
            <GoalProgressCard
              label={t("Trees restored")}
              value={project.trees_restored_count}
              limit={project.trees_grown_goal}
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
        </PageCard>
      </PageRow>

      <PageRow>
        <PageColumn>
          <PageCard title={t("Project Information")} gap={8}>
            <LongTextField title={t("Description")}>{project.description}</LongTextField>
            <LongTextField title={t("History")}>{project.history}</LongTextField>
            <SelectImageListField
              title={t("Target Land Use Types")}
              options={landUseTypesOptions}
              selectedValues={project.land_use_types}
            />
            <SelectImageListField
              title={t("Restoration Strategies")}
              options={restorationStrategyOptions}
              selectedValues={project.restoration_strategy}
            />
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Project Details")} gap={4}>
            <TextField
              label={t("Location")}
              value={project.country && formatOptionsList(getCountriesOptions(t), project.country)}
            />
            <TextField label={t("Planting Start Date")} value={format(project.planting_start_date)} />
            <TextField label={t("Planting End Date")} value={format(project.planting_end_date)} />
            <TextField label={t("Project Last Updated")} value={format(project.updated_at)} />
          </PageCard>
        </PageColumn>
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
    </PageBody>
  );
};

export default ProjectOverviewTab;
