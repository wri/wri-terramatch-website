import { useT } from "@transifex/react";
import { useEffect } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import BlurContainer from "@/components/extensive/BlurContainer/BlurContainer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useMyUser } from "@/connections/User";
import {
  CHART_TYPES,
  JOBS_CREATED_CHART_TYPE,
  NO_DATA_INFORMATION,
  ORGANIZATIONS_TYPES,
  TERRAFUND_MRV_LINK
} from "@/constants/dashboardConsts";
import { useDashboardContext } from "@/context/dashboard.provider";
import {
  formatLabelsVolunteers,
  getCoverFileUrl,
  getFrameworkName,
  parseDataToObjetive,
  parseHectaresUnderRestorationData
} from "@/utils/dashboardUtils";

import ContentOverview from "./components/ContentOverview";
import DashboardBreadcrumbs from "./components/DashboardBreadcrumbs";
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
  VOLUNTEERS_CREATED_BY_AGE_TOOLTIP,
  VOLUNTEERS_CREATED_BY_GENDER_TOOLTIP
} from "./constants/tooltips";
import { NO_DATA_PRESENT_ACTIVE_PROJECT_TOOLTIPS, NUMBER_OF_TREES_PLANTED_TOOLTIP } from "./constants/tooltips";
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
  const [, { user }] = useMyUser();
  const { filters, setFilters, frameworks } = useDashboardContext();
  const {
    dashboardHeader,
    dashboardRestorationGoalData,
    jobsCreatedData,
    dashboardVolunteersSurvivalRate,
    totalSectionHeader,
    hectaresUnderRestoration,
    numberTreesPlanted,
    isLoadingJobsCreated,
    isLoadingHectaresUnderRestoration,
    isLoadingTreeRestorationGoal,
    isLoadingVolunteers,
    dashboardProjectDetails,
    topProject,
    refetchTotalSectionHeader,
    centroidsDataProjects,
    activeCountries,
    activeProjects,
    polygonsData,
    countryBbox,
    projectBbox,
    isUserAllowed
  } = useDashboardData(filters);

  const dataToggle = [
    { tooltip: { key: "Absolute", render: "Absolute" } },
    { tooltip: { key: "Relative", render: "Relative" } }
  ];
  const dataToggleGraphic = [
    { tooltip: { key: "Table", render: "Table" } },
    { tooltip: { key: "Graph", render: "Graph" } }
  ];

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
            <img src={value[1]} alt="flag" className="h-3 w-5 min-w-[20px] object-cover" />
            <Text variant="text-14">{value[0]}</Text>
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
      enableSorting: false,
      cell: (props: any) => {
        const value = props.getValue().split("_");
        return <span className="two-line-text text-14-light">{value}</span>;
      }
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

  const DATA_ACTIVE_PROGRAMME = Array.isArray(activeCountries?.data)
    ? activeCountries?.data.map(
        (item: {
          country: string;
          country_slug: string;
          number_of_projects: number;
          total_trees_planted: number;
          total_jobs_created: number;
          hectares_restored: number;
        }) => ({
          country_slug: item.country_slug,
          country: `${item.country}_/flags/${item.country_slug.toLowerCase()}.svg`,
          project: item.number_of_projects.toLocaleString(),
          treesPlanted: item.total_trees_planted.toLocaleString(),
          restorationHectares: item.hectares_restored.toLocaleString(),
          jobsCreated: item.total_jobs_created.toLocaleString()
        })
      )
    : [];

  const mapActiveProjects = (excludeUUID?: string) => {
    return activeProjects
      ? activeProjects
          .filter((item: { uuid: string }) => !excludeUUID || item.uuid !== excludeUUID)
          .map((item: any) => ({
            uuid: item.uuid,
            project: item.name,
            treesPlanted: item.trees_under_restoration.toLocaleString(),
            restorationHectares: item.hectares_under_restoration.toLocaleString(),
            jobsCreated: item.jobs_created.toLocaleString(),
            volunteers: item.volunteers.toLocaleString()
          }))
      : [];
  };

  const DATA_ACTIVE_COUNTRY = mapActiveProjects();
  const DATA_ACTIVE_COUNTRY_WITHOUT_UUID = mapActiveProjects(filters.uuid);

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
  const projectCounts = {
    total_enterprise_count: totalSectionHeader?.total_enterprise_count,
    total_non_profit_count: totalSectionHeader?.total_non_profit_count
  };
  return (
    <div className="mb-4 mr-2 mt-4 flex flex-1 flex-wrap gap-4 overflow-y-auto overflow-x-hidden bg-neutral-70 pl-4 pr-2 small:flex-nowrap">
      <div className="overflow-hiden mx-auto w-full max-w-[730px] small:w-1/2 small:max-w-max">
        <PageRow className="gap-4 p-0">
          <When condition={filters.country.id !== 0 && !filters.uuid}>
            <div className="flex items-center gap-2">
              <Text variant="text-14-light" className="uppercase text-black ">
                {t("results for:")}
              </Text>
              <img src={filters.country?.data.icon} alt="flag" className="h-6 w-10 min-w-[40px] object-cover" />
              <Text variant="text-24-semibold" className="text-black">
                {t(filters.country?.data.label)}
              </Text>
            </div>
          </When>
          <When condition={filters.uuid}>
            <div>
              <DashboardBreadcrumbs
                framework={getFrameworkName(frameworks, dashboardProjectDetails?.data?.framework) || ""}
                countryId={dashboardProjectDetails?.data?.country_id}
                countryName={dashboardProjectDetails?.data?.country}
                countrySlug={dashboardProjectDetails?.data?.country_slug}
                projectName={dashboardProjectDetails?.data?.name}
                className="pt-0"
                textVariant="text-14"
                clasNameText="!no-underline mt-0.5 hover:mb-0.5 hover:mt-0"
              />
            </div>
          </When>
          <BlurContainer
            isBlur={isUserAllowed !== undefined ? !isUserAllowed?.allowed : false}
            textInformation={user !== undefined ? NO_DATA_INFORMATION : <></>}
          >
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
                      <Icon name={IconNames.IC_INFO} className="h-4.5 w-4.5 text-darkCustom lg:h-5 lg:w-5" />
                    </ToolTip>
                  </div>
                </div>
              ))}
            </div>
          </BlurContainer>
          <When condition={filters.uuid}>
            <PageCard className="border-0 px-4 py-6" gap={8}>
              <div className="flex items-center">
                <img
                  src={getCoverFileUrl(dashboardProjectDetails?.data?.file) ?? "/images/_AJL2963.jpg"}
                  alt="tree"
                  className="mr-5 h-[18vh] w-[14vw] rounded-3xl object-cover"
                />
                <div>
                  <Text variant="text-20-bold">{t(dashboardProjectDetails?.data?.name)}</Text>
                  <Text variant="text-14-light" className="text-darkCustom">
                    {t(`Operations: ${dashboardProjectDetails?.data?.country}`)}
                    <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                    {t(`Registration: ${dashboardProjectDetails?.data?.country}`)}
                    <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                    {t(
                      `Organization: ${
                        ORGANIZATIONS_TYPES[
                          dashboardProjectDetails?.data?.organisation as keyof typeof ORGANIZATIONS_TYPES
                        ]
                      }`
                    )}
                    <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                    {t(`Programme: ${getFrameworkName(frameworks, dashboardProjectDetails?.data?.framework)}`)}
                  </Text>
                </div>
              </div>
              <SecDashboard
                title={t("Objective")}
                classNameTitle="capitalize"
                type="legend"
                data={parseDataToObjetive(dashboardProjectDetails?.data)}
                variantTitle="text-18-semibold"
              />
            </PageCard>
          </When>
          <PageCard
            className="border-0 px-4 py-6"
            classNameSubTitle="mt-4"
            gap={8}
            subtitleMore={true}
            isUserAllowed={isUserAllowed?.allowed}
            title={t("TREES RESTORED")}
            widthTooltip="w-52 lg:w-64"
            iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
            variantSubTitle="text-14-light"
            subtitle={t(
              `The numbers and reports below display data related to Indicator 1: Trees Restored described in ${TERRAFUND_MRV_LINK}. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
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
              isUserAllowed={isUserAllowed?.allowed}
            />
            <SecDashboard
              title={t("Number of Trees Planted by Year")}
              type="toggle"
              secondOptionsData={dataToggle}
              isProjectView={!!filters.uuid}
              classNameBody="ml-[-20px] lg:ml-[-15px]"
              data={{}}
              dataForChart={dashboardRestorationGoalData}
              chartType={CHART_TYPES.multiLineChart}
              tooltip={t(NUMBER_OF_TREES_PLANTED_BY_YEAR_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
              isLoading={isLoadingTreeRestorationGoal}
            />
            <When condition={!filters.uuid}>
              <SecDashboard
                title={t("Top 5 projects with the Most Planted Trees")}
                type="toggle"
                secondOptionsData={dataToggleGraphic}
                data={topProject}
                isTableProject={true}
                tooltip={t(TOP_5_PROJECTS_WITH_MOST_PLANTED_TREES_TOOLTIP)}
                isUserAllowed={isUserAllowed?.allowed}
              />
            </When>
          </PageCard>

          <PageCard
            className="border-0 px-4 py-6"
            classNameSubTitle="mt-4"
            gap={8}
            isUserAllowed={isUserAllowed?.allowed}
            title={t("JOBS CREATED")}
            variantSubTitle="text-14-light"
            subtitleMore={true}
            tooltipTrigger="click"
            widthTooltip="w-80 lg:w-96"
            iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
            subtitle={t(
              `The numbers and reports below display data related to Indicator 3: Jobs Created described in ${TERRAFUND_MRV_LINK}. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 or over in exchange for monetary pay in line with living wage standards. All indicators in the Jobs Created category are disaggregated by number of women, number of men, and number of youths. Restoration Champions are required to report on jobs and volunteers every 6 months and provide additional documentation to verify employment. Please refer to the linked MRV framework for additional details on how these numbers are sourced and verified.`
            )}
          >
            <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
              <SecDashboard
                title={t("New Part-Time Jobs")}
                data={{ value: jobsCreatedData?.total_pt }}
                classNameBody="w-full place-content-center"
                tooltip={t(NEW_PART_TIME_JOBS_TOOLTIP)}
                isUserAllowed={isUserAllowed?.allowed}
              />
              <SecDashboard
                title={t("New Full-Time Jobs")}
                data={{ value: jobsCreatedData?.total_ft }}
                className="pl-12"
                classNameBody="w-full place-content-center"
                tooltip={t(NEW_FULL_TIME_JOBS_TOOLTIP)}
                isUserAllowed={isUserAllowed?.allowed}
              />
            </div>
            <div className="grid w-full grid-cols-2">
              <SecDashboard
                title={t("Jobs Created by Gender")}
                data={{}}
                dataForChart={parseJobCreatedByType(jobsCreatedData, JOBS_CREATED_CHART_TYPE.gender)}
                chartType="groupedBarChart"
                classNameHeader="pl-[50px]"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(JOBS_CREATED_BY_GENDER_TOOLTIP)}
                isUserAllowed={isUserAllowed?.allowed}
                isLoading={isLoadingJobsCreated}
              />
              <SecDashboard
                title={t("Jobs Created by Age")}
                data={{}}
                dataForChart={parseJobCreatedByType(jobsCreatedData, JOBS_CREATED_CHART_TYPE.age)}
                chartType="groupedBarChart"
                classNameHeader="pl-[50px]"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(JOBS_CREATED_BY_AGE_TOOLTIP)}
                isUserAllowed={isUserAllowed?.allowed}
                isLoading={isLoadingJobsCreated}
              />
            </div>
            <SecDashboard
              title={t("Total Volunteers")}
              data={{ value: dashboardVolunteersSurvivalRate?.total_volunteers }}
              tooltip={t(TOTAL_VOLUNTEERS_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
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
                isUserAllowed={isUserAllowed?.allowed}
                isLoading={isLoadingVolunteers}
              />
              <SecDashboard
                title={t("Volunteers Created by Age")}
                data={{}}
                chartType={CHART_TYPES.doughnutChart}
                dataForChart={parseVolunteersByType(dashboardVolunteersSurvivalRate, JOBS_CREATED_CHART_TYPE.age)}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(VOLUNTEERS_CREATED_BY_AGE_TOOLTIP)}
                isUserAllowed={isUserAllowed?.allowed}
                isLoading={isLoadingVolunteers}
              />
            </div>
          </PageCard>
        </PageRow>
      </div>
      <ContentOverview
        dataTable={
          filters.country.id === 0
            ? DATA_ACTIVE_PROGRAMME
            : filters.uuid
            ? DATA_ACTIVE_COUNTRY_WITHOUT_UUID
            : DATA_ACTIVE_COUNTRY
        }
        centroids={centroidsDataProjects}
        columns={filters.country.id === 0 ? COLUMN_ACTIVE_PROGRAMME : COLUMN_ACTIVE_COUNTRY}
        titleTable={t(
          filters.country.id === 0
            ? "ACTIVE COUNTRIES"
            : filters.uuid
            ? `Other Projects in ${filters?.country?.data?.label}`
            : "ACTIVE PROJECTS"
        )}
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
        isUserAllowed={isUserAllowed?.allowed}
        isLoadingHectaresUnderRestoration={isLoadingHectaresUnderRestoration}
        polygonsData={polygonsData}
        bbox={filters.uuid ? projectBbox : countryBbox}
        projectCounts={projectCounts}
      />
    </div>
  );
};

export default Dashboard;
