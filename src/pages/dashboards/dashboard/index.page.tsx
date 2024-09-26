import { useT } from "@transifex/react";

import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

import SecDashboard from "../components/secDashboard";
import {
  JOBS_CREATED_BY_AGE,
  JOBS_CREATED_BY_GENDER,
  LABEL_LEGEND,
  NEW_FULL_TIME_JOBS,
  NEW_PART_TIME_JOBS,
  NUMBER_OF_TREES_PLANTED,
  NUMBER_OF_TREES_PLANTED_BY_YEAR,
  RESTORATION_STRATEGIES_REPRESENTED,
  TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES,
  TOTAL_HECTARES_UNDER_RESTORATION,
  TOTAL_NUMBER_OF_SITES,
  TOTAL_VOLUNTEERS,
  VOLUNTEERS_CREATED_BY_AGE,
  VOLUNTEERS_CREATED_BY_GENDER
} from "../mockedData/dashboard";

export interface DashboardTableDataProps {
  label: string;
  valueText: string;
  value: number;
}

export interface DashboardDataProps {
  value?: string;
  unit?: string;
  secondValue?: string;
  graphic?: string;
  tableData?: DashboardTableDataProps[];
  maxValue?: number;
}

const Dashboard = () => {
  const t = useT();
  const dataToggle = ["Absolute", "Relative"];
  const dataToggleGraphic = ["Table", "Graphic"];

  return (
    <div className="flex gap-4 bg-neutral-70 p-4">
      <PageRow className="w-3/5 gap-4 p-0">
        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={8}
          title={t("TREES RESTORED")}
          variantSubTitle="text-14-light"
          subtitle={t(`The numbers and reports below display data related to Indicator 1: Trees Restored described in TerraFund’s
            MRV framework. Please refer to the linked MRV framework for details on how these numbers are sourced and
            verified.`)}
        >
          <SecDashboard
            title="Number of trees planted"
            type="legend"
            secondOptionsData={LABEL_LEGEND}
            data={NUMBER_OF_TREES_PLANTED}
          />
          <SecDashboard
            title="Number of Trees Planted by Year"
            type="toggle"
            secondOptionsData={dataToggle}
            data={NUMBER_OF_TREES_PLANTED_BY_YEAR}
          />
          <SecDashboard
            title="Top 10 Projects With The Most Planted Trees"
            type="toggle"
            secondOptionsData={dataToggleGraphic}
            data={TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES}
          />
        </PageCard>
        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={8}
          title={t("HECTARES UNDER RESTORATION")}
          variantSubTitle="text-14-light"
          subtitle={t(`The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in
            TerraFund’s MRV framework. Please refer to the linked MRV framework for details on how these numbers are
            sourced and verified.`)}
        >
          <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
            <SecDashboard
              title="Total HECTARES UNDER RESTORATION"
              data={TOTAL_HECTARES_UNDER_RESTORATION}
              classNameBody="w-full place-content-center !justify-center"
            />
            <SecDashboard
              title="TOTAL NUMBER OF SITES"
              data={TOTAL_NUMBER_OF_SITES}
              className="pl-12"
              classNameBody="w-full place-content-center !justify-center"
            />
          </div>
          <SecDashboard title="Restoration Strategies Represented" data={RESTORATION_STRATEGIES_REPRESENTED} />
          <SecDashboard title="TARGET LAND USE TYPES REPRESENTED" data={TOP_10_PROJECTS_WITH_THE_MOST_PLANTED_TREES} />
        </PageCard>
        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={8}
          title={t("JOBS CREATED")}
          variantSubTitle="text-14-light"
          subtitle={t(`The numbers and reports below display data related to Indicator 3: Jobs Created described in TerraFund’s
            MRV framework. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 or
            over in exchange for monetary pay in line with living wage standards. All indicators in the Jobs Created
            category are disaggregated by number of women, number of men, and number of youths. Restoration Champions
            are required to report on jobs and volunteers every 6 months and provide additional documentation to
            verify employment. Please refer to the linked MRV framework for additional details on how these numbers
            are sourced and verified.`)}
        >
          <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
            <SecDashboard
              title="New Part-Time Jobs"
              data={NEW_PART_TIME_JOBS}
              classNameBody="w-full place-content-center !justify-center"
            />
            <SecDashboard
              title="New Full-Time Jobs"
              data={NEW_FULL_TIME_JOBS}
              className="pl-12"
              classNameBody="w-full place-content-center !justify-center"
            />
          </div>
          <div className="grid w-11/12 grid-cols-2 gap-12">
            <SecDashboard
              title="Jobs Created by Gender"
              data={JOBS_CREATED_BY_GENDER}
              classNameHeader="!justify-center"
              classNameBody="w-full place-content-center !justify-center"
            />
            <SecDashboard
              title="JOBS CREATED BY AGE"
              data={JOBS_CREATED_BY_AGE}
              classNameHeader="!justify-center"
              classNameBody="w-full place-content-center !justify-center"
            />
          </div>
          <SecDashboard title="Total VOLUNTEERS" data={TOTAL_VOLUNTEERS} />
          <div className="grid w-11/12 grid-cols-2 gap-12">
            <SecDashboard
              title="VOLUNTEERS CREATED BY GENDER"
              data={VOLUNTEERS_CREATED_BY_GENDER}
              classNameHeader="!justify-center"
              classNameBody="w-full place-content-center !justify-center"
            />
            <SecDashboard
              title="VOLUNTEERS CREATED BY AGE"
              data={VOLUNTEERS_CREATED_BY_AGE}
              classNameHeader="!justify-center"
              classNameBody="w-full place-content-center !justify-center"
            />
          </div>
        </PageCard>
      </PageRow>

      <div className="w-2/5">Map</div>
    </div>
  );
};

export default Dashboard;
