import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Toggle from "@/components/elements/Toggle/Toggle";
import { VARIANT_TOGGLE_DASHBOARD } from "@/components/elements/Toggle/ToggleVariants";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import BlurContainer from "@/components/extensive/BlurContainer/BlurContainer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import {
  CHART_TYPES,
  DUMMY_DATA_FOR_CHART_DOUGHNUT_CHART_GENDER,
  DUMMY_DATA_FOR_CHART_GROUPED_BAR_CHART_GENDER,
  DUMMY_DATA_FOR_CHART_MULTI_LINE_CHART,
  DUMMY_DATA_FOR_CHART_SIMPLE_BAR_CHART
} from "@/constants/dashboardConsts";
import { TextVariants } from "@/types/common";
import { getRestorationGoalDataForChart, getRestorationGoalResumeData, isEmptyChartData } from "@/utils/dashboardUtils";

import DoughnutChart from "../charts/DoughnutChart";
import GroupedBarChart from "../charts/GroupedBarChart";
import HorizontalStackedBarChart from "../charts/HorizontalStackedBarChart";
import MultiLineChart from "../charts/MultiLineChart";
import SimpleBarChart from "../charts/SimpleBarChart";
import { DashboardDataProps } from "../project/index.page";
import GraphicDashboard from "./GraphicDashboard";
import GraphicIconDashboard from "./GraphicIconDashboard";
import ObjectiveSec from "./ObjectiveSec";
import ValueNumberDashboard from "./ValueNumberDashboard";

