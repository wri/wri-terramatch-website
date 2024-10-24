import { useT } from "@transifex/react";
import { useEffect } from "react";
import { When } from "react-if";

import Breadcrumbs from "@/components/elements/Breadcrumbs/Breadcrumbs";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { CHART_TYPES, JOBS_CREATED_CHART_TYPE, ORGANIZATIONS_TYPES } from "@/constants/dashboardConsts";
import { useDashboardContext } from "@/context/dashboard.provider";
import {
  formatLabelsVolunteers,
  getFrameworkName,
  parseDataToObjetive,
  parseHectaresUnderRestorationData
} from "@/utils/dashboardUtils";

import ContentOverview from "./components/ContentOverview";
import SecDashboard from "./components/SecDashboard";
import {
  ACTIVE_COUNTRIES_TOOLTIP,
  ACTIVE_PROJECTS_TOOLTIP,
  JOBS_CREATED_BY_AGE_TOOLTIP,
  JOBS_CREATED_BY_GENDER_TOOLTIP,
  NEW_FULL_TIME_JOBS_TOOLTIP,
  NEW_PART_TIME_JOBS_TOOLTIP,
  NUMBER_OF_TREES_PLANTED_BY_YEAR_TOOLTIP,
  TOP_5_PROJECTS_WITH_MOST_PLANTED_TREES_TOOLTIP,
  TOTAL_VOLUNTEERS_TOOLTIP,
  TREES_RESTORED_SECTION_TOOLTIP,
  VOLUNTEERS_CREATED_BY_AGE_TOOLTIP,
  VOLUNTEERS_CREATED_BY_GENDER_TOOLTIP
} from "./constants/tooltips";
import {
  JOBS_CREATED_SECTION_TOOLTIP,
  NO_DATA_PRESENT_ACTIVE_PROJECT_TOOLTIPS,
  NUMBER_OF_TREES_PLANTED_TOOLTIP
} from "./constants/tooltips";
import { useDashboardData } from "./hooks/useDashboardData";
import { LABEL_LEGEND } from "./mockedData/dashboard";

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
  const { filters, setFilters, frameworks } = useDashboardContext();
  const {
    dashboardHeader,
    dashboardRestorationGoalData,
    jobsCreatedData,
    dashboardVolunteersSurvivalRate,
    totalSectionHeader,
    hectaresUnderRestoration,
    numberTreesPlanted,
    dashboardProjectDetails,
    topProject,
    refetchTotalSectionHeader,
    centroidsDataProjects,
    polygonsData,
    activeCountries,
    activeProjects
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
      cell: ({ row }: { row: { original: { uuid: string } } }) => {
        const uuid = row.original.uuid;
        const handleClick = () => {
          setFilters(prevValues => ({
            ...prevValues,
            uuid: uuid
          }));
        };

        return (
          <button onClick={handleClick}>
            <Icon name={IconNames.IC_ARROW_COLLAPSE} className="h-3 w-3 rotate-90 text-darkCustom hover:text-primary" />
          </button>
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

  const parseVolunteersByType = (data: any, type: string) => {
    if (!data) return { type, chartData: [] };
    const firstvalue = type === JOBS_CREATED_CHART_TYPE.gender ? "women" : "youth";
    const secondValue = type === JOBS_CREATED_CHART_TYPE.gender ? "men" : "non_youth";
    const chartData = [
      { name: formatLabelsVolunteers(firstvalue), value: data[`${firstvalue}_volunteers`] },
      { name: formatLabelsVolunteers(secondValue), value: data[`${secondValue}_volunteers`] }
    ];
    return { type, chartData, total: data.total_volunteers };
  };

  return (
    <div className="mt-4 mb-4 mr-2 flex flex-1 flex-wrap gap-4 overflow-auto bg-neutral-70 pl-4 pr-2 small:flex-nowrap">
      <div className="overflow-hiden mx-auto w-full max-w-[730px] small:w-1/2 small:max-w-max">
        <PageRow className="gap-4 p-0">
          <When condition={filters.country.id !== 0 && !filters.uuid}>
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
          <When condition={filters.uuid}>
            <div>
              <Breadcrumbs
                links={[
                  {
                    title: t(`${getFrameworkName(frameworks, dashboardProjectDetails?.framework)}`),
                    path: "/dashboard"
                  },
                  { title: t(`${dashboardProjectDetails?.country}`), path: "/dashboard/country/AU" },
                  { title: t(`${dashboardProjectDetails?.name}`) }
                ]}
                className="pt-0 "
                textVariant="text-14"
                clasNameText="!no-underline hover:text-primary hover:opacity-100 mt-0.5 hover:mb-0.5 hover:mt-0"
              />
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
          <When condition={filters.uuid}>
            <PageCard className="border-0 px-4 py-6" gap={8}>
              <div className="flex items-center">
                <img
                  src="/images/_AJL2963.jpg"
                  alt="tree"
                  className="mr-5 h-[18vh] w-[14vw] rounded-3xl object-cover"
                />
                <div>
                  <Text variant="text-20-bold">{t(dashboardProjectDetails?.name)}</Text>
                  <Text variant="text-14-light" className="text-darkCustom">
                    {t(`Operations: ${dashboardProjectDetails?.country}`)}
                    <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                    {t(`Registration: ${dashboardProjectDetails?.country}`)}
                    <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                    {t(
                      `Organization: ${
                        ORGANIZATIONS_TYPES[dashboardProjectDetails?.organisation as keyof typeof ORGANIZATIONS_TYPES]
                      }`
                    )}
                  </Text>
                </div>
              </div>
              <SecDashboard
                title={t("Objective")}
                classNameTitle="capitalize"
                type="legend"
                data={parseDataToObjetive(dashboardProjectDetails)}
                variantTitle="text-18-semibold"
              />
            </PageCard>
          </When>
          <PageCard
            className="border-0 px-4 py-6"
            classNameSubTitle="mt-4"
            gap={8}
            subtitleMore={true}
            title={t("Trees Restored")}
            tooltip={t(TREES_RESTORED_SECTION_TOOLTIP)}
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
              tooltip={t(NUMBER_OF_TREES_PLANTED_TOOLTIP)}
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
              tooltip={t(NUMBER_OF_TREES_PLANTED_BY_YEAR_TOOLTIP)}
            />
            <When condition={!filters.uuid}>
              <SecDashboard
                title={t("Top 5 Projects with the Most Planted Trees")}
                type="toggle"
                secondOptionsData={dataToggleGraphic}
                data={topProject}
                isTableProject={true}
                tooltip={t(TOP_5_PROJECTS_WITH_MOST_PLANTED_TREES_TOOLTIP)}
              />
            </When>
          </PageCard>

          <PageCard
            className="border-0 px-4 py-6"
            classNameSubTitle="mt-4"
            gap={8}
            title={t("JOBS CREATED")}
            variantSubTitle="text-14-light"
            subtitleMore={true}
            tooltipTrigger="click"
            widthTooltip="w-80 lg:w-96"
            iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
            tooltip={t(JOBS_CREATED_SECTION_TOOLTIP)}
            subtitle={t(
              `The numbers and reports below display data related to Indicator 3: Jobs Created described in <span class="underline">TerraFund's MRV framework</span>. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 or over in exchange for monetary pay in line with living wage standards. All indicators in the Jobs Created category are disaggregated by number of women, number of men, and number of youths. Restoration Champions are required to report on jobs and volunteers every 6 months and provide additional documentation to verify employment. Please refer to the linked MRV framework for additional details on how these numbers are sourced and verified.`
            )}
          >
            <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
              <SecDashboard
                title={t("New Part-Time Jobs")}
                data={{ value: jobsCreatedData?.data?.total_pt }}
                classNameBody="w-full place-content-center"
                tooltip={t(NEW_PART_TIME_JOBS_TOOLTIP)}
              />
              <SecDashboard
                title={t("New Full-Time Jobs")}
                data={{ value: jobsCreatedData?.data?.total_ft }}
                className="pl-12"
                classNameBody="w-full place-content-center"
                tooltip={t(NEW_FULL_TIME_JOBS_TOOLTIP)}
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
                tooltip={t(JOBS_CREATED_BY_GENDER_TOOLTIP)}
              />
              <SecDashboard
                title={t("Jobs Created by Age")}
                data={{}}
                dataForChart={parseJobCreatedByType(jobsCreatedData?.data, JOBS_CREATED_CHART_TYPE.age)}
                chartType="groupedBarChart"
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(JOBS_CREATED_BY_AGE_TOOLTIP)}
              />
            </div>
            <SecDashboard
              title={t("Total Volunteers")}
              data={{ value: dashboardVolunteersSurvivalRate?.total_volunteers }}
              tooltip={t(TOTAL_VOLUNTEERS_TOOLTIP)}
            />
            <div className="grid w-full grid-cols-2 gap-12">
              <SecDashboard
                title={t("Volunteers Created by Gender")}
                data={{}}
                chartType={CHART_TYPES.doughnutChart}
                dataForChart={parseVolunteersByType(dashboardVolunteersSurvivalRate, JOBS_CREATED_CHART_TYPE.gender)}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(VOLUNTEERS_CREATED_BY_GENDER_TOOLTIP)}
              />
              <SecDashboard
                title={t("Volunteers Created by Age")}
                data={{}}
                chartType={CHART_TYPES.doughnutChart}
                dataForChart={parseVolunteersByType(dashboardVolunteersSurvivalRate, JOBS_CREATED_CHART_TYPE.age)}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(VOLUNTEERS_CREATED_BY_AGE_TOOLTIP)}
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
        dataHectaresUnderRestoration={parseHectaresUnderRestorationData(
          totalSectionHeader,
          dashboardVolunteersSurvivalRate,
          hectaresUnderRestoration
        )}
        textTooltipTable={t(
          filters.country.id === 0
            ? ACTIVE_COUNTRIES_TOOLTIP
            : DATA_ACTIVE_COUNTRY.length > 0
            ? ACTIVE_PROJECTS_TOOLTIP
            : NO_DATA_PRESENT_ACTIVE_PROJECT_TOOLTIPS
        )}
        polygonsData={polygonsData}
      />
    </div>
  );
};

export default Dashboard;
