import { useT } from "@transifex/react";
import { useEffect } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { CHART_TYPES, JOBS_CREATED_CHART_TYPE } from "@/constants/dashbordConsts";
import { useDashboardContext } from "@/context/dashboard.provider";

import ContentOverview from "./components/ContentOverview";
import SecDashboard from "./components/SecDashboard";
import { useDashboardData } from "./hooks/useDashboardData";
import {
  LABEL_LEGEND,
  TOTAL_VOLUNTEERS,
  VOLUNTEERS_CREATED_BY_AGE,
  VOLUNTEERS_CREATED_BY_GENDER
} from "./mockedData/dashboard";

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

const Dashboard = () => {
  const t = useT();
  const { filters } = useDashboardContext();
  const {
    dashboardHeader,
    dashboardRestorationGoalData,
    jobsCreatedData,
    numberTreesPlanted,
    topProject,
    refetchTotalSectionHeader,
    centroidsDataProjects,
    polygonsData,
    activeCountries,
    activeProjects,
    listViewProjects
  } = useDashboardData(filters);

  const dataToggle = ["Absolute", "Relative"];
  const dataToggleGraphic = ["Table", "Graphic"];

  useEffect(() => {
    refetchTotalSectionHeader();
  }, [filters]);

  const COLUMN_ACTIVE_PROGRAMME = [
    {
      header: "Country",
      cell: (props: any) => {
        const value = props.getValue().split("_");
        return (
          <div className="flex items-center gap-2">
            <img src={value[1]} alt="flag" className="h-3" />
            <Text variant="text-12-light">{value[0]}</Text>
          </div>
        );
      },
      accessorKey: "country",
      enableSorting: false
    },
    {
      header: "Projects",
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
      accessorKey: "restorationHectares",
      enableSorting: false
    },
    {
      header: "Jobs Created",
      accessorKey: "jobsCreated",
      enableSorting: false
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
      accessorKey: "restorationHectares",
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

  const DATA_ACTIVE_PROGRAMME = activeCountries?.data
    ? activeCountries.data.map(
        (item: {
          country: string;
          country_slug: string;
          number_of_projects: number;
          total_trees_planted: number;
          total_jobs_created: number;
          hectares_restored: number;
        }) => ({
          country: `${item.country}_/flags/${item.country_slug.toLowerCase()}.svg`,
          project: item.number_of_projects.toLocaleString(),
          treesPlanted: item.total_trees_planted.toLocaleString(),
          restorationHectares: item.hectares_restored.toLocaleString(),
          jobsCreated: item.total_jobs_created.toLocaleString()
        })
      )
    : [];

  const DATA_ACTIVE_COUNTRY = activeProjects
    ? activeProjects?.map(
        (item: {
          uuid: string;
          name: string;
          hectares_under_restoration: number;
          trees_under_restoration: number;
          jobs_created: number;
          volunteers: number;
        }) => ({
          uuid: item.uuid,
          project: item?.name,
          treesPlanted: item.trees_under_restoration.toLocaleString(),
          restorationHectares: item.hectares_under_restoration.toLocaleString(),
          jobsCreated: item.jobs_created.toLocaleString(),
          volunteers: item.volunteers.toLocaleString()
        })
      )
    : [];

  const parseJobCreatedByType = (data: any, type: string) => {
    if (!data) return { type, chartData: [] };

    const ptWomen = data.total_pt_women || 0;
    const ptMen = data.total_pt_men || 0;
    const ptYouth = data.total_pt_youth || 0;
    const ptNonYouth = data.total_pt_non_youth || 0;
    const maxValue = Math.max(ptWomen, ptMen, ptYouth, ptNonYouth);
    const chartData = [
      {
        name: "Part-Time",
        [type === JOBS_CREATED_CHART_TYPE.gender ? "Women" : "Youth"]:
          data[`total_pt_${type === JOBS_CREATED_CHART_TYPE.gender ? "women" : "youth"}`],
        [type === JOBS_CREATED_CHART_TYPE.gender ? "Men" : "Non-Youth"]:
          data[`total_pt_${type === JOBS_CREATED_CHART_TYPE.gender ? "men" : "non_youth"}`]
      },
      {
        name: "Full-Time",
        [type === JOBS_CREATED_CHART_TYPE.gender ? "Women" : "Youth"]:
          data[`total_ft_${type === JOBS_CREATED_CHART_TYPE.gender ? "women" : "youth"}`],
        [type === JOBS_CREATED_CHART_TYPE.gender ? "Men" : "Non-Youth"]:
          data[`total_ft_${type === JOBS_CREATED_CHART_TYPE.gender ? "men" : "non_youth"}`]
      }
    ];
    return { type, chartData, total: data.totalJobsCreated, maxValue };
  };

  return (
    <div className="mb-4 mr-2 mt-4 flex flex-1 flex-wrap gap-4 overflow-auto bg-neutral-70 pl-4 pr-2 small:flex-nowrap">
      <div className="overflow-hiden mx-auto w-full max-w-[730px] small:w-1/2 small:max-w-max">
        <PageRow className="gap-4 p-0">
          <When condition={filters.country.id !== 0}>
            <div className="flex items-center gap-2">
              <Text variant="text-14-light" className="uppercase text-black ">
                {t("results for:")}
              </Text>
              <img src={filters.country?.data.icon} alt="flag" className="h-6 w-8 object-cover" />
              <Text variant="text-24-semibold" className="text-black">
                {t(filters.country?.data.label)}
              </Text>
            </div>
          </When>
          <div className="grid w-full grid-cols-3 gap-4">
            {dashboardHeader.map((item, index) => (
              <div key={index} className="rounded-lg bg-white px-4 py-3">
                <Text variant="text-12-light" className="text-darkCustom opacity-60">
                  {t(item.label)}
                </Text>

                <div className="flex items-center gap-2">
                  <Text variant="text-20" className="text-darkCustom" as="span">
                    {t(item.value)}
                  </Text>
                  <ToolTip
                    title={t(item.label)}
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

          <PageCard
            className="border-0 px-4 py-6"
            classNameSubTitle="mt-4"
            gap={8}
            subtitleMore={true}
            title={t("Trees Restored")}
            tooltip={t(
              "This section displays data related to Indicator 1: Trees Restored described in <a href='https://terramatchsupport.zendesk.com/hc/en-us/articles/21178354112539-The-TerraFund-Monitoring-Reporting-and-Verification-Framework' target='_blank'>TerraFund’s Monitoring, Reporting, and Verification framework</a>. Please refer to the linked framework for details on how these numbers are sourced and verified."
            )}
            widthTooltip="w-52 lg:w-64"
            iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
            variantSubTitle="text-14-light"
            subtitle={t(
              `The numbers and reports below display data related to Indicator 1: Trees Restored described in <span class="underline">TerraFund's MRV framework</span>. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
            )}
          >
            <SecDashboard
              title={t("Number of Trees Planted")}
              type="legend"
              secondOptionsData={LABEL_LEGEND}
              tooltip={t(
                "Total number of trees that funded projects have planted to date, including through assisted natural regeneration, as reported through 6-month progress reports and displayed as progress towards goal."
              )}
              data={numberTreesPlanted}
              dataForChart={dashboardRestorationGoalData}
              chartType={CHART_TYPES.treesPlantedBarChart}
            />
            <SecDashboard
              title={t("Number of Trees Planted by Year")}
              type="toggle"
              secondOptionsData={dataToggle}
              tooltipGraphic={true}
              data={{}}
              dataForChart={dashboardRestorationGoalData}
              chartType={CHART_TYPES.multiLineChart}
              tooltip={t("Number of trees planted in each year.")}
            />
            <SecDashboard
              title={t("Top 5 Projects with the Most Planted Trees")}
              type="toggle"
              secondOptionsData={dataToggleGraphic}
              data={topProject}
              isTableProject={true}
              tooltip={t(
                "The 5 projects that have planted the most trees and the number of trees planted per project. Please note that organization names are listed instead of project names for ease of reference."
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
              `The numbers and reports below display data related to Indicator 3: Jobs Created described in <span class="underline">TerraFund's MRV framework</span>. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 or over in exchange for monetary pay in line with living wage standards. All indicators in the Jobs Created category are disaggregated by number of women, number of men, and number of youths. Restoration Champions are required to report on jobs and volunteers every 6 months and provide additional documentation to verify employment. Please refer to the linked MRV framework for additional details on how these numbers are sourced and verified.`
            )}
          >
            <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
              <SecDashboard
                title={t("New Part-Time Jobs")}
                data={{ value: jobsCreatedData?.data?.total_pt }}
                classNameBody="w-full place-content-center"
                tooltip={t(
                  "Number of part-time jobs created to date. TerraFund defines a part-time job as under 35 hours per work week."
                )}
              />
              <SecDashboard
                title={t("New Full-Time Jobs")}
                data={{ value: jobsCreatedData?.data?.total_ft }}
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
                data={{}}
                dataForChart={parseJobCreatedByType(jobsCreatedData?.data, JOBS_CREATED_CHART_TYPE.gender)}
                chartType="groupedBarChart"
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t("Total number of jobs created broken down by gender.")}
              />
              <SecDashboard
                title={t("Jobs Created by Age")}
                data={{}}
                dataForChart={parseJobCreatedByType(jobsCreatedData?.data, JOBS_CREATED_CHART_TYPE.age)}
                chartType="groupedBarChart"
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
        dataTable={filters.country.id === 0 ? DATA_ACTIVE_PROGRAMME : DATA_ACTIVE_COUNTRY}
        centroids={centroidsDataProjects}
        columns={filters.country.id === 0 ? COLUMN_ACTIVE_PROGRAMME : COLUMN_ACTIVE_COUNTRY}
        titleTable={t(filters.country.id === 0 ? "ACTIVE COUNTRIES" : "ACTIVE PROJECTS")}
        textTooltipTable={t(
          filters.country.id === 0
            ? "For each country, this table shows the number of projects, trees planted, hectares under restoration, and jobs created to date."
            : "For each project, this table shows the number of trees planted, hectares under restoration, jobs created, and volunteers engaged to date. Those with access to individual project pages can click directly on table rows to dive deep."
        )}
        polygonsData={polygonsData}
        listViewProjects={listViewProjects}
      />
    </div>
  );
};

export default Dashboard;
