import { useT } from "@transifex/react";

import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import DemographicsDisplay from "@/components/extensive/DemographicsCollapseGrid/DemographicsDisplay";
import { GRID_VARIANT_GREEN } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework, useFrameworkContext } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";

interface ReportOverviewTabProps {
  report: any;
  dueAt?: string;
}

const TFSocioeconomicTab = ({ report }: ReportOverviewTabProps) => {
  const t = useT();
  const { framework } = useFrameworkContext();

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={framework === Framework.HBF ? t("Direct Jobs") : t("New Jobs")} gap={4}>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              <DemographicsDisplay
                entity="projectReports"
                uuid={report.uuid}
                type="workdays"
                collection="direct"
                variant={GRID_VARIANT_GREEN}
              />
              <LongTextField title={t("Description of Direct Jobs")}>{report.newJobsDescription}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksShow={ALL_TF}>
              <LongTextField title={t("Description of Jobs")}>{report.newJobsDescription}</LongTextField>
              {["full-time", "part-time"].map(collection => (
                <DemographicsDisplay
                  key={collection}
                  entity="projectReports"
                  uuid={report.uuid}
                  type="jobs"
                  collection={collection}
                />
              ))}
            </ContextCondition>
          </PageCard>
          <PageCard title={t("Volunteers")} gap={4} frameworksHide={[Framework.HBF]}>
            <LongTextField title={t("Description of Volunteers")}>{report.volunteersWorkDescription}</LongTextField>
            {DemographicCollections.VOLUNTEERS_PROJECT.map(collection => (
              <DemographicsDisplay
                key={collection}
                entity="projectReports"
                uuid={report.uuid}
                type="volunteers"
                collection={collection}
              />
            ))}
          </PageCard>
          <PageCard title={t("Other")} gap={4} frameworksHide={[Framework.HBF]}>
            <LongTextField title={t("Income Generating Description")}>
              {report.beneficiariesIncomeIncreaseDescription}
            </LongTextField>
          </PageCard>
          <PageCard title={t("Community Partners - Direct")} gap={4} frameworksShow={[Framework.HBF]}>
            <LongTextField title={t("Description of benefits to Community Partners")}>
              {report.beneficiariesDescription}
            </LongTextField>
            <LongTextField title={t("Description of Community Assets")}>
              {report.communityPartnersAssetsDescription}
            </LongTextField>
            <DemographicsDisplay
              entity="projectReports"
              uuid={report.uuid}
              type="allBeneficiaries"
              collection="all"
              variant={GRID_VARIANT_GREEN}
            />
          </PageCard>
          <PageCard title={t("Community Partners - Indirect")} gap={4} frameworksShow={[Framework.HBF]}>
            <LongTextField title={t("Description of Indirect Benefits")}>
              {report.indirectBeneficiariesDescription}
            </LongTextField>
            <TextField label={t("Total Indirect Beneficiaries")} value={report.indirectBeneficiaries} />
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Beneficiaries")} gap={4} frameworksHide={[Framework.HBF]}>
            <LongTextField title={t("Description of Benefits to Community Partners")}>
              {report.beneficiariesDescription}
            </LongTextField>
            <DemographicsDisplay
              entity="projectReports"
              uuid={report.uuid}
              type="allBeneficiaries"
              collection="all"
              variant={GRID_VARIANT_GREEN}
            />
            <LongTextField title={t("Description of Training")}>
              {report.beneficiariesSkillsKnowledgeIncreaseDescription}
            </LongTextField>
            <DemographicsDisplay
              entity="projectReports"
              uuid={report.uuid}
              type="trainingBeneficiaries"
              collection="training"
              variant={GRID_VARIANT_GREEN}
            />
          </PageCard>
          <PageCard title={t("Indirect Benefits")} gap={4} frameworksHide={[Framework.HBF]}>
            <LongTextField title={t("Description of Indirect Benefits")}>
              {report.indirectBeneficiariesDescription}
            </LongTextField>
            <TextField label={t("Total Indirect Beneficiaries")} value={report.indirectBeneficiaries} />
          </PageCard>

          <PageCard title={t("Convergence Jobs")} gap={4} frameworksShow={[Framework.HBF]}>
            <DemographicsDisplay
              entity="projectReports"
              uuid={report.uuid}
              type="workdays"
              collection="convergence"
              variant={GRID_VARIANT_GREEN}
            />
            <LongTextField title={t("Description of Convergence Jobs")}>
              {report.convergenceJobsDescription}
            </LongTextField>
          </PageCard>
          <PageCard title={t("Volunteers")} gap={4} frameworksShow={[Framework.HBF]}>
            <LongTextField title={t("Description of Volunteers")}>{report.volunteersWorkDescription}</LongTextField>
            {DemographicCollections.VOLUNTEERS_PROJECT.map(collection => (
              <DemographicsDisplay
                key={collection}
                entity="projectReports"
                uuid={report.uuid}
                type="volunteers"
                collection={collection}
              />
            ))}
          </PageCard>
          <PageCard title={t("Other")} gap={4} frameworksShow={[Framework.HBF]}>
            <LongTextField title={t("Income Generating Description")}>
              {report.beneficiariesIncomeIncreaseDescription}
            </LongTextField>
            <LongTextField title={t("Training Description")}>
              {report.beneficiariesSkillsKnowledgeIncreaseDescription}
            </LongTextField>
            <TextField label={t("People Trained")} value={report.peopleKnowledgeSkillsIncreased} />
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default TFSocioeconomicTab;
