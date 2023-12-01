import { useT } from "@transifex/react";
import { Else, If, Then, When } from "react-if";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import GenericField from "@/components/elements/Field/GenericField";
import TextField from "@/components/elements/Field/TextField";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { useFramework } from "@/hooks/useFramework";

interface GoalsAndProgressProps {
  project: any;
}

const GoalsAndProgressTab = ({ project }: GoalsAndProgressProps) => {
  const t = useT();
  const { isPPC } = useFramework(project);

  return (
    <PageBody>
      <PageRow>
        <PageCard title={t("Progress & Goals")}>
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
          <PageCard
            title={t("Monitored Data")}
            gap={4}
            isEmpty={true}
            emptyStateProps={{
              title: t("Satellite Data Baseline Unavailable"),
              content: t(
                "WRI Monitoring Data will be available soon. We will notify you once this data has been integrated into your project."
              )
            }}
          >
            {/* TODO: To be implemented when endpoint is ready */}
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Other Goals")} gap={4}>
            <When condition={isPPC}>
              <TextField label={t("Year 5 Grown Cover Goal (PPC)")} value={project.year_five_crown_cover} />
            </When>
            <TextField label={t("Survival Rate (Goal)")} value={project.survival_rate} />
            <GenericField label={t("Tree Species")}>
              <TreeSpeciesTable modelName="project" modelUUID={project.uuid} />
            </GenericField>
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default GoalsAndProgressTab;
