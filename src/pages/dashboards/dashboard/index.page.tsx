import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

import HeaderSecDashboard from "../components/headerSecDashboard";

const Dashboard = () => {
  const t = useT();

  return (
    <div className="flex gap-4 bg-neutral-70 p-4">
      <PageRow className="w-3/5 gap-4 p-0">
        <PageCard
          className="border-0 px-4 py-6"
          gap={6}
          title={t("TREES RESTORED")}
          subtitle={
            <Text variant="text-14-light" className="text-darkCustom">
              The numbers and reports below display data related to Indicator 1: Trees Restored described in TerraFund’s
              MRV framework. Please refer to the linked MRV framework for details on how these numbers are sourced and
              verified.
            </Text>
          }
        >
          <HeaderSecDashboard title="Number of trees planted" />
        </PageCard>
        <PageCard
          className="border-0 px-4 py-6"
          gap={6}
          title={t("HECTARES UNDER RESTORATION")}
          subtitle={
            <Text variant="text-14-light" className="text-darkCustom">
              The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in
              TerraFund’s MRV framework. Please refer to the linked MRV framework for details on how these numbers are
              sourced and verified.
            </Text>
          }
        >
          <HeaderSecDashboard title="Total HECTARES UNDER RESTORATION" />
        </PageCard>
        <PageCard
          className="border-0 px-4 py-6"
          gap={6}
          title={t("JOBS CREATED")}
          subtitle={
            <Text variant="text-14-light" className="text-darkCustom">
              The numbers and reports below display data related to Indicator 3: Jobs Created described in TerraFund’s
              MRV framework. TerraFund defines a job as a set of tasks and duties performed by one person aged 18 or
              over in exchange for monetary pay in line with living wage standards. All indicators in the Jobs Created
              category are disaggregated by number of women, number of men, and number of youths. Restoration Champions
              are required to report on jobs and volunteers every 6 months and provide additional documentation to
              verify employment. Please refer to the linked MRV framework for additional details on how these numbers
              are sourced and verified.
            </Text>
          }
        >
          <HeaderSecDashboard title="Total NEW JOBS CREATED " />
        </PageCard>
      </PageRow>

      <div className="w-2/5">Map</div>
    </div>
  );
};

export default Dashboard;
