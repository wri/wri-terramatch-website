import { useT } from "@transifex/react";
import Link from "next/link";

import Button from "@/components/elements/Button/Button";
import GenericField from "@/components/elements/Field/GenericField";
import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import useCollectionsTotal, { CollectionsTotalProps } from "@/components/extensive/DemographicsCollapseGrid/hooks";
import { DemographicType } from "@/components/extensive/DemographicsCollapseGrid/types";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { getFullName } from "@/utils/user";

interface ReportOverviewTabProps {
  report: any;
  dueAt?: string;
}

type UseTotalProps = Omit<CollectionsTotalProps, "entity" | "uuid">;
const WORKDAYS_TOTAL: UseTotalProps = {
  demographicType: "workdays" as DemographicType,
  collections: DemographicCollections.WORKDAYS_PROJECT
};
const WORKDAYS_PAID: UseTotalProps = {
  ...WORKDAYS_TOTAL,
  collections: WORKDAYS_TOTAL.collections.filter(c => c.startsWith("paid-"))
};
const WORKDAYS_VOLUNTEER: UseTotalProps = {
  ...WORKDAYS_TOTAL,
  collections: WORKDAYS_TOTAL.collections.filter(c => c.startsWith("volunteer-"))
};
const WORKDAYS_DIRECT: UseTotalProps = {
  ...WORKDAYS_TOTAL,
  collections: ["direct"]
};
const WORKDAYS_CONVERGENCE: UseTotalProps = {
  ...WORKDAYS_TOTAL,
  collections: ["convergence"]
};
const RP_DIRECT: UseTotalProps = {
  demographicType: "restorationPartners" as DemographicType,
  collections: DemographicCollections.RESTORATION_PARTNERS_PROJECT.filter(c => c.startsWith("direct-"))
};
const RP_INDIRECT: UseTotalProps = {
  ...RP_DIRECT,
  collections: DemographicCollections.RESTORATION_PARTNERS_PROJECT.filter(c => c.startsWith("indirect-"))
};
const JOBS: UseTotalProps = {
  demographicType: "jobs" as DemographicType,
  collections: DemographicCollections.JOBS_PROJECT
};
const VOLUNTEERS: UseTotalProps = {
  demographicType: "volunteers" as DemographicType,
  collections: DemographicCollections.VOLUNTEERS_PROJECT
};
const ALL_BENEFICIARIES: UseTotalProps = {
  demographicType: "allBeneficiaries" as DemographicType,
  collections: DemographicCollections.BENEFICIARIES_PROJECT_ALL
};

const useTotal = (props: UseTotalProps, { uuid }: { uuid: string }) =>
  String(useCollectionsTotal({ ...props, entity: "projectReports", uuid }) ?? "N/A");

