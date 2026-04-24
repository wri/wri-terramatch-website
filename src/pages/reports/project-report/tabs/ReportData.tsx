import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import Button from "@/components/elements/Button/Button";
import GenericField from "@/components/elements/Field/GenericField";
import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import useCollectionsTotal, { CollectionsTotalProps } from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import type { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { toFormOptions } from "@/components/extensive/WizardForm/utils";
import { useEntityFormData } from "@/connections/Form";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework, useFrameworkContext } from "@/context/framework.provider";
import { type FormFieldsProvider, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import type { FormQuestionOptionDto, ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";

type LandscapeProgressOverviewParams = {
  landscapeCommunityContribution: ProjectReportFullDto["landscapeCommunityContribution"];
  plantingCompletedLabel: string;
  reportPlantingStatus: ProjectReportFullDto["plantingStatus"];
  formAnswersSayPlantingCompleted?: boolean;
};

const isYesCompletedToken = (value: string | null | undefined): boolean => {
  if (value == null) return false;
  const n = value.trim().toLowerCase();
  return n === "completed" || n === "yes" || n === "true";
};

const collectFieldNamesForStep = (stepId: string, fp: FormFieldsProvider): string[] => {
  const out: string[] = [];
  const walk = (name: string) => {
    out.push(name);
    fp.childNames(name).forEach(walk);
  };
  fp.fieldNames(stepId).forEach(walk);
  return out;
};

const PLANTING_Q_LABEL =
  /completed\s+planting|planting\s+completed|already\s+completed\s+planting|has\s+your\s+project\s+already\s+completed\s+planting/;

const isPlantingCompletedQuestionField = (field: FieldDefinition): boolean => {
  const key = field.linkedFieldKey?.toLowerCase() ?? "";
  if (
    key &&
    ((key.includes("planting") && (key.includes("complete") || key.includes("completed"))) ||
      (key.includes("landscape") && key.includes("planting")))
  ) {
    return true;
  }
  return PLANTING_Q_LABEL.test(field.label.toLowerCase());
};

const radioAnswerIsYesOption = (field: FieldDefinition, raw: unknown): boolean => {
  if (field.inputType !== "radio" || field.options == null) return false;
  if (raw == null || (typeof raw !== "string" && typeof raw !== "number" && typeof raw !== "boolean")) return false;
  const selected = toFormOptions(field.options as FormQuestionOptionDto[]).find(o => String(o.value) === String(raw));
  if (selected == null) return false;
  const title = selected.title.trim().toLowerCase();
  return title === "yes" || title.startsWith("yes ");
};

const formAnswersIndicatePlantingCompletedYes = (answers: Record<string, unknown>, fp: FormFieldsProvider): boolean => {
  for (const stepId of fp.stepIds()) {
    for (const fieldName of collectFieldNamesForStep(stepId, fp)) {
      const field = fp.fieldByName(fieldName);
      if (field == null || !isPlantingCompletedQuestionField(field)) continue;
      const raw = answers[fieldName];
      if (
        (field.inputType === "radio" && radioAnswerIsYesOption(field, raw)) ||
        ((field.inputType === "boolean" || field.inputType === "conditional") && raw === true)
      ) {
        return true;
      }
    }
  }
  return false;
};

const getLandscapeProgressOverviewValue = (params: LandscapeProgressOverviewParams): string | null => {
  const normalized = params.landscapeCommunityContribution?.trim() ?? "";
  if (
    params.formAnswersSayPlantingCompleted ||
    isYesCompletedToken(params.reportPlantingStatus) ||
    isYesCompletedToken(normalized)
  ) {
    return params.plantingCompletedLabel;
  }
  return normalized.length > 0 ? normalized : null;
};

interface ReportOverviewTabProps {
  report: ProjectReportFullDto;
  dueAt?: string;
}

type UseTotalProps = Omit<CollectionsTotalProps, "entity" | "uuid" | "domain">;
const WORKDAYS_TOTAL: UseTotalProps = {
  trackingType: "workdays" as TrackingType,
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
  trackingType: "restorationPartners" as TrackingType,
  collections: DemographicCollections.RESTORATION_PARTNERS_PROJECT.filter(c => c.startsWith("direct-"))
};
const RP_INDIRECT: UseTotalProps = {
  ...RP_DIRECT,
  collections: DemographicCollections.RESTORATION_PARTNERS_PROJECT.filter(c => c.startsWith("indirect-"))
};
const JOBS: UseTotalProps = {
  trackingType: "jobs" as TrackingType,
  collections: DemographicCollections.JOBS_PROJECT
};
const VOLUNTEERS: UseTotalProps = {
  trackingType: "volunteers" as TrackingType,
  collections: DemographicCollections.VOLUNTEERS_PROJECT
};
const ALL_BENEFICIARIES: UseTotalProps = {
  trackingType: "allBeneficiaries" as TrackingType,
  collections: DemographicCollections.BENEFICIARIES_PROJECT_ALL
};

const useTotal = (props: UseTotalProps, { uuid }: { uuid: string }) =>
  String(useCollectionsTotal({ ...props, domain: "demographics", entity: "projectReports", uuid }) ?? "N/A");

const ReportDataTab = ({ report, dueAt }: ReportOverviewTabProps) => {
  const t = useT();
  const { format } = useDate();
  const { framework } = useFrameworkContext();
  const nurserySeedlingsTotal = usePlantTotalCount({
    entity: "projectReports",
    entityUuid: report.uuid,
    collection: "nursery-seedling"
  });

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
  const [formDataLoaded, { data: reportFormData }] = useEntityFormData({
    entity: "projectReports",
    uuid: report.uuid,
    enabled: report.uuid != null
  });
  const [formProviderLoaded, formFieldsProvider] = useApiFieldsProvider(reportFormData?.formUuid);

  const formAnswersSayPlantingCompleted = useMemo(() => {
    if (!formDataLoaded || !formProviderLoaded || reportFormData?.answers == null) {
      return false;
    }
    return formAnswersIndicatePlantingCompletedYes(
      reportFormData.answers as Record<string, unknown>,
      formFieldsProvider
    );
  }, [formDataLoaded, formProviderLoaded, reportFormData?.answers, formFieldsProvider]);

  const plantingCompletedLabel = t("Planting Completed") || "Planting Completed";
  const landscapeProgressOverviewValue = getLandscapeProgressOverviewValue({
    landscapeCommunityContribution: report.landscapeCommunityContribution,
    reportPlantingStatus: report.plantingStatus,
    formAnswersSayPlantingCompleted,
    plantingCompletedLabel
  });
  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={Framework.HBF ? t("General Report Updates") : t("Reported Data")} gap={8}>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <LongTextField title={t("Landscape Progress")}>{landscapeProgressOverviewValue}</LongTextField>
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
              <LongTextField title={t("Landscape Progress")}>{landscapeProgressOverviewValue}</LongTextField>
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
            <TextField
              label={t("Seedlings Grown")}
              value={framework === Framework.PPC ? String(nurserySeedlingsTotal) : String(report.seedlingsGrown ?? "")}
            />
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
            <TextField
              label={t("Created by")}
              value={(report?.createdByFirstName ?? "") + " " + (report?.createdByLastName ?? "")}
            />
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
