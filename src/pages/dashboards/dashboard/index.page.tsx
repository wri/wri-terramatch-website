import { useT } from "@transifex/react";

import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

import HeaderSecDashboard from "../components/headerSecDashboard";
import { LABEL_LEGEND } from "../mockedData/dashboard";

const Dashboard = () => {
  const t = useT();
  const dataToggle = ["Absolute", "Relative"];
  const dataToggleGraphic = ["Table", "Graphic"];

  return (
    <div className="flex gap-4 bg-neutral-70 p-4">
      <PageRow className="w-3/5 gap-4 p-0">
        <PageCard
          className="border-0 px-4 py-6"
          gap={6}
          title={t("TREES RESTORED")}
          variantSubTitle="text-14-light"
          subtitle={t(`The numbers and reports below display data related to Indicator 1: Trees Restored described in TerraFund’s
            MRV framework. Please refer to the linked MRV framework for details on how these numbers are sourced and
            verified.`)}
        >
          <HeaderSecDashboard title="Number of trees planted" type="legend" secondOptionsData={LABEL_LEGEND} />
          <HeaderSecDashboard title="Number of Trees Planted by Year" type="toggle" secondOptionsData={dataToggle} />
          <HeaderSecDashboard
            title="Top 10 Projects With The Most Planted Trees"
            type="toggle"
            secondOptionsData={dataToggleGraphic}
          />
          <HeaderSecDashboard title="Top 20 Tree Species Planted" type="toggle" secondOptionsData={dataToggleGraphic} />
        </PageCard>
        <PageCard
          className="border-0 px-4 py-6"
          gap={6}
          title={t("HECTARES UNDER RESTORATION")}
          variantSubTitle="text-14-light"
          subtitle={t(`The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in
            TerraFund’s MRV framework. Please refer to the linked MRV framework for details on how these numbers are
            sourced and verified.`)}
        >
          <div className="grid grid-cols-2">
            <HeaderSecDashboard title="Total HECTARES UNDER RESTORATION" />
            <HeaderSecDashboard title="TOTAL NUMBER OF SITES" />
          </div>
          <HeaderSecDashboard title="Restoration Strategies Represented" />
          <HeaderSecDashboard title="TARGET LAND USE TYPES REPRESENTED" />
          <HeaderSecDashboard title="Target Land Use Types by Restoration Strategy" />
        </PageCard>
        <PageCard
          className="border-0 px-4 py-6"
          gap={6}
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
          <HeaderSecDashboard title="Total NEW JOBS CREATED " />
          <div className="grid grid-cols-2">
            <HeaderSecDashboard title="Jobs Created by Gender" />
            <HeaderSecDashboard title="JOBS CREATED BY AGE" />
          </div>
          <HeaderSecDashboard title="Total VOLUNTEERS" />
          <div className="grid grid-cols-2">
            <HeaderSecDashboard title="VOLUNTEERS CREATED BY GENDER" />
            <HeaderSecDashboard title="VOLUNTEERS CREATED BY AGE" />
          </div>
        </PageCard>
      </PageRow>

      <div className="w-2/5">Map</div>
    </div>
  );
};

export default Dashboard;
