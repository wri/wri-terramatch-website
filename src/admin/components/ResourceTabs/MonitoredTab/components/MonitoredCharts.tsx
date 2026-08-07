import { useT } from "@transifex/react";
import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";
import { ReactNode } from "react";

import SimpleBarChart from "@/pages/dashboard/charts/SimpleBarChart";
import GraphicIconDashboard from "@/pages/dashboard/components/GraphicIconDashboard";
import SecDashboard from "@/pages/dashboard/components/SecDashboard";
import { isNotNull } from "@/utils/array";
import { TreeCoverLossPolygonCounts } from "@/utils/MonitoredIndicatorUtils";

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
  hasIndicatorData: boolean;
  parsedData: any[];
  ecoRegionData: any;
  strategiesData: any[];
  landUseData: any;
  record: RecordType;
  totalHectaresRestoredGoal: number;
  treeCoverLossPolygonCounts?: TreeCoverLossPolygonCounts;
};

const MonitoredCharts: FC<MonitoredChartsProps> = ({
  selected,
  isLoadingIndicator,
  hasIndicatorData,
  parsedData,
  ecoRegionData,
  strategiesData,
  landUseData,
  record,
  totalHectaresRestoredGoal,
  treeCoverLossPolygonCounts
}) => {
  const [hasNoData, setHasNoData] = useState(false);

  useEffect(() => {
    if (isLoadingIndicator) {
      setHasNoData(false);
      return;
    }
    setHasNoData(!hasIndicatorData);
  }, [hasIndicatorData, isLoadingIndicator]);

  const renderChart = (chartId: React.Key) => {
    switch (chartId) {
      case "1":
      case "2":
        return (
          <ChartContainer key={chartId} isLoading={isLoadingIndicator} hasNoData={!hasIndicatorData}>
            <TreeLossBarChart data={parsedData} className="flex flex-col" polygonCounts={treeCoverLossPolygonCounts} />
          </ChartContainer>
        );

      case "3":
        return (
          <ChartContainer key={chartId} isLoading={isLoadingIndicator} hasNoData={!hasIndicatorData}>
            <EcoRegionDoughnutChart data={ecoRegionData} />
          </ChartContainer>
        );

      case "4":
        return (
          <ChartContainer key={chartId} isLoading={isLoadingIndicator} hasNoData={!hasIndicatorData}>
            <RestorationMetrics
              record={record}
              totalHectaresRestoredGoal={totalHectaresRestoredGoal}
              strategiesData={strategiesData}
            />
          </ChartContainer>
        );

      case "5":
        return (
          <ChartContainer key={chartId} isLoading={isLoadingIndicator} hasNoData={!hasIndicatorData}>
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
