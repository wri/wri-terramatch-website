import { useT } from "@transifex/react";

import GoalProgressCard from "@/components/elements/Cards/GoalProgressCard/GoalProgressCard";
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

interface GoalsAndProgressTabProps {
  site: any;
}

const GoalsAndProgressTab = ({ site }: GoalsAndProgressTabProps) => {
  const t = useT();

  return (
    <PageBody>
      <PageRow>
        <PageCard title={t("Progress & Goals")}>
          <div className="flex w-full flex-wrap items-start gap-8">
            <GoalProgressCard
              frameworksShow={[Framework.PPC]}
              label={t("Workday Count (PPC)")}
              value={site.combined_workday_count}
              className="w-[170px]"
            />
            <GoalProgressCard
              frameworksHide={[Framework.PPC]}
              label={t("Hectares Restored Goal")}
              value={site.hectares_to_restore_goal}
            />

            <GoalProgressCard
              label={t("Trees restored")}
              value={site.trees_restored_count}
              limit={site.trees_grown_goal}
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
            {/* TODO: To be added */}
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Other Goals")} gap={4}>
            <ContextCondition frameworksShow={[Framework.PPC]}>
              <TextField
                label={t("Natural Regeneration Trees Per Hectare")}
                value={site?.a_nat_regeneration_trees_per_hectare}
              />
              <TextField label={t("Number of Hectares for Natural Regeneration")} value={site.a_nat_regeneration} />
              <TextField label={t("Number of Mature Trees")} value={site.aim_number_of_mature_trees} />
              <TextField
                frameworksShow={[Framework.PPC]}
                label={t("Year 5 Grown Cover Goal (PPC)")}
                value={site.aim_year_five_crown_cover}
              />
              <TextField label={t("Survival Rate of Planted")} value={site.survival_rate_planted} />
            </ContextCondition>
            <TextField label={t("Direct Seeding Survival Rate")} value={site.direct_seeding_survival_rate} />
            <GenericField label={t("Tree Species")} frameworksHide={[Framework.PPC]}>
              <TreeSpeciesTable modelName="site" modelUUID={site.uuid} variantTable={VARIANT_TABLE_BORDER} />
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
