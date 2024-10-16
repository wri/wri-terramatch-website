import { useT } from "@transifex/react";
import { useContext } from "react";

import Breadcrumbs from "@/components/elements/Breadcrumbs/Breadcrumbs";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

import ContentOverview from "../components/ContentOverview";
import SecDashboard from "../components/SecDashboard";
import { RefContext } from "../context/ScrollContext.provider";
import {
  DATA_ACTIVE_COUNTRY,
  JOBS_CREATED_BY_AGE,
  JOBS_CREATED_BY_GENDER,
  LABEL_LEGEND,
  NEW_FULL_TIME_JOBS,
  NEW_PART_TIME_JOBS,
  NUMBER_OF_TREES_PLANTED,
  NUMBER_OF_TREES_PLANTED_BY_YEAR,
  OBJETIVE,
  TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES,
  TOTAL_VOLUNTEERS,
  VOLUNTEERS_CREATED_BY_AGE,
  VOLUNTEERS_CREATED_BY_GENDER
} from "../mockedData/dashboard";

export interface DashboardTableDataProps {
  label: string;
  valueText: string;
  value: number;
}

export interface GraphicLegendProps {
  label: string;
  value: string;
  color: string;
}

export interface DashboardDataProps {
  value?: number;
  unit?: string;
  secondValue?: string;
  graphic?: string;
  tableData?: DashboardTableDataProps[];
  maxValue?: number;
  graphicLegend?: GraphicLegendProps[];
  graphicTargetLandUseTypes?: DashboardTableDataProps[];
  objetiveText?: string;
  preferredLanguage?: string;
  landTenure?: string;
  totalValue?: number;
}

