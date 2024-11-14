import { useT } from "@transifex/react";
import Link from "next/link";

import Button from "@/components/elements/Button/Button";
import GenericField from "@/components/elements/Field/GenericField";
import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { getFullName } from "@/utils/user";

interface ReportOverviewTabProps {
  report: any;
  dueAt?: string;
}

const ReportDataTab = ({ report, dueAt }: ReportOverviewTabProps) => {
  const t = useT();
  const { format } = useDate();

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Reported Data")} gap={8}>
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
              <TextField label={t("Workdays")} value={report.workdays_total} />
              <TextField label={t("Workdays Paid")} value={report.workdays_paid} />
              <TextField label={t("Workdays Volunteer")} value={report.workdays_volunteer} />
              <TextField label={t("Unique Restoration Partners")} value={report.total_unique_restoration_partners} />
              <TextField label={t("Direct Restoration Partners")} value={report.direct_restoration_partners} />
              <TextField label={t("Indirect Restoration Partners")} value={report.indirect_restoration_partners} />
            </ContextCondition>
            <ContextCondition frameworksHide={[Framework.PPC]}>
              <TextField label={t("Jobs Created")} value={report.total_jobs_created} />
            </ContextCondition>
          </PageCard>
          <PageCard
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
            title={t("Trees Data")}
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
            <TextField label={t("Number of Sites Reports")} value={report.site_reports_count} />
          </PageCard>
          <PageCard
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
              <TreeSpeciesTable modelName="project-report" modelUUID={report.uuid} />
            </GenericField>
            <TextField
              frameworksShow={ALL_TF}
              label={t("Number of Nursery Reports")}
              value={report.nursery_reports_count}
            />
          </PageCard>
          <PageCard title={t("Project Report Details")}>
            <TextField label={t("Project Report name")} value={report.title} />
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
