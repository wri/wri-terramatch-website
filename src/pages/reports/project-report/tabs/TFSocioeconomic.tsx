import { useT } from "@transifex/react";
import { Fragment } from "react";

import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import { GRID_VARIANT_GREEN } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import Loader from "@/components/generic/Loading/Loader";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import useDemographicData from "@/hooks/useDemographicData";

interface ReportOverviewTabProps {
  report: any;
  dueAt?: string;
}

const TFSocioeconomicTab = ({ report }: ReportOverviewTabProps) => {
  const t = useT();
  const { grids: gridsDirectWorkdays } = useDemographicData(
    "project-report",
    "workdays",
    report.uuid,
    ["direct"],
    "Direct Workdays",
    GRID_VARIANT_GREEN
  );
  const { grids: gridsConvergenceWorkdays } = useDemographicData(
    "project-report",
    "workdays",
    report.uuid,
    ["convergence"],
    "Convergence Workdays",
    GRID_VARIANT_GREEN
  );
  const sumTotalJobs = (jobs: Array<string>) => jobs.reduce((acc, key) => acc + (report[key] || 0), 0);

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={Framework.HBF ? t("Direct Jobs") : t("New Jobs")} gap={4}>
            <ContextCondition frameworksShow={[Framework.HBF]}>
              {gridsDirectWorkdays.length == 0 ? (
                <Loader />
              ) : (
                <Fragment>{gridsDirectWorkdays.map(({ collection, grid }) => grid)}</Fragment>
              )}
              <LongTextField title={t("Description of Direct Jobs")}>{report.new_jobs_description}</LongTextField>
            </ContextCondition>
            <ContextCondition frameworksShow={[Framework.ENTERPRISES, Framework.TF, Framework.TF_LANDSCAPES]}>
              <LongTextField title={t("Description of Jobs")}>{report.new_jobs_description}</LongTextField>
              <TextField
                label={t("Full-time Jobs")}
                value={sumTotalJobs(["ft_women", "ft_men", "ft_other", "ft_youth", "ft_jobs_non_youth"]).toString()}
              />
              <TextField variantLabel="text-16-light" label={t("Full-time Women")} value={report.ft_women} />
              <TextField variantLabel="text-16-light" label={t("Full-time Men")} value={report.ft_men} />
              <TextField variantLabel="text-16-light" label={t("Full-time Other")} value={report.ft_other} />
              <TextField variantLabel="text-16-light" label={t("Full-time Youth")} value={report.ft_youth} />
              <TextField
                variantLabel="text-16-light"
                label={t("Full-time Non Youth")}
                value={report.ft_jobs_non_youth}
              />
              <TextField
                label={t("Part-time Jobs")}
                value={sumTotalJobs(["pt_women", "pt_men", "pt_other", "pt_youth", "part_time_jobs_35plus"]).toString()}
              />
              <TextField variantLabel="text-16-light" label={t("Part-time Women")} value={report.pt_women} />
              <TextField variantLabel="text-16-light" label={t("Part-time Men")} value={report.pt_men} />
              <TextField variantLabel="text-16-light" label={t("Part-time Other")} value={report.pt_other} />
              <TextField variantLabel="text-16-light" label={t("Part-time Youth")} value={report.pt_youth} />
              <TextField
                variantLabel="text-16-light"
                label={t("Part-time Non Youth")}
                value={report.part_time_jobs_35plus}
              />
            </ContextCondition>
          </PageCard>
          <PageCard title={t("Volunteers")} gap={4} frameworksHide={[Framework.HBF]}>
            <LongTextField title={t("Description of Volunteers")}>{report.volunteers_work_description}</LongTextField>
            <TextField label={t("Total Volunteers")} value={report.volunteer_total} />
            <TextField label={t("Volunteers - Men")} value={report.volunteer_men} />
            <TextField label={t("Volunteers - Women")} value={report.volunteer_women} />
            <TextField label={t("Volunteers - Youth")} value={report.volunteer_youth} />
            <TextField label={t("Volunteers - Non Youth")} value={report.volunteer_non_youth} />
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
            <TextField label={t("Total Community Partners")} value={report.total_community_partners} />
            <TextField label={t("Partners - Men")} value={report.beneficiaries_men} />
            <TextField label={t("Partners - Women")} value={report.beneficiaries_women} />
            <TextField label={t("Partners - Youth")} value={report.beneficiaries_youth} />
            <TextField label={t("Partners - ST/ST/OBC")} value={report.beneficiaries_scstobc} />
            <TextField label={t("Partners - Marginal Farmers")} value={report.beneficiaries_scstobc_farmers} />
            <TextField label={t("Partners - Smallholder Farmers")} value={report.beneficiaries_smallholder} />
            <TextField
              label={t("Partners - Medium- to Large-Scale Farmers")}
              value={report.beneficiaries_large_scale}
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
            <TextField
              label={t("Total Beneficiaries")}
              value={sumTotalJobs([
                "beneficiaries_men",
                "beneficiaries_women",
                "beneficiaries_other",
                "beneficiaries_youth",
                "beneficiaries_non_youth",
                "beneficiaries_smallholder",
                "beneficiaries_large_scale"
              ]).toString()}
            />
            <TextField variantLabel="text-16-light" label={t("Beneficiaries - Men")} value={report.beneficiaries_men} />
            <TextField
              variantLabel="text-16-light"
              label={t("Beneficiaries - Women")}
              value={report.beneficiaries_women}
            />
            <TextField
              variantLabel="text-16-light"
              label={t("Beneficiaries - Other")}
              value={report.beneficiaries_other}
            />
            <TextField
              variantLabel="text-16-light"
              label={t("Beneficiaries - Youth")}
              value={report.beneficiaries_youth}
            />
            <TextField
              variantLabel="text-16-light"
              label={t("Beneficiaries - Non Youth")}
              value={report.beneficiaries_non_youth}
            />
            <TextField
              variantLabel="text-16-light"
              label={t("Beneficiaries - Smallholder Farmers")}
              value={report.beneficiaries_smallholder}
            />
            <TextField
              variantLabel="text-16-light"
              label={t("Beneficiaries - Medium- to Large-Scale Farmers")}
              value={report.beneficiaries_large_scale}
            />
            <LongTextField title={t("Description of Training")}>
              {report.beneficiaries_skills_knowledge_increase_description}
            </LongTextField>
            <TextField
              label={t("Total Trainees")}
              value={sumTotalJobs([
                "beneficiaries_training_women",
                "beneficiaries_training_men",
                "beneficiaries_training_other",
                "beneficiaries_training_youth",
                "beneficiaries_training_non_youth"
              ]).toString()}
            />
            <TextField label={t("Trainees - Women")} value={report.beneficiaries_training_women} />
            <TextField label={t("Trainees - Men")} value={report.beneficiaries_training_men} />
            <TextField label={t("Trainees - Other")} value={report.beneficiaries_training_other} />
            <TextField label={t("Trainees - Youth")} value={report.beneficiaries_training_youth} />
            <TextField label={t("Trainees - Non Youth")} value={report.beneficiaries_training_non_youth} />
          </PageCard>
          <PageCard title={t("Indirect Benefits")} gap={4} frameworksHide={[Framework.HBF]}>
            <LongTextField title={t("Description of Indirect Benefits")}>
              {report.indirect_beneficiaries_description}
            </LongTextField>
            <TextField label={t("Total Indirect Beneficiaries")} value={report.indirect_beneficiaries} />
          </PageCard>

          <PageCard title={t("Convergence Jobs")} gap={4} frameworksShow={[Framework.HBF]}>
            {gridsConvergenceWorkdays.length == 0 ? (
              <Loader />
            ) : (
              <Fragment>{gridsConvergenceWorkdays.map(({ collection, grid }) => grid)}</Fragment>
            )}
            <LongTextField title={t("Description of Convergence Jobs")}>
              {report.convergence_jobs_description}
            </LongTextField>
          </PageCard>
          <PageCard title={t("Volunteers")} gap={4} frameworksShow={[Framework.HBF]}>
            <LongTextField title={t("Description of Volunteers")}>{report.volunteers_work_description}</LongTextField>
            <TextField label={t("Total Volunteer")} value={report.volunteer_total} />
            <TextField label={t("Volunteer - Men")} value={report.volunteer_men} />
            <TextField label={t("Volunteer - Women")} value={report.volunteer_women} />
            <TextField label={t("Volunteer - Youth")} value={report.volunteer_youth} />
            <TextField label={t("Volunteer - ST/ST/OBC")} value={report.volunteer_scstobc} />
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