const SecDashboard = ({
  title,
  type,
  secondOptionsData,
  className,
  classNameBody,
  classNameHeader,
  classNameTitle,
  tooltipGraphic = false,
  variantTitle,
  tooltip,
  isTableProject,
  data,
  dataForChart,
  chartType
}: {
  title: string;
  type?: "legend" | "toggle";
  secondOptionsData?: any;
  className?: string;
  classNameBody?: string;
  classNameHeader?: string;
  classNameTitle?: string;
  tooltipGraphic?: boolean;
  variantTitle?: TextVariants;
  data: DashboardDataProps;
  isTableProject?: boolean;
  tooltip?: string;
  dataForChart?: any;
  chartType?: string;
}) => {
  const router = useRouter();
  const [toggleValue, setToggleValue] = useState(0);
  const [restorationGoalResume, setRestorationGoalResume] = useState<
    { name: string; value: number | undefined; color: string }[]
  >([]);
  const [treesPlantedByYear, setTreesPlantedByYear] = useState<{ name: string; values: any }[]>([]);
  const t = useT();

  const noDataInformation = t(
    "Data is still being collected and checked. This visual will remain empty until data is properly quality assured."
  );

  const tableColumns = [
    {
      header: isTableProject ? "Organization" : "Specie",
      accessorKey: "label",
      enableSorting: false
    },
    {
      header: "Count",
      accessorKey: "valueText",
      enableSorting: false
    }
  ];

  const handleViewAllClick = () => {
    router.push("/dashboard/project-list");
  };

  useEffect(() => {
    if (data?.tableData) {
      setToggleValue(1);
    }
  }, []);

  useEffect(() => {
    if (dataForChart && dataForChart?.message === "Job dispatched") {
      return;
    }
    if (dataForChart && chartType === CHART_TYPES.multiLineChart) {
      const data = getRestorationGoalDataForChart(dataForChart, toggleValue === 1);
      setTreesPlantedByYear(data);
    }
    if (dataForChart && chartType === CHART_TYPES.treesPlantedBarChart) {
      const data = getRestorationGoalResumeData(dataForChart);
      setRestorationGoalResume(data);
    }
  }, [dataForChart, toggleValue]);

  return (
    <div className={className}>
      <div className={classNames("flex items-center justify-between", classNameHeader)}>
        <div className="flex items-center gap-1">
          <Text variant={variantTitle || "text-14"} className={classNames("uppercase text-darkCustom", classNameTitle)}>
            {t(title)}
          </Text>
          <When condition={!!tooltip}>
            <ToolTip title={t(title)} content={t(tooltip)} width="w-52 lg:w-64" trigger="click">
              <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5" />
            </ToolTip>
          </When>
        </div>
        <When condition={type === "legend"}>
          <div className="flex gap-4">
            {secondOptionsData &&
              secondOptionsData.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div className={classNames("h-2 w-2 rounded-full", item.color)} />
                  <Text variant="text-12" className="text-darkCustom">
                    {t(item.label)}
                  </Text>
                </div>
              ))}
          </div>
        </When>
        <When condition={type === "toggle"}>
          <Toggle
            items={secondOptionsData}
            activeIndex={toggleValue}
            setActiveIndex={() => {
              setToggleValue(toggleValue === 0 ? 1 : 0);
            }}
            variant={VARIANT_TOGGLE_DASHBOARD}
          />
        </When>
      </div>
      <div className={classNames("relative mt-3 flex items-center justify-between", classNameBody)}>
        {data?.value !== undefined && (
          <ValueNumberDashboard value={data.value} unit={data.unit} totalValue={data.totalValue} />
        )}
        <When condition={data?.totalValue}>
          <div className="relative h-9 w-[315px]">
            <div className="absolute inset-0 z-0 h-full w-full">
              <HorizontalStackedBarChart data={restorationGoalResume} className="h-full w-full" />
            </div>
            <img
              src="/images/treeBackground.svg"
              id="treeBackground"
              alt="secondValue"
              className="z-1 absolute right-0 h-9 w-[316px]"
            />
          </div>
        </When>
        <When condition={chartType === CHART_TYPES.multiLineChart}>
          <BlurContainer
            isBlur={isEmptyChartData(chartType ?? "", treesPlantedByYear)}
            textInformation={noDataInformation}
          >
            <MultiLineChart
              data={
                isEmptyChartData(chartType ?? "", treesPlantedByYear)
                  ? DUMMY_DATA_FOR_CHART_MULTI_LINE_CHART
                  : treesPlantedByYear
              }
              isAbsoluteData={toggleValue === 1}
            />
          </BlurContainer>
        </When>
        <When condition={chartType === CHART_TYPES.groupedBarChart}>
          <BlurContainer
            isBlur={isEmptyChartData(CHART_TYPES.groupedBarChart, dataForChart)}
            textInformation={noDataInformation}
          >
            <GroupedBarChart
              data={
                isEmptyChartData(CHART_TYPES.groupedBarChart, dataForChart)
                  ? DUMMY_DATA_FOR_CHART_GROUPED_BAR_CHART_GENDER
                  : dataForChart
              }
            />
          </BlurContainer>
        </When>
        <When condition={chartType === CHART_TYPES.doughnutChart}>
          <BlurContainer
            isBlur={isEmptyChartData(CHART_TYPES.doughnutChart, dataForChart)}
            textInformation={noDataInformation}
          >
            <DoughnutChart
              data={
                isEmptyChartData(CHART_TYPES.doughnutChart, dataForChart)
                  ? DUMMY_DATA_FOR_CHART_DOUGHNUT_CHART_GENDER
                  : dataForChart
              }
            />
          </BlurContainer>
        </When>
        <When condition={chartType === CHART_TYPES.simpleBarChart}>
          <BlurContainer
            isBlur={isEmptyChartData(CHART_TYPES.simpleBarChart, dataForChart)}
            textInformation={noDataInformation}
          >
            <SimpleBarChart
              data={
                isEmptyChartData(CHART_TYPES.simpleBarChart, dataForChart)
                  ? DUMMY_DATA_FOR_CHART_SIMPLE_BAR_CHART
                  : dataForChart
              }
            />
          </BlurContainer>
        </When>
        <When condition={data?.graphic}>
          <img src={data?.graphic} alt={data?.graphic} className="w-full" />
          <div>
            <When condition={!!data?.graphicLegend}>
              <div className="flex gap-3">
                {data?.graphicLegend?.map((item, index) => (
                  <div key={index} className="flex items-baseline gap-1">
                    <div className={classNames("h-2 w-2 rounded-full lg:h-3 lg:w-3", item.color)} />
                    <div>
                      <Text variant="text-12-light" className="text-darkCustom">
                        {t(item.label)}
                      </Text>
                      <Text variant="text-12-light" className="text-darkCustom opacity-60">
                        {t(item.value)}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </When>
          </div>
        </When>
        <When condition={!!data?.tableData}>
          <When condition={toggleValue === 1}>
            {data?.tableData && <GraphicDashboard data={data?.tableData} maxValue={data.maxValue ?? 0} />}
          </When>
          <When condition={toggleValue === 0}>
            <div className="w-full">
              {data && (
                <>
                  <Table
                    data={data?.tableData ?? []}
                    hasPagination={false}
                    columns={tableColumns}
                    variant={VARIANT_TABLE_SITE_POLYGON_REVIEW}
                  />
                  <Text
                    variant="text-14"
                    className="mt-1 cursor-pointer pt-2 pl-4 text-primary underline"
                    onClick={handleViewAllClick}
                  >
                    {t("VIEW ALL PROJECTS")}
                  </Text>
                </>
              )}
            </div>
          </When>
        </When>
        <When condition={chartType === CHART_TYPES.barChart}>
          <GraphicIconDashboard
            data={data?.graphicTargetLandUseTypes ?? []}
            maxValue={data?.totalSection?.totalHectaresRestored ?? 0}
          />
        </When>
        <When condition={!!data?.objetiveText}>
          <ObjectiveSec data={data} />
        </When>
      </div>
    </div>
  );
};

export default SecDashboard;
