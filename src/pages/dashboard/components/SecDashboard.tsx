import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Toggle, { TogglePropsItem } from "@/components/elements/Toggle/Toggle";
import { VARIANT_TOGGLE_DASHBOARD } from "@/components/elements/Toggle/ToggleVariants";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import BlurContainer from "@/components/extensive/BlurContainer/BlurContainer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import {
  CHART_TYPES,
  DUMMY_DATA_FOR_CHART_DOUGHNUT_CHART_GENDER,
  DUMMY_DATA_FOR_CHART_GROUPED_BAR_CHART_GENDER,
  DUMMY_DATA_FOR_CHART_MULTI_LINE_CHART,
  DUMMY_DATA_FOR_CHART_SIMPLE_BAR_CHART,
  DUMMY_DATA_TARGET_LAND_USE_TYPES_REPRESENTED,
  TEXT_TYPES
} from "@/constants/dashboardConsts";
import { useOnMount } from "@/hooks/useOnMount";
import { TextVariants } from "@/types/common";
import { getRestorationGoalDataForChart, getRestorationGoalResumeData, isEmptyChartData } from "@/utils/dashboardUtils";

import DoughnutChart from "../charts/DoughnutChart";
import GroupedBarChart from "../charts/GroupedBarChart";
import HorizontalStackedBarChart from "../charts/HorizontalStackedBarChart";
import MultiLineChart from "../charts/MultiLineChart";
import SimpleBarChart from "../charts/SimpleBarChart";
import GraphicDashboard from "./GraphicDashboard";
import GraphicIconDashboard from "./GraphicIconDashboard";
import ObjectiveSec, { DashboardDataProps } from "./ObjectiveSec";
import ValueNumberDashboard from "./ValueNumberDashboard";

interface secondOptionsDataItem {
  tooltip: TogglePropsItem;
  color?: string;
}

