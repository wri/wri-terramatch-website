import { useMediaQuery } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

import CountryFlag from "@/components/dashboard/CountryFlag";
import type { ImpactStoryModalRow } from "@/components/dashboard/impactStoriesModalColumns";
import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { formatTableNumber, numericSortingFn } from "@/components/elements/Table/tableUtils";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import BlurContainer from "@/components/extensive/BlurContainer/BlurContainer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import { useGadmChoices } from "@/connections/Gadm";
import { useMyUser } from "@/connections/User";
import { CHART_TYPES, ORGANIZATIONS_TYPES, TERRAFUND_MRV_LINK, TEXT_TYPES } from "@/constants/dashboardConsts";
import { CountriesProps, useDashboardContext } from "@/context/dashboard.provider";
import { DashboardProjectsLightDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { logout } from "@/generated/v3/utils";
import { useValueChanged } from "@/hooks/useValueChanged";
import {
  formatCohortDisplay,
  parseBeneficiariesByType,
  parseHectaresUnderRestorationData,
  parseJobCreatedByType,
  parseVolunteersByType,
  useParseDataToObjetive
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
  "The number of people working 35 or more hours per week on projects funded by TerraFund. Full-time employees are people regularly paid for their work on the project and working 35 or more hours per week throughout the year, with a consistent role that involves daily or almost daily engagement for at least three months of the reporting period.";
export const NEW_PART_TIME_JOBS_TOOLTIP =
  "The number of part-time employees working on projects funded by TerraFund. The definition of part-time employees includes two categories: part-time employees and short-term, seasonal, and casual employees. Part-time employees are people regularly paid for their work on the project and working less than 35 hours per week with a consistent role that involves frequent engagement for at least three months of the six-month reporting period. Short-term, seasonal, and casual workers are people working periodically on the project, typically involved in tasks that take a few days, or during high-engagement seasons such as planting seasons. These include jobs that involve recurring engagement at the same time in different months but for a short duration ranging from a few days to a few weeks.";
export const NO_DATA_PRESENT_ACTIVE_PROJECT_TOOLTIPS =
  "Data is still being collected and checked. This visual will remain empty until data is properly quality assured.";
export const NUMBER_OF_TREES_PLANTED_BY_YEAR_TOOLTIP = "Number of trees planted in each year.";
export const TOP_5_PROJECTS_WITH_MOST_PLANTED_TREES_TOOLTIP =
  "The 5 projects that have planted the most trees and the corresponding number of trees planted per project. Please note that organization names are listed instead of project names for ease of reference.";
export const TOTAL_VOLUNTEERS_TOOLTIP =
  "A volunteer is an individual who freely dedicates their time to the project because they see value in doing so but who does not receive payment for their work.";
export const VOLUNTEERS_CREATED_BY_AGE_TOOLTIP =
  "Total number of volunteers broken down by age group. Youth is defined as 18-35 years old. Non-youth is defined as older than 35 years old. 'Unknown' refers to number of people whose age has not been specified.";
export const VOLUNTEERS_CREATED_BY_GENDER_TOOLTIP =
  "Total number of volunteers broken down by gender. 'Unknown' refers to number of people whose gender has not been specified.";
export const TOTAL_DIRECT_BENEFICIARIES_TOOLTIP =
  "Number of local community members who have directly received benefits from TerraFund projects. TerraFund defines a direct benefit as an immediate and tangible value a project provides to target groups and local communities.";
export const DIRECT_BENEFICIARIES_BY_AGE_TOOLTIP =
  "Total number of individuals in communities receiving direct benefits broken down by age group. Youth is defined as 18-35 years old. Non-youth is defined as older than 35 years old.";
export const DIRECT_BENEFICIARIES_BY_GENDER_TOOLTIP =
  "Total number of individuals in communities receiving direct benefits broken down by gender.";

export const NUMBER_OF_TREES_PLANTED_TOOLTIP =
  "The total self-reported number of trees planted by TerraFund organizations, over the duration of the entire project and displayed as progress towards goal.";

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
  const { filters, setFilters } = useDashboardContext();
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
    isLoadingImpactStories
  } = useDashboardData(filters);

  const objectiveData = useParseDataToObjetive(singleDashboardProject);

  const cohortArray = useMemo(() => {
    const cohort = singleDashboardProject?.cohort;
    if (!cohort) return null;
    if (Array.isArray(cohort)) return cohort;
  }, [singleDashboardProject?.cohort]);

  const cohortDisplayName = useMemo(() => formatCohortDisplay(cohortArray), [cohortArray]);

  const dataToggle = useMemo(
    () => [
      { tooltip: { key: "Absolute", render: t("Absolute") } },
      { tooltip: { key: "Relative", render: t("Relative") } }
    ],
    [t]
  );

  const dataToggleGraphic = useMemo(
    () => [{ tooltip: { key: "Table", render: t("Table") } }, { tooltip: { key: "Graph", render: t("Graph") } }],
    [t]
  );

  const labelLegend = useMemo(
    () => [
      {
        tooltip: { key: "Total", render: t("Total") },
        color: "bg-blueCustom-900"
      },
      {
        tooltip: { key: "Non-Profit", render: t("Non-Profit") },
        color: "bg-secondary-600"
      },
      {
        tooltip: { key: "Enterprise", render: t("Enterprise") },
        color: "bg-primary"
      }
    ],
    [t]
  );

  useValueChanged(generalBbox, () => {
    if (generalBbox) {
      setCurrentBbox(generalBbox);
    }
  });

  const COLUMN_ACTIVE_PROGRAMME = useMemo(
    () => [
      {
        header: t("Country"),
        cell: (props: any) => {
          const value = props.getValue().split("_");
          return (
            <div className="flex items-center gap-2">
              <CountryFlag src={value[1]} size="xs" />
              <Text variant="text-14">{value[0]}</Text>
            </div>
          );
        },
        accessorKey: "country",
        enableSorting: false
      },
      {
        header: t("Projects"),
        accessorKey: "project",
        enableSorting: false,
        sortingFn: numericSortingFn,
        cell: (props: { getValue: () => number }) => <span>{formatTableNumber(props.getValue())}</span>
      },
      {
        header: t("Trees Planted"),
        accessorKey: "treesPlanted",
        enableSorting: false,
        sortingFn: numericSortingFn,
        cell: (props: { getValue: () => number }) => <span>{formatTableNumber(props.getValue())}</span>
      },
      {
        header: t("Hectares"),
        accessorKey: "restorationHectares",
        enableSorting: false,
        sortingFn: numericSortingFn,
        cell: (props: { getValue: () => number }) => <span>{formatTableNumber(props.getValue())}</span>
      },
      {
        header: t("Jobs Created"),
        accessorKey: "jobsCreated",
        enableSorting: false,
        sortingFn: numericSortingFn,
        cell: (props: { getValue: () => number }) => <span>{formatTableNumber(props.getValue())}</span>
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
    [isMobile, setFilters, countryChoices, t]
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
        sortingFn: numericSortingFn,
        cell: (props: { getValue: () => number }) => <span>{formatTableNumber(props.getValue())}</span>
      },
      {
        header: "Hectares",
        accessorKey: "totalHectaresRestoredSum",
        enableSorting: false,
        sortingFn: numericSortingFn,
        cell: (props: { getValue: () => number }) => <span>{formatTableNumber(props.getValue())}</span>
      },
      {
        header: "Jobs Created",
        accessorKey: "totalJobsCreated",
        enableSorting: false,
        sortingFn: numericSortingFn,
        cell: (props: { getValue: () => number }) => <span>{formatTableNumber(props.getValue())}</span>
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
        project: item.numberOfProjects,
        treesPlanted: item.totalTreesPlanted,
        restorationHectares: item.hectaresRestored,
        jobsCreated: item.totalJobsCreated
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

  const jobsCreatedByGenderData = useMemo(
    () => parseJobCreatedByType(jobsCreatedData, "gender", t),
    [jobsCreatedData, t]
  );
  const jobsCreatedByAgeData = useMemo(() => parseJobCreatedByType(jobsCreatedData, "age", t), [jobsCreatedData, t]);

  const volunteersByGenderData = useMemo(
    () => parseVolunteersByType(jobsCreatedData, "gender", t),
    [jobsCreatedData, t]
  );
  const volunteersByAgeData = useMemo(() => parseVolunteersByType(jobsCreatedData, "age", t), [jobsCreatedData, t]);
  const beneficiariesByGenderData = useMemo(
    () => parseBeneficiariesByType(jobsCreatedData, "gender", t),
    [jobsCreatedData, t]
  );
  const beneficiariesByAgeData = useMemo(
    () => parseBeneficiariesByType(jobsCreatedData, "age", t),
    [jobsCreatedData, t]
  );

  const projectCounts = useMemo(
    () => ({
      totalEnterpriseCount: totalSectionHeader?.totalEnterpriseCount ?? 0,
      totalNonProfitCount: totalSectionHeader?.totalNonProfitCount ?? 0
    }),
    [totalSectionHeader]
  );

  const hasCountrySelection = filters.country?.country_slug != null && filters.country.country_slug !== "";

  const tooltipText = useMemo(() => {
    if (!hasCountrySelection) {
      return t(ACTIVE_COUNTRIES_TOOLTIP);
    } else if (projectsInCountry.length > 0) {
      return t(ACTIVE_PROJECTS_TOOLTIP);
    } else if (transformedStories.length > 0) {
      return t(IMPACT_STORIES_TOOLTIP);
    }
    return t(NO_DATA_PRESENT_ACTIVE_PROJECT_TOOLTIPS);
  }, [t, hasCountrySelection, projectsInCountry, transformedStories]);

  const countryData = useMemo(() => {
    if (!singleDashboardProject?.country || !countryChoices?.length) return undefined;

    const gadmCountry = countryChoices.find(country => country.id === singleDashboardProject?.country);
    if (!gadmCountry) return undefined;

    const countrySlug = String(gadmCountry.id);
    return {
      country_slug: countrySlug,
      data: {
        label: gadmCountry.name,
        icon: `/flags/${String(countrySlug).toLowerCase()}.svg`
      },
      id: 1
    };
  }, [singleDashboardProject?.country, countryChoices]);

  useEffect(() => {
    if (filters.uuid == null || filters.uuid === "" || countryData == null) return;

    setFilters(prevValues => {
      const previousCountrySlug = prevValues.country?.country_slug ?? "";
      const hasSameCountry =
        previousCountrySlug === countryData.country_slug &&
        prevValues.country?.id === countryData.id &&
        prevValues.country?.data?.label === countryData.data.label;

      if (hasSameCountry) {
        return prevValues;
      }

      return {
        ...prevValues,
        country: countryData
      };
    });
  }, [countryData, filters.uuid, setFilters]);

  const safeBbox = (bbox: number[] | undefined): BBox | undefined => {
    return bbox?.length === 4 ? (bbox as [number, number, number, number]) : undefined;
  };

  return (
    <div className="mt-4 mb-4 mr-2 flex flex-1 flex-wrap gap-4 overflow-y-auto overflow-x-hidden bg-neutral-70 pl-4 pr-2 small:flex-nowrap mobile:bg-white">
      <ContentDashboardtWrapper isLeftWrapper={true}>
        {(hasCountrySelection || filters.landscapes.length > 0) && !filters.uuid && (
          <div className="flex items-center gap-2">
            <Text variant="text-14-light" className="uppercase text-black">
              {t("results for:")}
            </Text>

            {hasCountrySelection && filters.landscapes.length === 0 && !filters.uuid && (
              <>
                {filters.country?.data.icon ? <CountryFlag src={filters.country.data.icon} size="md" /> : null}
                <Text variant="text-24-semibold" className="text-black">
                  {t(
                    countryChoices.find(country => country.id === filters.country?.country_slug)?.name ||
                      filters.country?.data.label
                  )}
                </Text>
              </>
            )}

            {filters.landscapes.length === 1 && filters.country.id === 0 && !filters.uuid && (
              <Text variant="text-24-semibold" className="text-black">
                {filters.landscapes[0]}
              </Text>
            )}

            {((filters.landscapes.length > 1 && !hasCountrySelection) ||
              (filters.landscapes.length > 0 && hasCountrySelection)) && (
              <Text variant="text-24-semibold" className="text-black">
                {!hasCountrySelection ? t("Multiple Landscapes") : t("Multiple Countries/Landscapes")}
              </Text>
            )}
          </div>
        )}
        {filters.uuid && (
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
        )}
        <BlurContainer
          isBlur={isUserAllowed !== undefined ? !isUserAllowed?.allowed : false}
          textType={user !== undefined ? TEXT_TYPES.LOGGED_USER : TEXT_TYPES.NOT_LOGGED_USER}
          logout={logout}
          projectFrameworkKey={singleDashboardProject?.frameworkKey}
          backendHasAccess={isUserAllowed?.allowed}
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
        {filters.uuid && (
          <PageCard className="border-0 px-4 py-6" gap={8}>
            <div className="flex items-center">
              {!projectLoaded ? (
                <div className="bg-gray-200 mr-5 flex h-[18vh] w-[14vw] items-center justify-center rounded-3xl">
                  <Text variant="text-20-bold">{t("Loading...")}</Text>
                </div>
              ) : (
                <img
                  src={coverImage?.thumbUrl ?? "/images/_AJL2963.jpg"}
                  alt="project cover"
                  className="mr-5 h-[18vh] w-[14vw] rounded-3xl object-cover"
                />
              )}
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
              title={t("Summary")}
              classNameTitle="capitalize"
              type="legend"
              data={objectiveData}
              variantTitle="text-18-semibold"
            />
          </PageCard>
        )}
        <PageCard
          className="border-0 px-4 py-6 mobile:order-3 mobile:px-0 mobile:pb-4 mobile:pt-0"
          classNameSubTitle="mt-4"
          gap={8}
          subtitleMore={true}
          isUserAllowed={isUserAllowed?.allowed}
          projectFrameworkKey={singleDashboardProject?.frameworkKey}
          title={t("TREE RESTORATION")}
          widthTooltip="w-52 lg:w-64"
          iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
          variantSubTitle="text-14-light"
          subtitle={t(
            `This section displays data related to <em>Indicator 1: Tree Restoration</em> described in ${TERRAFUND_MRV_LINK}. Please refer to the linked framework for details on how these numbers are sourced and verified.`
          )}
          collapseChildren={isMobile ? true : false}
        >
          <SecDashboard
            title={t("Trees Planted")}
            type="legend"
            secondOptionsData={labelLegend}
            tooltip={t(NUMBER_OF_TREES_PLANTED_TOOLTIP)}
            data={numberTreesPlanted}
            dataForChart={dashboardRestorationGoalData}
            chartType={CHART_TYPES.treesPlantedBarChart}
            isUserAllowed={isUserAllowed?.allowed}
          />
          <SecDashboard
            title={t("Trees Planted by Year")}
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
          {!filters.uuid && (
            <SecDashboard
              title={t("Top 5 projects with the Most Planted Trees")}
              type="toggle"
              secondOptionsData={dataToggleGraphic}
              data={topProject}
              isTableProject={true}
              tooltip={t(TOP_5_PROJECTS_WITH_MOST_PLANTED_TREES_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
            />
          )}
        </PageCard>
        <PageCard
          className="border-0 px-4 py-6 mobile:order-4 mobile:px-0 mobile:py-4"
          classNameSubTitle="mt-4"
          gap={8}
          isUserAllowed={isUserAllowed?.allowed}
          projectFrameworkKey={singleDashboardProject?.frameworkKey}
          title={t("JOBS CREATED")}
          variantSubTitle="text-14-light"
          subtitleMore={true}
          tooltipTrigger="click"
          widthTooltip="w-80 lg:w-96"
          iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
          subtitle={t(
            `This section displays data related to <em>Indicator 3: Jobs Created</em> described in ${TERRAFUND_MRV_LINK}. Please refer to the linked framework for additional details on how these numbers are sourced and verified.`
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
              title={t("Part-Time Employees")}
              data={{ value: jobsCreatedData?.totalPt }}
              classNameBody="w-full place-content-center"
              tooltip={t(NEW_PART_TIME_JOBS_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
            />
            <SecDashboard
              title={t("Full-Time Employees")}
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
            title={t("Volunteers")}
            data={{ value: jobsCreatedData?.totalVolunteers }}
            tooltip={t(TOTAL_VOLUNTEERS_TOOLTIP)}
            isUserAllowed={isUserAllowed?.allowed}
          />
          <div className="grid w-full grid-cols-2 gap-12">
            <SecDashboard
              title={t("Volunteers by Gender")}
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
              title={t("Volunteers by Age")}
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
        <PageCard
          className="border-0 px-4 py-6 mobile:order-4 mobile:px-0 mobile:py-4"
          classNameSubTitle="mt-4"
          gap={8}
          isUserAllowed={isUserAllowed?.allowed}
          projectFrameworkKey={singleDashboardProject?.frameworkKey}
          title={t("LIVELIHOOD BENEFITS")}
          variantSubTitle="text-14-light"
          subtitleMore={true}
          tooltipTrigger="click"
          widthTooltip="w-80 lg:w-96"
          iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
          subtitle={t(
            `This section displays data related to <em>Indicator 4: Livelihood Benefits</em> described in ${TERRAFUND_MRV_LINK}. Please refer to the linked framework for additional details on how these numbers are sourced and verified.`
          )}
          collapseChildren={isMobile ? true : false}
        >
          <SecDashboard
            title={t("Individuals in Communities Receiving Direct Benefits")}
            data={{ value: jobsCreatedData?.totalBeneficiaries }}
            tooltip={t(TOTAL_DIRECT_BENEFICIARIES_TOOLTIP)}
            isUserAllowed={isUserAllowed?.allowed}
          />
          <div className="grid w-full grid-cols-2 gap-12 mobile:grid-cols-1 mobile:gap-10">
            <SecDashboard
              title={t("Individuals in Communities Receiving Direct Benefits by Gender")}
              data={{}}
              chartType={CHART_TYPES.doughnutChart}
              dataForChart={beneficiariesByGenderData}
              classNameHeader="!justify-center"
              classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              tooltip={t(DIRECT_BENEFICIARIES_BY_GENDER_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
              isLoading={isLoadingJobsCreated}
            />
            <SecDashboard
              title={t("Individuals in Communities Receiving Direct Benefits by Age")}
              data={{}}
              chartType={CHART_TYPES.doughnutChart}
              dataForChart={beneficiariesByAgeData}
              classNameHeader="!justify-center"
              classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              tooltip={t(DIRECT_BENEFICIARIES_BY_AGE_TOOLTIP)}
              isUserAllowed={isUserAllowed?.allowed}
              isLoading={isLoadingJobsCreated}
            />
          </div>
        </PageCard>
      </ContentDashboardtWrapper>
      <ContentOverview
        dataTable={
          !hasCountrySelection ? DATA_ACTIVE_PROGRAMME : filters.uuid ? otherProjectsInCountry : projectsInCountry
        }
        centroids={centroidsDataProjects}
        columns={
          (!hasCountrySelection ? COLUMN_ACTIVE_PROGRAMME : COLUMN_ACTIVE_COUNTRY) as ColumnDef<{
            country: string | null;
            uuid: string;
          }>[]
        }
        titleTable={
          !hasCountrySelection
            ? t("ACTIVE COUNTRIES")
            : filters.uuid
            ? t("OTHER PROJECTS IN {countryLabel}", { countryLabel: filters?.country?.data?.label.toUpperCase() })
            : t("ACTIVE PROJECTS")
        }
        dataHectaresUnderRestoration={parseHectaresUnderRestorationData(
          singleDashboardProject
            ? singleDashboardProject.totalHectaresRestoredSum
            : totalSectionHeader?.totalHectaresRestored ?? 0,
          singleDashboardProject ? singleDashboardProject.totalSites : totalSectionHeader?.totalSites ?? 0,
          hectaresUnderRestoration
        )}
        textTooltipTable={tooltipText}
        isUserAllowed={isUserAllowed?.allowed}
        projectFrameworkKey={singleDashboardProject?.frameworkKey}
        isLoadingHectaresUnderRestoration={isLoadingHectaresUnderRestoration}
        polygonsData={polygonsData}
        bbox={filters.uuid ? safeBbox(projectBbox) : safeBbox(currentBbox)}
        projectCounts={projectCounts}
        transformedStories={transformedStories as ImpactStoryModalRow[]}
        isLoading={isLoadingImpactStories}
        hasAccess={singleDashboardProject?.hasAccess}
      />
    </div>
  );
};

export default Dashboard;
