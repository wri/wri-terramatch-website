import { useT } from "@transifex/react";
import React from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Icon from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { CountriesProps } from "@/components/generic/Layout/DashboardLayout";

import ContentOverview from "./components/ContentOverview";
import SecDashboard from "./components/SecDashboard";
import {
  ACTIVE_PROJECTS_TOOLTIP,
  HECTARES_UNDER_RESTORATION_TOOLTIP,
  JOBS_CREATED_BY_AGE_TOOLTIP,
  JOBS_CREATED_BY_GENDER_TOOLTIP,
  JOBS_CREATED_SECTION_TOOLTIP,
  JOBS_CREATED_TOOLTIP,
  NEW_FULL_TIME_JOBS_TOOLTIP,
  NEW_PART_TIME_JOBS_TOOLTIP,
  NUMBER_OF_TREES_PLANTED_BY_YEAR_TOOLTIP,
  NUMBER_OF_TREES_PLANTED_TOOLTIP,
  TOP_5_PROJECTS_WITH_MOST_PLANTED_TREES_TOOLTIP,
  TOTAL_VOLUNTEERS_TOOLTIP,
  TREES_PLANTED_TOOLTIP,
  TREES_RESTORED_SECTION_TOOLTIP,
  VOLUNTEERS_CREATED_BY_AGE_TOOLTIP,
  VOLUNTEERS_CREATED_BY_GENDER_TOOLTIP
} from "./constants/tooltips";
import {
  DATA_ACTIVE_COUNTRY,
  JOBS_CREATED_BY_AGE,
  JOBS_CREATED_BY_GENDER,
  LABEL_LEGEND,
  NEW_FULL_TIME_JOBS,
  NEW_PART_TIME_JOBS,
  NUMBER_OF_TREES_PLANTED,
  NUMBER_OF_TREES_PLANTED_BY_YEAR,
  TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES,
  TOTAL_VOLUNTEERS,
  VOLUNTEERS_CREATED_BY_AGE,
  VOLUNTEERS_CREATED_BY_GENDER
} from "./mockedData/dashboard";

interface ChildComponentProps {
  selectedCountry: CountriesProps;
}

const Country: React.FC<ChildComponentProps> = ({ selectedCountry }) => {
  const t = useT();
  const dataToggle = ["Absolute", "Relative"];
  const dataToggleGraphic = ["Table", "Graphic"];
  const dashboardHeader = [
    {
      label: "Trees Planted",
      value: "12.2M",
      tooltip: TREES_PLANTED_TOOLTIP
    },
    {
      label: "Hectares Under Restoration",
      value: "5,220 ha",
      tooltip: HECTARES_UNDER_RESTORATION_TOOLTIP
    },
    {
      label: "Jobs Created",
      value: "23,000",
      tooltip: JOBS_CREATED_TOOLTIP
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
    <div className="mb-4 mr-2 mt-4 flex flex-1 flex-wrap gap-4 overflow-auto bg-neutral-70 pl-4 pr-2 small:flex-nowrap">
      <div className="overflow-hiden mx-auto w-full max-w-[730px] small:w-1/2 small:max-w-max">
        <PageRow className="gap-4 p-0">
          <When condition={!!selectedCountry}>
            <div className="flex items-center gap-2">
              <Text variant="text-14-light" className="uppercase text-black ">
                {t("results for:")}
              </Text>
              <img src={selectedCountry?.data.icon} alt="flag" className="h-6 w-8 object-cover" />
              <Text variant="text-24-semibold" className="text-black">
                {t(selectedCountry?.data.label)}
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
            title={t("TREES RESTORED")}
            tooltip={t(TREES_RESTORED_SECTION_TOOLTIP)}
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
              tooltip={t(NUMBER_OF_TREES_PLANTED_TOOLTIP)}
            />
            <SecDashboard
              title={t("Number of Trees Planted by Year")}
              type="toggle"
              secondOptionsData={dataToggle}
              tooltipGraphic={true}
              data={NUMBER_OF_TREES_PLANTED_BY_YEAR}
              tooltip={t(NUMBER_OF_TREES_PLANTED_BY_YEAR_TOOLTIP)}
            />
            <SecDashboard
              title={t("Top 5 Projects With The Most Planted Trees")}
              type="toggle"
              secondOptionsData={dataToggleGraphic}
              data={TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES}
              tooltip={t(TOP_5_PROJECTS_WITH_MOST_PLANTED_TREES_TOOLTIP)}
            />
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
              `The numbers and reports below display data related to Indicator 3: Jobs Created described in <span class="underline">TerraFund’s MRV framework</span>. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 or over in exchange for monetary pay in line with living wage standards. All indicators in the Jobs Created category are disaggregated by number of women, number of men, and number of youths. Restoration Champions are required to report on jobs and volunteers every 6 months and provide additional documentation to verify employment. Please refer to the linked MRV framework for additional details on how these numbers are sourced and verified.`
            )}
          >
            <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
              <SecDashboard
                title={t("New Part-Time Jobs")}
                data={NEW_PART_TIME_JOBS}
                classNameBody="w-full place-content-center"
                tooltip={t(NEW_PART_TIME_JOBS_TOOLTIP)}
              />
              <SecDashboard
                title={t("New Full-Time Jobs")}
                data={NEW_FULL_TIME_JOBS}
                className="pl-12"
                classNameBody="w-full place-content-center"
                tooltip={t(NEW_FULL_TIME_JOBS_TOOLTIP)}
              />
            </div>
            <div className="grid w-full grid-cols-2 gap-12">
              <SecDashboard
                title={t("Jobs Created by Gender")}
                data={JOBS_CREATED_BY_GENDER}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(JOBS_CREATED_BY_GENDER_TOOLTIP)}
              />
              <SecDashboard
                title={t("Jobs Created by Age")}
                data={JOBS_CREATED_BY_AGE}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(JOBS_CREATED_BY_AGE_TOOLTIP)}
              />
            </div>
            <SecDashboard title={t("Total Volunteers")} data={TOTAL_VOLUNTEERS} tooltip={t(TOTAL_VOLUNTEERS_TOOLTIP)} />
            <div className="grid w-full grid-cols-2 gap-12">
              <SecDashboard
                title={t("Volunteers Created by Gender")}
                data={VOLUNTEERS_CREATED_BY_GENDER}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(VOLUNTEERS_CREATED_BY_GENDER_TOOLTIP)}
              />
              <SecDashboard
                title={t("Volunteers Created by Age")}
                data={VOLUNTEERS_CREATED_BY_AGE}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
                tooltip={t(VOLUNTEERS_CREATED_BY_AGE_TOOLTIP)}
              />
            </div>
          </PageCard>
        </PageRow>
      </div>
      <ContentOverview
        dataTable={DATA_ACTIVE_COUNTRY}
        columns={COLUMN_ACTIVE_COUNTRY}
        titleTable={t("ACTIVE PROJECTS")}
        textTooltipTable={t(ACTIVE_PROJECTS_TOOLTIP)}
      />
    </div>
  );
};

export default Country;
