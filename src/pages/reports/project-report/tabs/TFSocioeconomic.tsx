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
              <LongTextField title={t("Description of Direct Jobs")}>{report.new_jobs_description}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksShow={ALL_TF}>
              <LongTextField title={t("Description of Jobs")}>{report.new_jobs_description}</LongTextField>
              {DemographicCollections.JOBS_PROJECT.map(collection => (
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
            <LongTextField title={t("Description of Volunteers")}>{report.volunteers_work_description}</LongTextField>
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
              {report.beneficiaries_income_increase_description}
            </LongTextField>
          </PageCard>
          <PageCard title={t("Community Partners - Direct")} gap={4} frameworksShow={[Framework.HBF]}>
            <LongTextField title={t("Description of benefits to Community Partners")}>
              {report.beneficiaries_description}
            </LongTextField>
            <LongTextField title={t("Description of Community Assets")}>
              {report.community_partners_assets_description}
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
              {report.indirect_beneficiaries_description}
            </LongTextField>
            <TextField label={t("Total Indirect Beneficiaries")} value={report.indirect_beneficiaries} />
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Beneficiaries")} gap={4} frameworksHide={[Framework.HBF]}>
            <LongTextField title={t("Description of Benefits to Community Partners")}>
              {report.beneficiaries_description}
            </LongTextField>
            <DemographicsDisplay
              entity="projectReports"
              uuid={report.uuid}
              type="allBeneficiaries"
              collection="all"
              variant={GRID_VARIANT_GREEN}
            />
            <LongTextField title={t("Description of Training")}>
              {report.beneficiaries_skills_knowledge_increase_description}
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
              {report.indirect_beneficiaries_description}
            </LongTextField>
            <TextField label={t("Total Indirect Beneficiaries")} value={report.indirect_beneficiaries} />
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
              {report.convergence_jobs_description}
            </LongTextField>
          </PageCard>
          <PageCard title={t("Volunteers")} gap={4} frameworksShow={[Framework.HBF]}>
            <LongTextField title={t("Description of Volunteers")}>{report.volunteers_work_description}</LongTextField>
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
              {report.beneficiaries_income_increase_description}
            </LongTextField>
            <LongTextField title={t("Training Description")}>
              {report.beneficiaries_skills_knowledge_increase_description}
            </LongTextField>
            <TextField label={t("People Trained")} value={report.people_knowledge_skills_increased} />
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default TFSocioeconomicTab;
