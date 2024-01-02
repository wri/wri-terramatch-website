import { useT } from "@transifex/react";
import Link from "next/link";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { useFramework } from "@/hooks/useFramework";
import { getFullName } from "@/utils/user";

interface ReportOverviewTabProps {
  report: any;
  dueAt?: string;
}

const ReportDataTab = ({ report, dueAt }: ReportOverviewTabProps) => {
  const t = useT();
  const { format } = useDate();
  const { isPPC, isTerrafund } = useFramework(report);

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Reported Data")} gap={8}>
            <LongTextField title={t("Local Engagement")}>{report.local_engagement}</LongTextField>
            <When condition={isPPC}>
              <LongTextField title={t("Technical Narrative")}>{report.technical_narrative}</LongTextField>
              <LongTextField title={t("Public Narrative")}>{report.public_narrative}</LongTextField>
            </When>
            <When condition={isTerrafund}>
              <LongTextField title={t("Landscape Community Contribution")}>
                {report.landscape_community_contribution}
              </LongTextField>
              <LongTextField title={t("Top 3 Successes")}>{report.top_three_successes}</LongTextField>
              <LongTextField title={t("Challenges Faced")}>{report.top_three_successes}</LongTextField>
              <LongTextField title={t("Lessons Learned")}>{report.lessons_learned}</LongTextField>
              <LongTextField title={t("Maintenance and Monitoring Activities")}>
                {report.maintenance_and_monitoring_activities}
              </LongTextField>
              <LongTextField title={t("Significant Change")}>{report.significant_change}</LongTextField>
              <LongTextField title={t("Survival Rate")}>{report.percentage_survival_to_date}</LongTextField>
              <LongTextField title={t("Survival Calculation")}>{report.survival_calculation}</LongTextField>
              <LongTextField title={t("Survival Comparison")}>{report.survival_comparison}</LongTextField>
            </When>
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
            <If condition={isPPC}>
              <Then>
                <TextField label={t("Workdays")} value={report.workdays_total} />
                <TextField label={t("Workdays Paid")} value={report.workdays_paid} />
                <TextField label={t("Workdays Volunteer")} value={report.workdays_volunteer} />
              </Then>
              <Else>
                <TextField label={t("Jobs Created")} value={report.total_jobs_created} />
              </Else>
            </If>
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
              <When condition={isTerrafund}>
                <Button
                  as={Link}
                  variant="secondary"
                  href={getEntityDetailPageLink("project-reports", report.uuid, "nursery-reports")}
                >
                  {t("View all Nurseries")}
                </Button>
              </When>
            }
          >
            <TextField label={t("Seedlings Grown")} value={report.seedlings_grown} /> {/*TODO*/}
            <When condition={isTerrafund}>
              <TextField label={t("Number of Nursery Reports")} value={report.nursery_reports_count} />
            </When>
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
