import classNames from "classnames";
import React, { useEffect, useState } from "react";
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
  // Temporary until all entities have been moved to v3.
  total_hectares_restored_sum?: number;
  totalHectaresRestoredSum?: number;
}

const RestorationMetrics = ({
  record,
  totalHectaresRestoredGoal,
  strategiesData
}: {
  record: RecordType;
  totalHectaresRestoredGoal: number;
  strategiesData: any[];
}) => {
  const sum = record.total_hectares_restored_sum ?? record.totalHectaresRestoredSum ?? 0;
  return (
    <div className="flex w-full flex-col gap-6 lg:ml-[35px]">
      <SecDashboard
        title="Total Hectares Under Restoration"
        data={{
          value: parseFloat(sum.toFixed(1)),
          totalValue: totalHectaresRestoredGoal
        }}
        className="w-full place-content-center pl-8"
        tooltip={TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP}
        showTreesRestoredGraph={false}
        classNameBody="!mt-1.5"
      />
      <SimpleBarChart data={strategiesData} total={sum} />
    </div>
  );
};

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
  const [hasNoData, setHasNoData] = useState(false);

  useEffect(() => {
    if (isLoadingIndicator) {
      setHasNoData(false);
    }
    const noData = selected.some(chartId => {
      switch (chartId) {
        case "1":
        case "2":
          return !parsedData?.length;
        case "3":
          return !ecoRegionData?.chartData?.length;
        case "4":
          return !strategiesData?.length;
        case "5":
          return !landUseData?.graphicTargetLandUseTypes?.length;
        default:
          return false;
      }
    });
    setHasNoData(noData);
  }, [selected, parsedData, ecoRegionData, strategiesData, landUseData, isLoadingIndicator]);

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
            <div className="w-full">
              <GraphicIconDashboard
                title="Hectares Under Restoration By Target Land Use System"
                data={landUseData.graphicTargetLandUseTypes}
                maxValue={totalHectaresRestoredGoal}
                className="pt-8 pl-8 lg:pt-9 wide:pt-10"
              />
            </div>
          </ChartContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={classNames("flex w-full max-w-[calc(71vw-356px)] flex-col gap-6 lg:max-w-[calc(71vw-395px)]", {
        "relative z-10 bg-white": hasNoData
      })}
    >
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