const ProjectView = () => {
  const t = useT();
  const dataToggle = ["Absolute", "Relative"];
  const dataToggleGraphic = ["Table", "Graphic"];
  const sharedRef = useContext(RefContext);
  const dashboardHeader = [
    {
      label: "Trees Planted",
      value: "0",
      tooltip:
        "Total number of trees planted by funded projects to date, including through assisted natural regeneration, as reported through six-month progress reports."
    },
    {
      label: "Hectares Under Restoration",
      value: "0 ha",
      tooltip:
        "Total land area measured in hectares with active restoration interventions, tallied by the total area of polygons submitted by projects and approved by data quality analysts."
    },
    {
      label: "Jobs Created",
      value: "0",
      tooltip:
        "Number of jobs created to date. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 or over in exchange for monetary pay in line with living wage standards."
    }
  ];

  const COLUMN_ACTIVE_COUNTRY = [
    {
      header: "Project",
      accessorKey: "project",
      enableSorting: false
    },
    {
      header: "Trees Planted",
      accessorKey: "treesPlanted",
      enableSorting: false
    },
    {
      header: "Hectares",
      accessorKey: "restoratioHectares",
      enableSorting: false
    },
    {
      header: "Jobs Created",
      accessorKey: "jobsCreated",
      enableSorting: false
    },
    {
      header: "Volunteers",
      accessorKey: "volunteers",
      enableSorting: false
    },
    {
      header: "",
      accessorKey: "link",
      enableSorting: false,
      cell: () => {
        return (
          <a href="/dashboard/project">
            <Icon name={IconNames.IC_ARROW_COLLAPSE} className="h-3 w-3 rotate-90 text-darkCustom hover:text-primary" />
          </a>
        );
      }
    }
  ];

  return (
    <div
      className="mt-4 mb-4 mr-2 flex flex-1 flex-wrap gap-4 overflow-auto bg-neutral-70 pl-4 pr-2 small:flex-nowrap"
      ref={sharedRef}
    >
      <div className="overflow-hiden mx-auto w-full max-w-[730px] small:w-1/2 small:max-w-max">
        <PageRow className="gap-4 p-0">
          <div>
            <Breadcrumbs
              links={[
                { title: t("TerraFund Top100"), path: "/dashboard" },
                { title: t("Niger"), path: "/dashboard/country/AU" },
                { title: t("Restoration of Degraded Forest Lands in Ghana - PADO") }
              ]}
              className="pt-0 "
              textVariant="text-14"
              clasNameText="!no-underline hover:text-primary hover:opacity-100 mt-0.5 hover:mb-0.5 hover:mt-0"
            />
          </div>

          <div className="grid w-full grid-cols-3 gap-4">
            {dashboardHeader.map((item, index) => (
              <div key={index} className="rounded-lg bg-white px-5 py-4.5">
                <Text variant="text-12-light" className="text-darkCustom opacity-60">
                  {t(item.label)}
                </Text>

                <div className="flex items-center gap-2">
                  <Text variant="text-20" className="text-darkCustom" as="span">
                    {t(item.value)}
                  </Text>
                  <ToolTip
                    title={item.label}
                    content={t(item.tooltip)}
                    placement="top"
                    width="w-56 lg:w-64"
                    trigger="click"
                  >
                    <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5" />
                  </ToolTip>
                </div>
              </div>
            ))}
          </div>

          <PageCard className="border-0 px-4 py-6" gap={8}>
            <div className="flex items-center">
              <img src="/images/_AJL2963.jpg" alt="tree" className="mr-5 h-[18vh] w-[14vw] rounded-3xl object-cover" />
              <div>
                <Text variant="text-20-bold">{t("Restoration of Degraded Forest Lands in Ghana - PADO")}</Text>
                <Text variant="text-14-light" className="text-darkCustom">
                  {t("Operations: Niger")}
                  <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                  {t("Registration: Niger")}
                  <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                  {t(" Organization: Non-Profit")}
                </Text>
              </div>
            </div>
            <SecDashboard
              title={t("Objective")}
              classNameTitle="capitalize"
              type="legend"
              data={OBJETIVE}
              variantTitle="text-18-semibold"
            />
          </PageCard>

          <PageCard
            className="border-0 px-4 py-6"
            classNameSubTitle="mt-4"
            gap={8}
            subtitleMore={true}
            title={t("TREES RESTORED")}
            tooltip={t(
              "This section displays data related to Indicator 1: Trees Restored described in <a href='https://terramatchsupport.zendesk.com/hc/en-us/articles/21178354112539-The-TerraFund-Monitoring-Reporting-and-Verification-Framework' target='_blank'>TerraFund’s Monitoring, Reporting, and Verification framework</a>. Please refer to the linked framework for details on how these numbers are sourced and verified."
            )}
            widthTooltip="w-52 lg:w-64"
            iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
            variantSubTitle="text-14-light"
            subtitle={t(
              `The numbers and reports below display data related to Indicator 1: Trees Restored described in <span class="underline">TerraFund’s  MRV framework </span>. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
            )}
          >
            <SecDashboard
              title={t("Number of trees planted")}
              type="legend"
              secondOptionsData={LABEL_LEGEND}
              data={NUMBER_OF_TREES_PLANTED}
              tooltip={t(
                "Total number of trees that funded projects have planted to date, including through assisted natural regeneration, as reported through 6-month progress reports and displayed as progress towards goal."
              )}
            />
            <SecDashboard
              title={t("Number of Trees Planted by Year")}
              type="toggle"
              secondOptionsData={dataToggle}
              tooltipGraphic={true}
              data={NUMBER_OF_TREES_PLANTED_BY_YEAR}
              tooltip={t("Number of trees planted in each year.")}
            />
            <SecDashboard
              title={t("Top 10 Projects With The Most Planted Trees")}
              type="toggle"
              secondOptionsData={dataToggleGraphic}
              data={TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES}
              tooltip={t(
                "The 10 projects that have planted the most trees and the number of trees planted per project. Please note that organization names are listed instead of project names for ease of reference."
              )}
            />
          </PageCard>
          <PageCard
            className="border-0 px-4 py-6"
            classNameSubTitle="mt-4"
            gap={8}
            title={t("JOBS CREATED")}
            variantSubTitle="text-14-light"
            subtitleMore={true}
            widthTooltip="w-80 lg:w-96"
            iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
            tooltip={t(
              "This section displays data related to Indicator 3: Jobs Created described in <a href='https://terramatchsupport.zendesk.com/hc/en-us/articles/21178354112539-The-TerraFund-Monitoring-Reporting-and-Verification-Framework' target='_blank'>TerraFund’s Monitoring, Reporting, and Verification framework</a>. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 years or older in exchange for monetary pay in line with living wage standards. All indicators in the Jobs Created category are disaggregated by number of women, number of men, and number of youths. Restoration Champions are required to report on jobs and volunteers every 6 months and provide additional documentation to verify employment.  Please refer to the linked framework for additional details on how these numbers are sourced and verified."
            )}
            subtitle={t(
              `The numbers and reports below display data related to Indicator 3: Jobs Created described in <span class="underline">TerraFund’s MRV framework</span>. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 or over in exchange for monetary pay in line with living wage standards. All indicators in the Jobs Created category are disaggregated by number of women, number of men, and number of youths. Restoration Champions are required to report on jobs and volunteers every 6 months and provide additional documentation to verify employment. Please refer to the linked MRV framework for additional details on how these numbers are sourced and verified.`
            )}
          >
            <div className="grid w-full auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
              <SecDashboard
                title={t("New Part-Time Jobs")}
                data={NEW_PART_TIME_JOBS}
                classNameBody="w-full place-content-center"
                tooltip={t(
                  "Number of part-time jobs created to date. TerraFund defines a part-time job as under 35 hours per work week."
                )}
              />
              <SecDashboard
                title={t("New Full-Time Jobs")}
                data={NEW_FULL_TIME_JOBS}
                className="pl-12"
                classNameBody="w-full place-content-center"
                tooltip={t(
                  "Number of full-time jobs created to date. TerraFund defines a full-time job as over 35 hours per work week."
                )}
              />
            </div>
            <div className="grid w-full grid-cols-2 gap-12">
              <SecDashboard
                title={t("Jobs Created by Gender")}
                data={JOBS_CREATED_BY_GENDER}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t("Total number of jobs created broken down by gender.")}
              />
              <SecDashboard
                title={t("Jobs Created by Age")}
                data={JOBS_CREATED_BY_AGE}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(
                  "Total number of jobs created broken down by age group. Youth is defined as 18-35 years old. Non-youth is defined as older than 35 years old."
                )}
              />
            </div>
            <SecDashboard
              title={t("Total Volunteers")}
              data={TOTAL_VOLUNTEERS}
              tooltip={t(
                "Number of unpaid volunteers contributing to the project. A volunteer is an individual that freely dedicates their time to the project because they see value in doing so but does not receive payment for their work. Paid workers or beneficiaries who do not dedicate their time to the project are not considered volunteers."
              )}
            />
            <div className="grid w-full grid-cols-2 gap-12">
              <SecDashboard
                title={t("Volunteers Created by Gender")}
                data={VOLUNTEERS_CREATED_BY_GENDER}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t("Total number of volunteers broken down by gender.")}
              />
              <SecDashboard
                title={t("Volunteers Created by Age")}
                data={VOLUNTEERS_CREATED_BY_AGE}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(
                  "Total number of volunteers broken down by age group. Youth is defined as 18-35 years old. Non-youth is defined as older than 35 years old."
                )}
              />
            </div>
          </PageCard>
        </PageRow>
      </div>
      <ContentOverview
        dataTable={DATA_ACTIVE_COUNTRY}
        columns={COLUMN_ACTIVE_COUNTRY}
        titleTable={t("ACTIVE PROJECTS")}
        textTooltipTable={t(
          "For each project, this table shows the number of trees planted, hectares under restoration, jobs created, and volunteers engaged to date. Those with access to individual project pages can click directly on table rows to dive deep."
        )}
      />
    </div>
  );
};

export default ProjectView;