const SecDashboard = ({
  title,
  type,
  secondOptionsData = [],
  className,
  classNameBody,
  classNameHeader,
  classNameTitle,
  shouldShowOnlyOneLine = false,
  variantTitle,
  tooltip,
  isTableProject,
  data,
  dataForChart,
  chartType,
  isUserAllowed = true,
  isLoading = false,
  showTreesRestoredGraph = true
}: {
  title: string;
  type?: "legend" | "toggle";
  secondOptionsData?: secondOptionsDataItem[];
  className?: string;
  classNameBody?: string;
  classNameHeader?: string;
  classNameTitle?: string;
  shouldShowOnlyOneLine?: boolean;
  variantTitle?: TextVariants;
  data: DashboardDataProps;
  isTableProject?: boolean;
  tooltip?: string;
  dataForChart?: any;
  chartType?: string;
  isUserAllowed?: boolean;
  isLoading?: boolean;
  showTreesRestoredGraph?: boolean;
}) => {
  const router = useRouter();
  const [toggleValue, setToggleValue] = useState(0);
  const [restorationGoalResume, setRestorationGoalResume] = useState<
    { name: string; value: number | undefined; color: string }[]
  >([]);
  const [treesPlantedByYear, setTreesPlantedByYear] = useState<{ name: string; values: any }[]>([]);
  const t = useT();

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

  useOnMount(() => {
    if (data?.tableData) {
      setToggleValue(1);
    }
  });

  useEffect(() => {
    if (dataForChart && dataForChart?.message === "Job dispatched") {
      return;
    }
    if (dataForChart && chartType === CHART_TYPES.multiLineChart) {
      const data = getRestorationGoalDataForChart(dataForChart, toggleValue === 1, shouldShowOnlyOneLine);
      setTreesPlantedByYear(data);
    }
    if (dataForChart && chartType === CHART_TYPES.treesPlantedBarChart) {
      const data = getRestorationGoalResumeData(dataForChart);
      setRestorationGoalResume(data);
    }
  }, [chartType, dataForChart, shouldShowOnlyOneLine, toggleValue]);

  return (
    <div className={className}>
      <div
        className={classNames(
          "flex items-center justify-between mobile:flex-col mobile:items-start mobile:gap-2",
          classNameHeader
        )}
      >
        <div className="flex items-center gap-1">
          <Text variant={variantTitle || "text-14"} className={classNames("uppercase text-darkCustom", classNameTitle)}>
            {t(title)}
          </Text>
          <When condition={!!tooltip}>
            <ToolTip title={t(title)} content={t(tooltip)} width="w-52 lg:w-64" trigger="click">
              <Icon name={IconNames.IC_INFO} className="h-4.5 w-4.5 text-darkCustom lg:h-5 lg:w-5" />
            </ToolTip>
          </When>
        </div>
        <When condition={type === "legend"}>
          <div className="flex gap-4">
            {secondOptionsData &&
              secondOptionsData.map((item: secondOptionsDataItem, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div className={classNames("h-2 w-2 rounded-full", item.color)} />
                  <Text variant="text-12" className="text-darkCustom">
                    {item.tooltip.render}
                  </Text>
                </div>
              ))}
          </div>
        </When>
        <When condition={type === "toggle"}>
          <Toggle
            items={secondOptionsData.map(item => item.tooltip)}
            onChangeActiveIndex={setToggleValue}
            variant={VARIANT_TOGGLE_DASHBOARD}
          />
        </When>
      </div>
      <div
        className={classNames(
          "relative mt-3 flex items-center justify-between mobile:flex-col mobile:items-start",
          classNameBody
        )}
      >
        {data?.value !== undefined && (
          <ValueNumberDashboard value={data.value} unit={data.unit} totalValue={data.totalValue} />
        )}
        <When condition={data?.totalValue && showTreesRestoredGraph}>
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
            isBlur={(isUserAllowed ?? false) && !isLoading && isEmptyChartData(chartType ?? "", treesPlantedByYear)}
            textType={TEXT_TYPES.NO_DATA}
            className="ml-[20px] lg:ml-[15px]"
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
            isBlur={
              (isUserAllowed ?? false) && !isLoading && isEmptyChartData(CHART_TYPES.groupedBarChart, dataForChart)
            }
            textType={TEXT_TYPES.NO_DATA}
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
            isBlur={(isUserAllowed ?? false) && !isLoading && isEmptyChartData(CHART_TYPES.doughnutChart, dataForChart)}
            textType={TEXT_TYPES.NO_DATA}
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
            isBlur={
              (isUserAllowed ?? false) &&
              !isLoading &&
              isEmptyChartData(CHART_TYPES.simpleBarChart, dataForChart?.restorationStrategiesRepresented)
            }
            textType={TEXT_TYPES.NO_DATA}
            className="ml-[40px] lg:ml-[35px]"
          >
            <SimpleBarChart
              data={
                isEmptyChartData(CHART_TYPES.simpleBarChart, dataForChart?.restorationStrategiesRepresented)
                  ? DUMMY_DATA_FOR_CHART_SIMPLE_BAR_CHART
                  : dataForChart?.restorationStrategiesRepresented
              }
              total={dataForChart?.totalSection?.totalHectaresRestored}
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
                    classNameWrapper="mobile:px-0"
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
          <BlurContainer
            isBlur={
              (isUserAllowed ?? false) &&
              !isLoading &&
              (data?.graphicTargetLandUseTypes === undefined || data?.graphicTargetLandUseTypes.length === 0)
            }
            textType={TEXT_TYPES.NO_DATA}
          >
            <GraphicIconDashboard
              data={
                data?.graphicTargetLandUseTypes === undefined || data?.graphicTargetLandUseTypes.length === 0
                  ? DUMMY_DATA_TARGET_LAND_USE_TYPES_REPRESENTED.graphicTargetLandUseTypes
                  : data?.graphicTargetLandUseTypes ?? []
              }
              maxValue={
                data?.graphicTargetLandUseTypes === undefined || data?.graphicTargetLandUseTypes.length === 0
                  ? 90
                  : data?.totalSection?.totalHectaresRestored ?? 0
              }
            />
          </BlurContainer>
        </When>
        <When condition={!!data?.objetiveText}>
          <ObjectiveSec data={data} />
        </When>
      </div>
    </div>
  );
};

export default SecDashboard;
