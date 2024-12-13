import React from "react";
import { ReactNode } from "react";
import { When } from "react-if";

import SimpleBarChart from "@/pages/dashboard/charts/SimpleBarChart";
import GraphicIconDashboard from "@/pages/dashboard/components/GraphicIconDashboard";
import SecDashboard from "@/pages/dashboard/components/SecDashboard";
import { TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP } from "@/pages/dashboard/constants/tooltips";

import EcoRegionDoughnutChart from "./EcoRegionDoughnutChart";
import { LoadingState } from "./MonitoredLoading";
import { NoDataState } from "./NoDataState";
import TreeLossBarChart from "./TreesLossBarChart";

const ChartContainer = ({
  children,
  isLoading,
  hasNoData
}: {
  children: ReactNode;
  isLoading: boolean;
  hasNoData: boolean;
}): JSX.Element | null => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (hasNoData) {
    return <NoDataState />;
  }

  return <>{children}</>;
};

interface RecordType {
  total_hectares_restored_sum: number;
}

const RestorationMetrics = ({
  record,
  totalHectaresRestoredGoal,
  strategiesData
}: {
  record: RecordType;
  totalHectaresRestoredGoal: number;
  strategiesData: any[];
}) => (
  <div className="flex w-full flex-col gap-6 lg:ml-[35px]">
    <SecDashboard
      title="Total Hectares Under Restoration"
      data={{
        value: record.total_hectares_restored_sum,
        totalValue: totalHectaresRestoredGoal
      }}
      className="w-full place-content-center pl-8"
      tooltip={TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP}
      showTreesRestoredGraph={false}
    />
    <SimpleBarChart data={strategiesData} />
  </div>
);

interface MonitoredChartsProps {
  selected: React.Key[];
  isLoadingIndicator: boolean;
  parsedData: any[];
  ecoRegionData: any;
  strategiesData: any[];
  landUseData: any;
  record: RecordType;
  totalHectaresRestoredGoal: number;
}

const MonitoredCharts = ({
  selected,
  isLoadingIndicator,
  parsedData,
  ecoRegionData,
  strategiesData,
  landUseData,
  record,
  totalHectaresRestoredGoal
}: MonitoredChartsProps) => {
  const renderChart = (chartId: React.Key) => {
    switch (chartId) {
      case "1":
      case "2":
        return (
          <ChartContainer isLoading={isLoadingIndicator} hasNoData={!parsedData?.length}>
            <TreeLossBarChart data={parsedData} className="flex flex-col" />
          </ChartContainer>
        );

      case "3":
        return (
          <ChartContainer isLoading={isLoadingIndicator} hasNoData={!ecoRegionData?.chartData?.length}>
            <EcoRegionDoughnutChart data={ecoRegionData} />
          </ChartContainer>
        );

      case "4":
        return (
          <ChartContainer isLoading={isLoadingIndicator} hasNoData={!strategiesData?.length}>
            <RestorationMetrics
              record={record}
              totalHectaresRestoredGoal={totalHectaresRestoredGoal}
              strategiesData={strategiesData}
            />
          </ChartContainer>
        );

      case "5":
        return (
          <ChartContainer isLoading={isLoadingIndicator} hasNoData={!landUseData?.graphicTargetLandUseTypes?.length}>
            <div className="w-full pt-12">
              <GraphicIconDashboard data={landUseData.graphicTargetLandUseTypes} maxValue={totalHectaresRestoredGoal} />
            </div>
          </ChartContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {selected.map(
        (id: React.Key | null | undefined) =>
          id != null && (
            <When key={id} condition={selected.includes(id)}>
              {renderChart(id)}
            </When>
          )
      )}
    </div>
  );
};

export default MonitoredCharts;
