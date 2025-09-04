import { useMediaQuery } from "@mui/material";
import { T, useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { Else, If, Then, When } from "react-if";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import BlurContainer from "@/components/extensive/BlurContainer/BlurContainer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import { useGadmChoices } from "@/connections/Gadm";
import { useMyUser } from "@/connections/User";
import { CHART_TYPES, ORGANIZATIONS_TYPES, TEXT_TYPES } from "@/constants/dashboardConsts";
import { CountriesProps, useDashboardContext } from "@/context/dashboard.provider";
import { DashboardProjectsLightDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { logout } from "@/generated/v3/utils";
import { useValueChanged } from "@/hooks/useValueChanged";
import {
  formatCohortDisplay,
  parseDataToObjetive,
  parseHectaresUnderRestorationData,
  parseJobCreatedByType,
  parseVolunteersByType
} from "@/utils/dashboardUtils";

import ContentDashboardtWrapper from "./components/ContentDashboardWrapper";
import ContentOverview, { IMPACT_STORIES_TOOLTIP } from "./components/ContentOverview";
import DashboardBreadcrumbs from "./components/DashboardBreadcrumbs";
import SecDashboard from "./components/SecDashboard";
import { useDashboardData } from "./hooks/useDashboardData";

export const ACTIVE_COUNTRIES_TOOLTIP =
  "For each country, this table shows the number of projects, trees planted, hectares under restoration, and jobs created to date.";
export const ACTIVE_PROJECTS_TOOLTIP =
  "For each project, this table shows the number of trees planted, hectares under restoration, jobs created, and volunteers engaged to date. Those with access to individual project pages can click directly on table rows to dive deep.";
export const JOBS_CREATED_BY_AGE_TOOLTIP =
  "Total number of employees broken down by age group. Youth is defined as 18-35 years old. Non-youth is defined as older than 35 years old. 'Unknown' refers to number of people whose age has not been specified.";
export const JOBS_CREATED_BY_GENDER_TOOLTIP =
  "Total number of employees broken down by gender. 'Unknown' refers to number of people whose gender has not been specified.";
export const NEW_FULL_TIME_JOBS_TOOLTIP =
  "Number of full-time jobs created to date. TerraFund defines a full-time employee as people that are regularly paid for their work on the project and are working more than 35 hours per week throughout the year.";
export const NEW_PART_TIME_JOBS_TOOLTIP =
  "Number of people working part-time jobs to date. Terrafund defines a part-time job as a person working regularly, paid for work on the project but working under 35 hours per work week. Part-time includes all employees engaged on a temporary, casual, or seasonal basis.";
export const NO_DATA_PRESENT_ACTIVE_PROJECT_TOOLTIPS =
  "Data is still being collected and checked. This visual will remain empty until data is properly quality assured.";
export const NUMBER_OF_TREES_PLANTED_BY_YEAR_TOOLTIP = "Number of trees planted in each year.";
export const TOP_5_PROJECTS_WITH_MOST_PLANTED_TREES_TOOLTIP =
  "The 5 projects that have planted the most trees and the corresponding number of trees planted per project. Please note that organization names are listed instead of project names for ease of reference.";
export const TOTAL_VOLUNTEERS_TOOLTIP =
  "Number of unpaid volunteers contributing to the project. A volunteer is an individual that freely dedicates their time to the project because they see value in doing so but does not receive payment for their work.";
export const VOLUNTEERS_CREATED_BY_AGE_TOOLTIP =
  "Total number of volunteers broken down by age group. Youth is defined as 18-35 years old. Non-youth is defined as older than 35 years old. 'Unknown' refers to number of people whose age has not been specified.";
export const VOLUNTEERS_CREATED_BY_GENDER_TOOLTIP =
  "Total number of volunteers broken down by gender. 'Unknown' refers to number of people whose gender has not been specified.";

export const TERRAFUND_MONITORING_LINK = "https://www.wri.org/update/land-degradation-project-recipe-for-restoration";

export const TERRAFUND_MRV_LINK = `<a href=${TERRAFUND_MONITORING_LINK} class="underline !text-black" target="_blank">TerraFund's MRV framework</a>`;

export const NUMBER_OF_TREES_PLANTED_TOOLTIP =
  "Total number of trees that funded projects have planted to date, as reported through 6-month progress reports and displayed as progress towards goal.";

const LABEL_LEGEND = [
  {
    tooltip: { key: "Total", render: <T _str="Total" _tags="dash" /> },
    color: "bg-blueCustom-900"
  },
  {
    tooltip: { key: "Non-Profit", render: <T _str="Non-Profit" _tags="dash" /> },
    color: "bg-secondary-600"
  },
  {
    tooltip: { key: "Enterprise", render: <T _str="Enterprise" _tags="dash" /> },
    color: "bg-primary"
  }
];

export interface DashboardTableDataProps {
  label: string;
  valueText: string;
  value: number;
  accessorKey?: string;
}

export interface GraphicLegendProps {
  label: string;
  value: string;
  color: string;
}

const mapActiveProjects = (projects: DashboardProjectsLightDto[], excludeUUID?: string) => {
  return projects ? projects.filter((item: { uuid: string }) => excludeUUID == null || item.uuid !== excludeUUID) : [];
};

const getOrganizationByUuid = (projects: any[], uuid: string) => {
  if (!projects) return "Unknown Organization";

  const project = projects.find((project: any) => project.uuid === uuid);
  if (!project) return "Unknown Organization";

  return project.organisationName || "Unknown Organization";
};

const Dashboard = () => {
  const t = useT();
  const [, { user }] = useMyUser();
  const [currentBbox, setCurrentBbox] = useState<BBox | undefined>(undefined);
  const { filters, setFilters, setLastUpdatedAt } = useDashboardContext();
  const countryChoices = useGadmChoices({ level: 0 });
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const {
    dashboardHeader,
    dashboardRestorationGoalData,
    jobsCreatedData,
    totalSectionHeader,
    hectaresUnderRestoration,
    numberTreesPlanted,
    isLoadingJobsCreated,
    isLoadingHectaresUnderRestoration,
    isLoadingTreeRestorationGoal,
    projectLoaded,
    singleDashboardProject,
    coverImage,
    topProject,
    centroidsDataProjects,
    activeCountries,
    activeProjects,
    allAvailableProjects,
    polygonsData,
    projectBbox,
    isUserAllowed,
    generalBbox,
    transformedStories,
    isLoadingImpactStories,
    lastUpdatedAt
  } = useDashboardData(filters);

  const cohortArray = useMemo(() => {
    const cohort = singleDashboardProject?.cohort;
    if (!cohort) return null;
    if (Array.isArray(cohort)) return cohort;
  }, [singleDashboardProject?.cohort]);

  const cohortDisplayName = useMemo(() => formatCohortDisplay(cohortArray), [cohortArray]);

  const dataToggle = useMemo(
    () => [
      { tooltip: { key: "Absolute", render: <T _str="Absolute" _tags="dash" /> } },
      { tooltip: { key: "Relative", render: <T _str="Relative" _tags="dash" /> } }
    ],
    []
  );

  const dataToggleGraphic = useMemo(
    () => [
      { tooltip: { key: "Table", render: <T _str="Table" _tags="dash" /> } },
      { tooltip: { key: "Graph", render: <T _str="Graph" _tags="dash" /> } }
    ],
    []
  );

  useEffect(() => {
    setLastUpdatedAt?.(lastUpdatedAt ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLastUpdatedAt, dashboardRestorationGoalData]);

  useValueChanged(generalBbox, () => {
    if (generalBbox) {
      setCurrentBbox(generalBbox);
    }
  });

  const COLUMN_ACTIVE_PROGRAMME = useMemo(
    () => [
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
      },
      ...(!isMobile
        ? []
        : [
            {
              header: "",
              accessorKey: "link",
              enableSorting: false,
              cell: ({ row }: { row: { original: { uuid: string } } }) => {
                const uuid = row.original.uuid;
                const handleClick = () => {
                  setFilters(prevValues => ({
                    ...prevValues,
                    uuid: uuid,
                    country: {
                      country_slug: uuid,
                      id: 1,
                      data: {
                        label: countryChoices?.find(choice => choice.id === uuid)?.name ?? uuid,
                        icon: `/flags/${uuid.toLowerCase()}.svg`
                      }
                    }
                  }));
                };

                return (
                  <button onClick={handleClick}>
                    <Icon
                      name={IconNames.IC_ARROW_COLLAPSE}
                      className="h-3 w-3 rotate-90 text-darkCustom hover:text-primary"
                    />
                  </button>
                );
              }
            }
          ])
    ],
    [isMobile, setFilters, countryChoices]
  );

  const COLUMN_ACTIVE_COUNTRY = useMemo(
    () => [
      {
        header: "Project",
        accessorKey: "name",
        enableSorting: false,
        cell: (props: any) => {
          const value = props.getValue().split("_");
          return <span className="two-line-text text-14-light">{value}</span>;
        }
      },
      {
        header: "Trees Planted",
        accessorKey: "treesPlantedCount",
        enableSorting: false,
        cell: (props: any) => {
          const value = props.getValue();
          return <span>{Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>;
        }
      },
      {
        header: "Hectares",
        accessorKey: "totalHectaresRestoredSum",
        enableSorting: false,
        cell: (props: any) => {
          const value = props.getValue();
          return <span>{Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>;
        }
      },
      {
        header: "Jobs Created",
        accessorKey: "totalJobsCreated",
        enableSorting: false,
        cell: (props: any) => {
          const value = props.getValue();
          return <span>{Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>;
        }
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
              <Icon
                name={IconNames.IC_ARROW_COLLAPSE}
                className="h-3 w-3 rotate-90 text-darkCustom hover:text-primary"
              />
            </button>
          );
        }
      }
    ],
    [setFilters]
  );

  const DATA_ACTIVE_PROGRAMME = useMemo(() => {
    if (!Array.isArray(activeCountries)) return [];
    const data = activeCountries.map(
      (item: {
        country: string;
        numberOfProjects: number;
        totalTreesPlanted: number;
        totalJobsCreated: number;
        hectaresRestored: number;
      }) => ({
        uuid: item.country,
        country: `${
          countryChoices?.find(choice => choice.id === item.country)?.name ?? item.country
        }_/flags/${item.country.toLowerCase()}.svg`,
        project: item.numberOfProjects.toLocaleString(),
        treesPlanted: item.totalTreesPlanted.toLocaleString(),
        restorationHectares: item.hectaresRestored.toLocaleString("en-US", { maximumFractionDigits: 0 }),
        jobsCreated: item.totalJobsCreated.toLocaleString()
      })
    );
    return data.sort((a, b) => a.country.localeCompare(b.country));
  }, [activeCountries, countryChoices]);

  const projectsInCountry = useMemo(() => mapActiveProjects(activeProjects), [activeProjects]);
  const otherProjectsInCountry = useMemo(
    () => mapActiveProjects(allAvailableProjects, filters.uuid),
    [allAvailableProjects, filters.uuid]
  );
  const organizationName = useMemo(
    () => getOrganizationByUuid(activeProjects, filters.uuid),
    [activeProjects, filters.uuid]
  );

  const jobsCreatedByGenderData = useMemo(() => parseJobCreatedByType(jobsCreatedData, "gender"), [jobsCreatedData]);
  const jobsCreatedByAgeData = useMemo(() => parseJobCreatedByType(jobsCreatedData, "age"), [jobsCreatedData]);

  const volunteersByGenderData = useMemo(() => parseVolunteersByType(jobsCreatedData, "gender"), [jobsCreatedData]);
  const volunteersByAgeData = useMemo(() => parseVolunteersByType(jobsCreatedData, "age"), [jobsCreatedData]);

  const projectCounts = useMemo(
    () => ({
      totalEnterpriseCount: totalSectionHeader?.totalEnterpriseCount ?? 0,
      totalNonProfitCount: totalSectionHeader?.totalNonProfitCount ?? 0
    }),
    [totalSectionHeader]
  );

  const tooltipText = useMemo(() => {
    if (filters.country.id === 0) {
      return t(ACTIVE_COUNTRIES_TOOLTIP);
    } else if (projectsInCountry.length > 0) {
      return t(ACTIVE_PROJECTS_TOOLTIP);
    } else if (transformedStories.length > 0) {
      return t(IMPACT_STORIES_TOOLTIP);
    }
    return t(NO_DATA_PRESENT_ACTIVE_PROJECT_TOOLTIPS);
  }, [t, filters.country.id, projectsInCountry, transformedStories]);

  const countryData = useMemo(() => {
    if (!singleDashboardProject?.country || !countryChoices?.length) return undefined;

    const gadmCountry = countryChoices.find(country => country.id === singleDashboardProject?.country);
    if (!gadmCountry) return undefined;

    const countrySlug = gadmCountry.id;
    return {
      country_slug: countrySlug,
      data: {
        label: gadmCountry.name,
        icon: `/flags/${String(countrySlug).toLowerCase()}.svg`
      },
      id: gadmCountry.id
    };
  }, [singleDashboardProject?.country, countryChoices]);

  const safeBbox = (bbox: number[] | undefined): BBox | undefined => {
    return bbox?.length === 4 ? (bbox as [number, number, number, number]) : undefined;
  };

  return (
    <div className="mt-4 mb-4 mr-2 flex flex-1 flex-wrap gap-4 overflow-y-auto overflow-x-hidden bg-neutral-70 pl-4 pr-2 small:flex-nowrap mobile:bg-white">
      <ContentDashboardtWrapper isLeftWrapper={true}>
        <When condition={(filters.country.id !== 0 || filters.landscapes.length > 0) && !filters.uuid}>
          <div className="flex items-center gap-2">
            <Text variant="text-14-light" className="uppercase text-black">
              {t("results for:")}
            </Text>

            <When condition={filters.country.id !== 0 && filters.landscapes.length === 0 && !filters.uuid}>
              <img src={filters.country?.data.icon} alt="flag" className="h-6 w-10 min-w-[40px] object-cover" />
              <Text variant="text-24-semibold" className="text-black">
                {t(
                  countryChoices.find(country => country.id === filters.country?.country_slug)?.name ||
                    filters.country?.data.label
                )}
              </Text>
            </When>

            <When condition={filters.landscapes.length === 1 && filters.country.id === 0 && !filters.uuid}>
              <Text variant="text-24-semibold" className="text-black">
                {filters.landscapes[0]}
              </Text>
            </When>

            <When
              condition={
                (filters.landscapes.length > 1 && filters.country.id === 0) ||
                (filters.landscapes.length > 0 && filters.country.id !== 0)
              }
            >
              <Text variant="text-24-semibold" className="text-black">
                {filters.country.id === 0 ? t("Multiple Landscapes") : t("Multiple Countries/Landscapes")}
              </Text>
            </When>
          </div>
        </When>
        <When condition={filters.uuid}>
          <div>
            <DashboardBreadcrumbs
              cohort={cohortArray}
              countryData={countryData as CountriesProps}
              projectName={singleDashboardProject?.name}
              className="pt-0"
              textVariant="text-14"
              clasNameText="!no-underline mt-0.5 hover:mb-0.5 hover:mt-0"
            />
          </div>
        </When>
        <BlurContainer
          isBlur={isUserAllowed !== undefined ? !isUserAllowed?.allowed : false}
          textType={user !== undefined ? TEXT_TYPES.LOGGED_USER : TEXT_TYPES.NOT_LOGGED_USER}
          logout={logout}
        >
          <div
            className={classNames(
              "grid w-full grid-cols-3 gap-4",
              "mobile:order-1 mobile:flex mobile:flex-wrap mobile:justify-around mobile:gap-2 mobile:border-b mobile:border-grey-1000 mobile:pb-4"
            )}
          >
            {dashboardHeader.map((item, index) => (
              <div key={index} className="rounded-lg bg-white px-4 py-3 mobile:p-0">
                <Text variant="text-12-light" className="text-darkCustom opacity-60">
                  {t(isMobile ? item.label.replace("Hectares", "") : item.label)}
                </Text>

                <div className="flex items-center gap-2">
                  <Text variant={isMobile ? "text-16" : "text-20"} className="text-darkCustom" as="span">
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
              <If condition={!projectLoaded}>
                <Then>
                  <div className="bg-gray-200 mr-5 flex h-[18vh] w-[14vw] items-center justify-center rounded-3xl">
                    <Text variant="text-20-bold">{t("Loading...")}</Text>
                  </div>
                </Then>
                <Else>
                  <img
                    src={coverImage?.thumbUrl ?? "/images/_AJL2963.jpg"}
                    alt="project cover"
                    className="mr-5 h-[18vh] w-[14vw] rounded-3xl object-cover"
                  />
                </Else>
              </If>
              <div>
                <Text variant="text-20-bold">{t(singleDashboardProject?.name)}</Text>
                <Text variant="text-14-light" className="text-darkCustom">
                  {t(`Operations: ${countryData?.data?.label}`)}
                  <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                  {t(`Registration: ${countryData?.data?.label}`)}
                  <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                  {t(`Organization: ${organizationName}`)}
                  <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                  {t(
                    `Type: ${
                      ORGANIZATIONS_TYPES[singleDashboardProject?.organisationType as keyof typeof ORGANIZATIONS_TYPES]
                    }`
                  )}
                  <span className="text-18-bold mx-2 text-grey-500">&bull;</span>
                  {t(`Cohort: ${cohortDisplayName}`)}
                </Text>
              </div>
            </div>
            <SecDashboard
              title={t("Objective")}
              classNameTitle="capitalize"
              type="legend"
              data={parseDataToObjetive(singleDashboardProject)}
              variantTitle="text-18-semibold"
            />
          </PageCard>
        </When>
        <PageCard
          className="border-0 px-4 py-6 mobile:order-3 mobile:px-0 mobile:pb-4 mobile:pt-0"
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
          collapseChildren={isMobile ? true : false}
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
            shouldShowOnlyOneLine={!!filters.uuid || filters.organizations.length === 1}
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
          className="border-0 px-4 py-6 mobile:order-4 mobile:px-0 mobile:py-4"
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
          collapseChildren={isMobile ? true : false}
        >
          <div
            className={classNames(
              "grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000",
              "gap-4 mobile:grid-flow-row mobile:divide-y mobile:divide-x-0"
            )}
          >
            <SecDashboard
              title={t("Part-Time Jobs Created")}
              data={{ value: jobsCreatedData?.totalPt }}
              classNameBody="w-full place-content-center"
              tooltip={t(NEW_PART_TIME_JOBS_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
            />
            <SecDashboard
              title={t("Full-Time Jobs Created")}
              data={{ value: jobsCreatedData?.totalFt }}
              className="pl-12 mobile:pl-0 mobile:pt-4"
              classNameBody="w-full place-content-center"
              tooltip={t(NEW_FULL_TIME_JOBS_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
            />
          </div>
          <div className="grid w-full grid-cols-2 mobile:grid-cols-1 mobile:gap-10">
            <SecDashboard
              title={t("Jobs Created by Gender")}
              data={{}}
              dataForChart={jobsCreatedByGenderData}
              chartType="groupedBarChart"
              classNameHeader="pl-[50px] mobile:pl-0"
              classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              tooltip={t(JOBS_CREATED_BY_GENDER_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
              isLoading={isLoadingJobsCreated}
            />
            <SecDashboard
              title={t("Jobs Created by Age")}
              data={{}}
              dataForChart={jobsCreatedByAgeData}
              chartType="groupedBarChart"
              classNameHeader="pl-[50px] mobile:pl-0"
              classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              tooltip={t(JOBS_CREATED_BY_AGE_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
              isLoading={isLoadingJobsCreated}
            />
          </div>

          <SecDashboard
            title={t("Total Volunteers")}
            data={{ value: jobsCreatedData?.totalVolunteers }}
            tooltip={t(TOTAL_VOLUNTEERS_TOOLTIP)}
            isUserAllowed={isUserAllowed?.allowed}
          />
          <div className="grid w-full grid-cols-2 gap-12">
            <SecDashboard
              title={t("Volunteers Engaged by Gender")}
              data={{}}
              chartType={CHART_TYPES.doughnutChart}
              dataForChart={volunteersByGenderData}
              classNameHeader="!justify-center"
              classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              tooltip={t(VOLUNTEERS_CREATED_BY_GENDER_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
              isLoading={false}
            />
            <SecDashboard
              title={t("Volunteers Created by Age")}
              data={{}}
              chartType={CHART_TYPES.doughnutChart}
              dataForChart={volunteersByAgeData}
              classNameHeader="!justify-center"
              classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              tooltip={t(VOLUNTEERS_CREATED_BY_AGE_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
              isLoading={false}
            />
          </div>
        </PageCard>
      </ContentDashboardtWrapper>
      <ContentOverview
        dataTable={
          filters.country.id === 0 ? DATA_ACTIVE_PROGRAMME : filters.uuid ? otherProjectsInCountry : projectsInCountry
        }
        centroids={centroidsDataProjects}
        columns={filters.country.id === 0 ? COLUMN_ACTIVE_PROGRAMME : COLUMN_ACTIVE_COUNTRY}
        titleTable={t(
          filters.country.id === 0
            ? "ACTIVE COUNTRIES"
            : filters.uuid
            ? `OTHER PROJECTS IN ${filters?.country?.data?.label.toUpperCase()}`
            : "ACTIVE PROJECTS"
        )}
        dataHectaresUnderRestoration={parseHectaresUnderRestorationData(
          singleDashboardProject
            ? singleDashboardProject.totalHectaresRestoredSum
            : totalSectionHeader?.totalHectaresRestored ?? 0,
          singleDashboardProject ? singleDashboardProject.totalSites : totalSectionHeader?.totalSites ?? 0,
          hectaresUnderRestoration
        )}
        textTooltipTable={tooltipText}
        isUserAllowed={isUserAllowed?.allowed}
        isLoadingHectaresUnderRestoration={isLoadingHectaresUnderRestoration}
        polygonsData={polygonsData}
        bbox={filters.uuid ? safeBbox(projectBbox) : safeBbox(currentBbox)}
        projectCounts={projectCounts}
        transformedStories={transformedStories}
        isLoading={isLoadingImpactStories}
        hasAccess={singleDashboardProject?.hasAccess}
      />
    </div>
  );
};

export default Dashboard;