const ReportDataTab = ({ report, dueAt }: ReportOverviewTabProps) => {
  const t = useT();
  const { format } = useDate();

  const workdaysTotal = useTotal(WORKDAYS_TOTAL, report);
  const workdaysPaid = useTotal(WORKDAYS_PAID, report);
  const workdaysVolunteer = useTotal(WORKDAYS_VOLUNTEER, report);
  const workdaysDirect = useTotal(WORKDAYS_DIRECT, report);
  const workdaysConvergence = useTotal(WORKDAYS_CONVERGENCE, report);
  const rpDirect = useTotal(RP_DIRECT, report);
  const rpIndirect = useTotal(RP_INDIRECT, report);
  const jobs = useTotal(JOBS, report);
  const volunteers = useTotal(VOLUNTEERS, report);
  const beneficiaries = useTotal(ALL_BENEFICIARIES, report);

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={Framework.HBF ? t("General Report Updates") : t("Reported Data")} gap={8}>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <LongTextField title={t("Landscape Progress")}>{report.landscape_community_contribution}</LongTextField>
              <LongTextField title={t("Community Engagement Progress")}>{report.community_progress}</LongTextField>
              <LongTextField title={t("Climate Resilience Progress")}>{report.resilience_progress}</LongTextField>
              <LongTextField title={t("Response to Local Priorities")}>
                {report.local_engagement_description}
              </LongTextField>
              <LongTextField title={t("Governance Progress")}>{report.local_governance}</LongTextField>
              <LongTextField title={t("Equitable Opportunities for Women + Youth")}>
                {report.equitable_opportunities}
              </LongTextField>
              <LongTextField title={t("Top Three Successes")}>{report.top_three_successes}</LongTextField>
              <LongTextField title={t("Challenges Faced")}>{report.challenges_faced}</LongTextField>
              <LongTextField title={t("Lessons Learned")}>{report.lessons_learned}</LongTextField>
              <LongTextField title={t("Adaptative Management")}>{report.adaptive_management}</LongTextField>
              <LongTextField title={t("Significant Change")}>{report.significant_change}</LongTextField>
              <LongTextField title={t("Scalability Progress")}>{report.scalability_replicability}</LongTextField>
              <LongTextField title={t("Convergence Schemes")}>{report.convergence_schemes}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.PPC]}>
              <LongTextField title={t("Technical Narrative")}>{report.technical_narrative}</LongTextField>
              <LongTextField title={t("Public Narrative")}>{report.public_narrative}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksShow={ALL_TF}>
              <LongTextField title={t("Landscape Progress")}>{report.landscape_community_contribution}</LongTextField>
              <LongTextField title={t("Community Engagement Progress")}>{report.community_progress}</LongTextField>
              <LongTextField title={t("Community Engagement Approach")}>
                {report.local_engagement_description}
              </LongTextField>
              <LongTextField title={t("Top 3 Successes")}>{report.top_three_successes}</LongTextField>
              <LongTextField title={t("Challenges Faced")}>{report.challenges_faced}</LongTextField>
              <LongTextField title={t("Lessons Learned")}>{report.lessons_learned}</LongTextField>
              <LongTextField title={t("Maintenance and Monitoring Activities")}>
                {report.maintenance_and_monitoring_activities}
              </LongTextField>
              <LongTextField title={t("Significant Change")}>{report.significant_change}</LongTextField>
              <LongTextField title={t("Survival Rate")}>{report.pct_survival_to_date}</LongTextField>
              <LongTextField title={t("Survival Calculation")}>{report.survival_calculation}</LongTextField>
              <LongTextField title={t("Survival Comparison")}>{report.survival_comparison}</LongTextField>
              <LongTextField title={t("Equitable Opportunities for Women + Youth")}>
                {report.equitable_opportunities}
              </LongTextField>
            </ContextCondition>
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard
            title={t("Socioeconomic Data")}
            gap={4}
            headerChildren={
              <Button
                as={Link}
                variant="secondary"
                href={getEntityDetailPageLink("project-reports", report.uuid, "socioeconomic")}
              >
                {t("View More")}
              </Button>
            }
          >
            <ContextCondition frameworksShow={[Framework.PPC]}>
              <TextField label={t("Workdays")} value={workdaysTotal} />
              <TextField label={t("Workdays Paid")} value={workdaysPaid} />
              <TextField label={t("Workdays Volunteer")} value={workdaysVolunteer} />
              <TextField
                label={t("Unique Restoration Partners")}
                value={report.total_unique_restoration_partners ?? "N/A"}
              />
              <TextField label={t("Direct Restoration Partners")} value={rpDirect} />
              <TextField label={t("Indirect Restoration Partners")} value={rpIndirect} />
            </ContextCondition>
            <ContextCondition frameworksHide={[Framework.PPC, Framework.HBF]}>
              <TextField label={t("Jobs Created")} value={jobs} />
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <TextField label={t("Direct Workdays")} value={workdaysDirect} />
              <TextField label={t("Convergence Workdays")} value={workdaysConvergence} />
              <TextField label={t("Volunteers")} value={volunteers} />
              <TextField label={t("Community Partners")} value={beneficiaries} />
            </ContextCondition>
          </PageCard>
          <PageCard
            frameworksHide={[Framework.HBF]}
            title={t("Images")}
            headerChildren={
              <Button
                as={Link}
                variant="secondary"
                href={getEntityDetailPageLink("project-reports", report.uuid, "gallery")}
              >
                {t("View All images")}
              </Button>
            }
          ></PageCard>
          <PageCard
            title={Framework.HBF ? t("Saplings") : t("Trees Data")}
            headerChildren={
              <Button
                as={Link}
                variant="secondary"
                href={getEntityDetailPageLink("project-reports", report.uuid, "site-reports")}
              >
                {t("View all Site Reports")}
              </Button>
            }
          >
            <TextField label={t("Trees Planted")} value={report.trees_planted_count} />
            <TextField frameworksShow={[Framework.HBF]} label={t("Non-Trees Planted")} value={report.non_tree_total} />
            <TextField
              frameworksHide={[Framework.HBF]}
              label={t("Number of Sites Reports")}
              value={report.site_reports_count}
            />
          </PageCard>
          <PageCard
            frameworksHide={[Framework.HBF]}
            title={t("Seedlings Data")}
            headerChildren={
              <Button
                frameworksShow={ALL_TF}
                as={Link}
                variant="secondary"
                href={getEntityDetailPageLink("project-reports", report.uuid, "nursery-reports")}
              >
                {t("View all Nurseries")}
              </Button>
            }
          >
            <TextField label={t("Seedlings Grown")} value={report.seedlings_grown} />
            <GenericField frameworksShow={[Framework.PPC]} label={t("Tree Species")}>
              <TreeSpeciesTable
                entity="projectReports"
                entityUuid={report.uuid}
                collection="nursery-seedling"
                tableType="noGoal"
              />
            </GenericField>
            <TextField
              frameworksShow={ALL_TF}
              label={t("Number of Nursery Reports")}
              value={report.nursery_reports_count}
            />
          </PageCard>
          <PageCard title={t("Convergence Details")} frameworksShow={[Framework.HBF]}>
            <TextField label={t("Convergence Funds Raised")} value={report.convergence_amount} />
            <LongTextField title={t("Convergence Description")}>{report.convergence_schemes}</LongTextField>
          </PageCard>
          <PageCard title={t("Project Report Details")}>
            <TextField frameworksHide={[Framework.HBF]} label={t("Project Report name")} value={report.title} />
            <TextField label={t("Created by")} value={getFullName(report.created_by)} />
            <TextField label={t("Updated")} value={format(report.updated_at)} />
            <TextField label={t("Due date")} value={format(dueAt)} />
            <TextField label={t("Submitted Date")} value={format(report.submitted_at)} />
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default ReportDataTab;
