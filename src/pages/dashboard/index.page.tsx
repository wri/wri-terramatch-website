import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import {
  useGetV2DashboardCountries,
  useGetV2DashboardJobsCreated,
  useGetV2DashboardTotalSectionHeader
} from "@/generated/apiComponents";

import ContentOverview from "./components/ContentOverview";
import SecDashboard from "./components/SecDashboard";
import {
  JOBS_CREATED_BY_AGE,
  JOBS_CREATED_BY_GENDER,
  LABEL_LEGEND,
  NUMBER_OF_TREES_PLANTED_BY_YEAR,
  TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES,
  TOP_20_TREE_SPECIES_PLANTED,
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
  const [updateFilters, setUpdateFilters] = useState<any>({});
  const [dashboardHeader, setDashboardHeader] = useState([
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
  ]);
  const [totalFtJobs, setTotalFtJobs] = useState({ value: "0" });
  const [totalPtJobs, setTotalPtJobs] = useState({ value: "0" });

  const [numberTreesPlanted, setNumberTreesPlanted] = useState({
    value: "0",
    totalValue: "0"
  });
  const dataToggle = ["Absolute", "Relative"];
  const dataToggleGraphic = ["Table", "Graphic"];

  useEffect(() => {
    const parsedFilters = {
      programmes: filters.programmes,
      country: filters.country.country_slug,
      "organisations.type": filters.organizations,
      landscapes: filters.landscapes
    };
    setUpdateFilters(parsedFilters);
  }, [filters]);

  const createQueryParams = (filters: any) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(`filter[${key}][]`, v));
      } else if (value !== undefined && value !== null && value !== "") {
        queryParams.append(`filter[${key}]`, value as string);
      }
    });
    return queryParams.toString();
  };

  const queryParams: any = useMemo(() => createQueryParams(updateFilters), [updateFilters]);

  const { showLoader, hideLoader } = useLoading();
  const {
    data: totalSectionHeader,
    refetch,
    isLoading
  } = useGetV2DashboardTotalSectionHeader<any>(
    {
      queryParams: queryParams
    },
    {
      enabled: !!filters
    }
  );
  const { data: jobsCreatedData } = useGetV2DashboardJobsCreated<any>(
    {
      queryParams: queryParams
    },
    {
      enabled: !!filters
    }
  );
  const { data: dashboardCountries } = useGetV2DashboardCountries<any>({
    queryParams: {}
  });

  useEffect(() => {
    if (jobsCreatedData?.data?.total_ft) {
      setTotalFtJobs({ value: formatNumberUS(jobsCreatedData?.data?.total_ft) });
    }
    if (jobsCreatedData?.data?.total_pt) {
      setTotalPtJobs({ value: formatNumberUS(jobsCreatedData?.data?.total_pt) });
    }
  }, [jobsCreatedData]);

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);
  useEffect(() => {
    refetch();
  }, [filters]);

  const formatNumberUS = (value: number) => {
    if (!value) return "";
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + "M";
    }
    return value.toLocaleString("en-US");
  };
  useEffect(() => {
    if (totalSectionHeader) {
      setDashboardHeader(prev => [
        {
          label: "Trees Planted",
          value: totalSectionHeader.total_trees_restored.toLocaleString(),
          tooltip: prev[0].tooltip
        },
        {
          label: "Hectares Under Restoration",
          value: `${totalSectionHeader.total_hectares_restored.toLocaleString()} ha`,
          tooltip: prev[1].tooltip
        },
        {
          label: "Jobs Created",
          value: totalSectionHeader.total_entries.toLocaleString(),
          tooltip: prev[2].tooltip
        }
      ]);
      setNumberTreesPlanted({
        value: formatNumberUS(totalSectionHeader.total_trees_restored),
        totalValue: formatNumberUS(totalSectionHeader.total_trees_restored_goal)
      });
    }
  }, [totalSectionHeader]);

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
      accessorKey: "restoratioHectares",
      enableSorting: false
    },
    {
      header: "Jobs Created",
      accessorKey: "jobsCreated",
      enableSorting: false
    }
  ];

  const DATA_ACTIVE_PROGRAMME = dashboardCountries?.data
    ? dashboardCountries.data.map((country: { data: { label: string; icon: string } }) => ({
        country: `${country.data.label}_${country.data.icon}`,
        project: "32",
        treesPlanted: "2,234",
        restoratioHectares: "2,234",
        jobsCreated: "1306"
      }))
    : [];
  return (
    <div className="mt-4 mb-4 mr-2 flex flex-1 flex-wrap gap-4 overflow-auto bg-neutral-70 pl-4 pr-2 small:flex-nowrap">
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
              title={t("Top 5 Projects with the Most Planted Trees")}
              type="toggle"
              secondOptionsData={dataToggleGraphic}
              data={TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES}
              tooltip={t(
                "The 5 projects that have planted the most trees and the number of trees planted per project. Please note that organization names are listed instead of project names for ease of reference."
              )}
            />
            <When condition={filters.country.id !== 0}>
              <SecDashboard
                title={t("Top 20 Tree Species Planted")}
                type="toggle"
                secondOptionsData={dataToggleGraphic}
                data={TOP_20_TREE_SPECIES_PLANTED}
                tooltip={t(
                  "The 20 most frequently planted tree species across all projects and the corresponding number planted of each."
                )}
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
                data={totalPtJobs}
                classNameBody="w-full place-content-center"
                tooltip={t(
                  "Number of part-time jobs created to date. TerraFund defines a part-time job as under 35 hours per work week."
                )}
              />
              <SecDashboard
                title={t("New Full-Time Jobs")}
                data={totalFtJobs}
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
        dataTable={DATA_ACTIVE_PROGRAMME}
        columns={COLUMN_ACTIVE_PROGRAMME}
        titleTable={t("ACTIVE COUNTRIES")}
        textTooltipTable={t(
          "For each country, this table shows the number of projects, trees planted, hectares under restoration, and jobs created to date."
        )}
      />
    </div>
  );
};

export default Dashboard;
