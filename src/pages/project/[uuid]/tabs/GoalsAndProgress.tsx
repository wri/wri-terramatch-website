import { useT } from "@transifex/react";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
import FieldsExpander from "@/components/elements/Field/FieldsExpander";
import GenericField from "@/components/elements/Field/GenericField";
import TextField from "@/components/elements/Field/TextField";
import { VARIANT_TABLE_BORDER } from "@/components/elements/Table/TableVariants";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";

interface GoalsAndProgressProps {
  project: any;
}

const GoalsAndProgressTab = ({ project }: GoalsAndProgressProps) => {
  const t = useT();

  return (
    <PageBody className="text-darkCustom">
      <PageRow>
        <PageCard title={t("Progress & Goals")}>
          <div className="flex w-full flex-wrap items-start gap-8">
            <GoalProgressCard
              frameworksShow={[Framework.PPC]}
              label={t("Workday (PPC)")}
              value={project.combined_workday_count}
            />
            <GoalProgressCard
              frameworksHide={[Framework.PPC]}
              label={t("Jobs Created")}
              value={project.total_jobs_created}
              limit={project.jobs_created_goal}
            />
            <GoalProgressCard label={t("Hectares Restored Goal")} value={project.total_hectares_restored_goal} />
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
              className="flex-1 !items-start"
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
          <PageCard title={t("Goals Details")} gap={4}>
            <TextField
              frameworksShow={[Framework.PPC]}
              label={t("Year 5 Grown Cover Goal (PPC)")}
              value={project.year_five_crown_cover}
            />
            <TextField
              frameworksShow={[Framework.PPC]}
              label={t("Esimtated Survival Rate")}
              value={project.survival_rate}
            />
            <ContextCondition frameworksHide={[Framework.PPC]}>
              <FieldsExpander title="Project Beneficiaries Breakdown">
                <TextField label={t("Women")} value={project?.pct_beneficiaries_women} />
                <TextField label={t("Youth (35 years old and younger)")} value={project?.pct_beneficiaries_youth} />
                <TextField label={t("Smallholder farmers")} value={project?.pct_beneficiaries_small} />
                <TextField label={t("Large-scale farmers")} value={project?.pct_beneficiaries_large} />
                <TextField
                  frameworksShow={[Framework.HBF]}
                  label={t("Marginalized")}
                  value={project?.pct_beneficiaries_marginalised}
                />
              </FieldsExpander>
              <FieldsExpander title="Breakdown new jobs by gender">
                <TextField label={t("Women")} value={project?.pct_employees_women} />
                <TextField label={t("Men")} value={project?.pct_employees_men} />
              </FieldsExpander>
              <FieldsExpander title="Breakdown new jobs by age">
                <TextField label={t("Age 35 and Younger")} value={project?.pct_employees_18to35} />
                <TextField label={t("Older than 35")} value={project?.pct_employees_older35} />
              </FieldsExpander>
              <ContextCondition frameworksShow={[Framework.HBF]}>
                <FieldsExpander title="Breakdown new jobs by marginalized status">
                  <TextField label={t("Marginalized")} value={project?.pct_employees_marginalised} />
                </FieldsExpander>
              </ContextCondition>
            </ContextCondition>
            <br />
            <GenericField label={t("Tree Species")}>
              <TreeSpeciesTable modelName="project" modelUUID={project.uuid} variantTable={VARIANT_TABLE_BORDER} />
            </GenericField>
          </PageCard>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default GoalsAndProgressTab;
