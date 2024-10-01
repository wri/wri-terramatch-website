import { useT } from "@transifex/react";
import { useContext } from "react";

import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

import ContentOverview from "./components/ContentOverview";
import SecDashboard from "./components/SecDashboard";
import { RefContext } from "./context/ScrollContext.provider";
import {
  JOBS_CREATED_BY_AGE,
  JOBS_CREATED_BY_GENDER,
  LABEL_LEGEND,
  NEW_FULL_TIME_JOBS,
  NEW_PART_TIME_JOBS,
  NUMBER_OF_TREES_PLANTED,
  NUMBER_OF_TREES_PLANTED_BY_YEAR,
  RESTORATION_STRATEGIES_REPRESENTED,
  TARGET_LAND_USE_TYPES_REPRESENTED,
  TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES,
  TOTAL_HECTARES_UNDER_RESTORATION,
  TOTAL_NUMBER_OF_SITES,
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

export interface DashboardDataProps {
  value?: string;
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
}

const Dashboard = () => {
  const t = useT();
  const dataToggle = ["Absolute", "Relative"];
  const dataToggleGraphic = ["Table", "Graphic"];
  const sharedRef = useContext(RefContext);
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

  return (
    <div className="flex flex-1 gap-4 overflow-hidden bg-neutral-70 p-4 ">
      <div ref={sharedRef} className="w-3/5 overflow-auto pr-2 ">
        <PageRow className="gap-4 p-0">
          <div className="grid w-full grid-cols-3 gap-4">
            {dashboardHeader.map((item, index) => (
              <div key={index} className="rounded-lg bg-white px-5 py-4.5">
                <Text variant="text-10-light" className="text-darkCustom opacity-60">
                  {t(item.label)}
                </Text>

                <div className="flex items-center gap-2">
                  <Text variant="text-20" className="text-darkCustom" as="span">
                    {t(item.value)}
                  </Text>
                  <ToolTip content={item.label} placement="top" width="w-44 lg:w-52">
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
              title={t("Top 10 Projects With The Most Planted Trees")}
              type="toggle"
              secondOptionsData={dataToggleGraphic}
              data={TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES}
            />
          </PageCard>
          <PageCard
            className="border-0 px-4 py-6"
            classNameSubTitle="mt-4"
            gap={8}
            subtitleMore={true}
            title={t("HECTARES UNDER RESTORATION")}
            variantSubTitle="text-14-light"
            subtitle={t(
              `The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in <span class="underline">TerraFund’s MRV framework</span>. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
            )}
          >
            <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
              <SecDashboard
                title={t("Total HECTARES UNDER RESTORATION")}
                data={TOTAL_HECTARES_UNDER_RESTORATION}
                classNameBody="w-full place-content-center !justify-center"
              />
              <SecDashboard
                title={t("TOTAL NUMBER OF SITES")}
                data={TOTAL_NUMBER_OF_SITES}
                className="pl-12"
                classNameBody="w-full place-content-center !justify-center"
              />
            </div>
            <SecDashboard title={t("Restoration Strategies Represented")} data={RESTORATION_STRATEGIES_REPRESENTED} />
            <SecDashboard title={t("TARGET LAND USE TYPES REPRESENTED")} data={TARGET_LAND_USE_TYPES_REPRESENTED} />
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
            <div className="grid w-11/12 grid-cols-2 gap-12">
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
            <div className="grid w-11/12 grid-cols-2 gap-12">
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

      <ContentOverview />
    </div>
  );
};

export default Dashboard;
