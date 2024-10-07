import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import React from "react";

import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Icon from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { useGetV2DashboardCountries } from "@/generated/apiComponents";

import ContentOverview from "../components/ContentOverview";
import SecDashboard from "../components/SecDashboard";
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
} from "../mockedData/dashboard";

const Country = () => {
  const t = useT();
  const router = useRouter();
  const dataToggle = ["Absolute", "Relative"];
  const dataToggleGraphic = ["Table", "Graphic"];
  const dashboardHeader = [
    {
      label: "Trees Planted",
      value: "12.2M"
    },
    {
      label: "Hectares Under Restoration",
      value: "5,220 ha"
    },
    {
      label: "Jobs Created",
      value: "23,000"
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

  const { data: dashboardCountries } = useGetV2DashboardCountries<any>({
    queryParams: {}
  });
  const countrySelected = dashboardCountries?.data.find(
    (country: any) => country.country_slug === router.asPath.split("/")[3]
  );
  console.log(countrySelected);

  router;
  return (
    <div className="mt-4 mb-4 mr-2 flex flex-1 flex-wrap gap-4 overflow-auto bg-neutral-70 pl-4 pr-2 small:flex-nowrap">
      <div className="overflow-hiden mx-auto w-full max-w-[730px] small:w-1/2 small:max-w-max">
        <PageRow className="gap-4 p-0">
          <div className="flex items-center gap-2">
            <Text variant="text-14-light" className="uppercase text-black ">
              {t("results for:")}
            </Text>
            <img src={countrySelected?.data.icon} alt="flag" className="h-6 w-8 object-cover" />
            <Text variant="text-24-semibold" className="text-black">
              {t(countrySelected?.data.label)}
            </Text>
          </div>
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
                    title={item.label}
                    content={t(
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
                    )}
                    placement="top"
                    width="w-56 lg:w-64"
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
            />
            <SecDashboard
              title={t("Number of Trees Planted by Year")}
              type="toggle"
              secondOptionsData={dataToggle}
              tooltipGraphic={true}
              data={NUMBER_OF_TREES_PLANTED_BY_YEAR}
            />
            <SecDashboard
              title={t("Top 5 Projects With The Most Planted Trees")}
              type="toggle"
              secondOptionsData={dataToggleGraphic}
              data={TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES}
            />
          </PageCard>

          <PageCard
            className="border-0 px-4 py-6"
            classNameSubTitle="mt-4"
            gap={8}
            title={t("JOBS CREATED")}
            variantSubTitle="text-14-light"
            subtitleMore={true}
            subtitle={t(
              `The numbers and reports below display data related to Indicator 3: Jobs Created described in <span class="underline">TerraFund’s MRV framework</span>. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 or over in exchange for monetary pay in line with living wage standards. All indicators in the Jobs Created category are disaggregated by number of women, number of men, and number of youths. Restoration Champions are required to report on jobs and volunteers every 6 months and provide additional documentation to verify employment. Please refer to the linked MRV framework for additional details on how these numbers are sourced and verified.`
            )}
          >
            <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
              <SecDashboard
                title={t("New Part-Time Jobs")}
                data={NEW_PART_TIME_JOBS}
                classNameBody="w-full place-content-center !justify-center"
              />
              <SecDashboard
                title={t("New Full-Time Jobs")}
                data={NEW_FULL_TIME_JOBS}
                className="pl-12"
                classNameBody="w-full place-content-center !justify-center"
              />
            </div>
            <div className="grid w-full grid-cols-2 gap-12">
              <SecDashboard
                title={t("Jobs Created by Gender")}
                data={JOBS_CREATED_BY_GENDER}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              />
              <SecDashboard
                title={t("JOBS CREATED BY AGE")}
                data={JOBS_CREATED_BY_AGE}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              />
            </div>
            <SecDashboard title={t("Total VOLUNTEERS")} data={TOTAL_VOLUNTEERS} />
            <div className="grid w-full grid-cols-2 gap-12">
              <SecDashboard
                title={t("VOLUNTEERS CREATED BY GENDER")}
                data={VOLUNTEERS_CREATED_BY_GENDER}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              />
              <SecDashboard
                title={t("VOLUNTEERS CREATED BY AGE")}
                data={VOLUNTEERS_CREATED_BY_AGE}
                classNameHeader="!justify-center"
                classNameBody="w-full place-content-center !justify-center flex-col gap-5"
              />
            </div>
          </PageCard>
        </PageRow>
      </div>
      <ContentOverview data={DATA_ACTIVE_COUNTRY} columns={COLUMN_ACTIVE_COUNTRY} />
    </div>
  );
};

export default Country;
