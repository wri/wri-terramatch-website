import { useT } from "@transifex/react";
import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";
import { ReactNode } from "react";

import SimpleBarChart from "@/pages/dashboard/charts/SimpleBarChart";
import GraphicIconDashboard from "@/pages/dashboard/components/GraphicIconDashboard";
import SecDashboard from "@/pages/dashboard/components/SecDashboard";
import { isNotNull } from "@/utils/array";

import EcoRegionDoughnutChart from "./EcoRegionDoughnutChart";
import { LoadingState } from "./MonitoredLoading";
import { NoDataState } from "./NoDataState";
import TreeLossBarChart from "./TreesLossBarChart";

const TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP =
  "Total land area measured in hectares with active restoration interventions, tallied by the total area of polygons submitted by projects.";

type ChartContainerProps = {
  children: ReactNode;
  isLoading: boolean;
  hasNoData: boolean;
};

const ChartContainer: FC<ChartContainerProps> = ({ children, isLoading, hasNoData }) => {
  if (isLoading) return <LoadingState />;
  if (hasNoData) return <NoDataState />;
  return <>{children}</>;
};

type RecordType = {
  totalHectaresRestoredSum: number;
};

type RestorationMetricsProps = {
  record: RecordType;
  totalHectaresRestoredGoal: number;
  strategiesData: any[];
};

const RestorationMetrics: FC<RestorationMetricsProps> = ({ record, totalHectaresRestoredGoal, strategiesData }) => {
  const t = useT();

  return (
    <div className="flex w-full flex-col gap-6 lg:ml-[35px]">
      <SecDashboard
        title={t("Total Hectares Under Restoration")}
        data={{
          value: parseFloat(record.totalHectaresRestoredSum.toFixed(1)),
          totalValue: totalHectaresRestoredGoal
        }}
        className="w-full place-content-center pl-8"
        tooltip={t(TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP)}
        showTreesRestoredGraph={false}
        classNameBody="!mt-1.5"
      />
      <SimpleBarChart data={strategiesData} total={record.totalHectaresRestoredSum} />
    </div>
  );
};

type MonitoredChartsProps = {
  selected: React.Key[];
  isLoadingIndicator: boolean;
  parsedData: any[];
  ecoRegionData: any;
  strategiesData: any[];
  landUseData: any;
  record: RecordType;
  totalHectaresRestoredGoal: number;
};

const MonitoredCharts: FC<MonitoredChartsProps> = ({
  selected,
  isLoadingIndicator,
  parsedData,
  ecoRegionData,
  strategiesData,
  landUseData,
  record,
  totalHectaresRestoredGoal
}) => {
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
          <ChartContainer key={chartId} isLoading={isLoadingIndicator} hasNoData={!parsedData?.length}>
            <TreeLossBarChart data={parsedData} className="flex flex-col" />
          </ChartContainer>
        );

      case "3":
        return (
          <ChartContainer key={chartId} isLoading={isLoadingIndicator} hasNoData={!ecoRegionData?.chartData?.length}>
            <EcoRegionDoughnutChart data={ecoRegionData} />
          </ChartContainer>
        );

      case "4":
        return (
          <ChartContainer key={chartId} isLoading={isLoadingIndicator} hasNoData={!strategiesData?.length}>
            <RestorationMetrics
              record={record}
              totalHectaresRestoredGoal={totalHectaresRestoredGoal}
              strategiesData={strategiesData}
            />
          </ChartContainer>
        );

      case "5":
        return (
          <ChartContainer
            key={chartId}
            isLoading={isLoadingIndicator}
            hasNoData={!landUseData?.graphicTargetLandUseTypes?.length}
          >
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
      {selected.filter(isNotNull).map(id => (selected.includes(id) ? renderChart(id) : null))}
    </div>
  );
};

export default MonitoredCharts;
