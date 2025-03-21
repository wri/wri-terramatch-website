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
import { ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { getFullName } from "@/utils/user";

interface ReportOverviewTabProps {
  report: ProjectReportFullDto;
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
              <LongTextField title={t("Landscape Progress")}>{report.landscapeCommunityContribution}</LongTextField>
              <LongTextField title={t("Community Engagement Progress")}>{report.communityProgress}</LongTextField>
              <LongTextField title={t("Climate Resilience Progress")}>{report.resilienceProgress}</LongTextField>
              <LongTextField title={t("Response to Local Priorities")}>
                {report.localEngagementDescription}
              </LongTextField>
              <LongTextField title={t("Governance Progress")}>{report.localGovernance}</LongTextField>
              <LongTextField title={t("Equitable Opportunities for Women + Youth")}>
                {report.equitableOpportunities}
              </LongTextField>
              <LongTextField title={t("Top Three Successes")}>{report.topThreeSuccesses}</LongTextField>
              <LongTextField title={t("Challenges Faced")}>{report.challengesFaced}</LongTextField>
              <LongTextField title={t("Lessons Learned")}>{report.lessonsLearned}</LongTextField>
              <LongTextField title={t("Adaptative Management")}>{report.adaptiveManagement}</LongTextField>
              <LongTextField title={t("Significant Change")}>{report.significantChange}</LongTextField>
              <LongTextField title={t("Scalability Progress")}>{report.scalabilityReplicability}</LongTextField>
              <LongTextField title={t("Convergence Schemes")}>{report.convergenceSchemes}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.PPC]}>
              <LongTextField title={t("Technical Narrative")}>{report.technicalNarrative}</LongTextField>
              <LongTextField title={t("Public Narrative")}>{report.publicNarrative}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksShow={ALL_TF}>
              <LongTextField title={t("Landscape Progress")}>{report.landscapeCommunityContribution}</LongTextField>
              <LongTextField title={t("Community Engagement Progress")}>{report.communityProgress}</LongTextField>
              <LongTextField title={t("Community Engagement Approach")}>
                {report.localEngagementDescription}
              </LongTextField>
              <LongTextField title={t("Top 3 Successes")}>{report.topThreeSuccesses}</LongTextField>
              <LongTextField title={t("Challenges Faced")}>{report.challengesFaced}</LongTextField>
              <LongTextField title={t("Lessons Learned")}>{report.lessonsLearned}</LongTextField>
              <LongTextField title={t("Maintenance and Monitoring Activities")}>
                {report.maintenanceAndMonitoringActivities}
              </LongTextField>
              <LongTextField title={t("Significant Change")}>{report.significantChange}</LongTextField>
              <LongTextField title={t("Survival Rate")}>{report.pctSurvivalToDate}</LongTextField>
              <LongTextField title={t("Survival Calculation")}>{report.survivalCalculation}</LongTextField>
              <LongTextField title={t("Survival Comparison")}>{report.survivalComparison}</LongTextField>
              <LongTextField title={t("Equitable Opportunities for Women + Youth")}>
                {report.equitableOpportunities}
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
                value={String(report.totalUniqueRestorationPartners ?? "")}
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
            <TextField label={t("Trees Planted")} value={String(report.treesPlantedCount ?? "")} />
            <TextField
              frameworksShow={[Framework.HBF]}
              label={t("Non-Trees Planted")}
              value={String(report.nonTreeTotal ?? "")}
            />
            <TextField
              frameworksHide={[Framework.HBF]}
              label={t("Number of Sites Reports")}
              value={String(report.siteReportsCount ?? "")}
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
            <TextField label={t("Seedlings Grown")} value={String(report.seedlingsGrown ?? "")} />
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
              value={String(report.nurseryReportsCount ?? "")}
            />
          </PageCard>
          <PageCard title={t("Convergence Details")} frameworksShow={[Framework.HBF]}>
            <TextField label={t("Convergence Funds Raised")} value={String(report.convergenceAmount ?? "")} />
            <LongTextField title={t("Convergence Description")}>{report.convergenceSchemes}</LongTextField>
          </PageCard>
          <PageCard title={t("Project Report Details")}>
            <TextField frameworksHide={[Framework.HBF]} label={t("Project Report name")} value={report.title ?? ""} />
            <TextField label={t("Created by")} value={getFullName(report.createdByUser ?? "")} />
            <TextField label={t("Updated")} value={format(report.updatedAt)} />
            <TextField label={t("Due date")} value={format(dueAt)} />
            <TextField label={t("Submitted Date")} value={format(report.submittedAt)} />
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default ReportDataTab;
