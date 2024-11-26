import { useT } from "@transifex/react";
import { Fragment } from "react";

import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import FilePreviewCard from "@/components/elements/FilePreviewCard/FilePreviewCard";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SECONDARY } from "@/components/elements/Table/TableVariants";
import { GRID_VARIANT_GREEN } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import Loader from "@/components/generic/Loading/Loader";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import useDemographicData from "@/hooks/useDemographicData";
import { downloadFile } from "@/utils/network";

interface ReportOverviewTabProps {
  report: any;
  dueAt?: string;
}

const BreakdownTable = ({ data }: { data: { name: string; value?: number }[] }) => {
  const t = useT();

  return (
    <Table
      variant={VARIANT_TABLE_SECONDARY}
      columns={[
        { header: t("Breakdown"), accessorKey: "name", enableSorting: false },
        {
          accessorKey: "value",
          enableSorting: false,
          header: () => <span className="text-bold-subtitle-500 float-right">{t("Count")}</span>,
          cell: props => <span className="float-right">{props.getValue() as string}</span>
        }
      ]}
      data={data.map(item => ({ ...item, value: item.value ?? 0 }))}
    />
  );
};

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
            <ContextCondition frameworksHide={[Framework.HBF]}>
              <LongTextField title={t("New Jobs Description")}>{report.new_jobs_description}</LongTextField>
              <BreakdownTable
                data={[
                  { name: t("Full Time Women"), value: report.ft_women },
                  { name: t("Full Time Men"), value: report.ft_men },
                  { name: t("Full Time Youth"), value: report.ft_youth },
                  { name: t("Full Time Non Youth"), value: report.ft_jobs_non_youth }
                ]}
              />
              <BreakdownTable
                data={[
                  { name: t("Part Time Women"), value: report.pt_women },
                  { name: t("Part Time Men"), value: report.pt_men },
                  { name: t("Part Time Youth"), value: report.pt_youth },
                  { name: t("Part Time Non Youth"), value: report.part_time_jobs_35plus }
                ]}
              />
            </ContextCondition>
          </PageCard>
          <PageCard title={t("Volunteers")} gap={4} frameworksHide={[Framework.HBF]}>
            <LongTextField title={t("Volunteer Description")}>{report.volunteers_work_description}</LongTextField>
            <BreakdownTable
              data={[
                { name: t("Volunteer Women"), value: report.volunteer_women },
                { name: t("Volunteer Men"), value: report.volunteer_men },
                { name: t("Volunteer Youth"), value: report.volunteer_youth },
                { name: t("Volunteer Non Youth"), value: report.volunteer_non_youth }
              ]}
            />
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
          <PageCard title={t("Beneficiaries")} gap={4} frameworksHide={[Framework.HBF]}>
            <LongTextField title={t("Beneficiaries Description")}>{report.beneficiaries_description}</LongTextField>
            <LongTextField title={t("Beneficiaries Income Increase Description")}>
              {report.beneficiaries_income_increase_description}
            </LongTextField>
            <LongTextField title={t("Beneficiaries Skills Knowledge Increase Description")}>
              {report.beneficiaries_skills_knowledge_increase_description}
            </LongTextField>
            <BreakdownTable
              data={[
                { name: t("Beneficiaries Women"), value: report.beneficiaries_women },
                { name: t("Beneficiaries Men"), value: report.beneficiaries_men },
                { name: t("Beneficiaries Youth"), value: report.beneficiaries_youth },
                { name: t("Beneficiaries Non Youth"), value: report.beneficiaries_non_youth },
                { name: t("Beneficiaries Smallholder Farmers"), value: report.beneficiaries_smallholder },
                { name: t("Beneficiaries Large Scale Farmers"), value: report.beneficiaries_large_scale }
              ]}
            />
          </PageCard>
        </PageColumn>

        <PageColumn>
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
          <PageCard title={t("Job Details")} gap={4} frameworksHide={[Framework.HBF]}>
            <TextField label={t("Jobs Created")} value={report.total_jobs_created} />
            <TextField label={t("Full-time Jobs")} value={report.ft_total} />
            <TextField label={t("Part-time Jobs")} value={report.pt_total} />
            <TextField label={t("Volunteers")} value={report.volunteer_total} />
            <TextField label={t("Total Beneficiaries")} value={report.beneficiaries} />
            <TextField label={t("Beneficiaries Income Increase")} value={report.beneficiaries_income_increase} />
            <TextField
              label={t("Beneficiaries Knowledge Increase")}
              value={report.beneficiaries_skills_knowledge_increase}
            />
          </PageCard>
          <ContextCondition frameworksHide={[Framework.HBF]}>
            {report.socioeconomic_benefits && (
              <PageCard gap={4}>
                {report.socioeconomic_benefits.map((item: any) => (
                  <FilePreviewCard key={item.uuid} file={item} onDownload={f => downloadFile(f.url)} />
                ))}
              </PageCard>
            )}
          </ContextCondition>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default TFSocioeconomicTab;
