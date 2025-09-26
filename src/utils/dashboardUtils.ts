import { useT } from "@transifex/react";

import { CHART_TYPES, DEFAULT_POLYGONS_DATA, MONTHS } from "@/constants/dashboardConsts";
import { GetV2EntityUUIDAggregateReportsResponse } from "@/generated/apiComponents";
import {
  DashboardProjectsLightDto,
  TotalJobsCreatedDto,
  TreeRestorationGoalDto
} from "@/generated/v3/dashboardService/dashboardServiceSchemas";

type DataPoint = {
  time: string;
  Total: number;
  Enterprise: number;
  "Non Profit": number;
};

type Objetive = {
  objetiveText: string;
  preferredLanguage: string;
  landTenure: string;
};

export interface ChartDataItem {
  name: string;
  [key: string]: number | string;
}

export interface GroupedBarChartData {
  type: "gender" | "age";
  chartData: ChartDataItem[];
  total: number;
  maxValue: number;
}

export interface ChartDataItemVolunteers {
  name: string;
  value: number;
}

export interface ChartDataVolunteers {
  chartData: ChartDataItem[];
  type: string;
  total: number;
}

export const parseJobCreatedByType = (
  data: TotalJobsCreatedDto | undefined,
  type: "gender" | "age",
  t: typeof useT
): GroupedBarChartData => {
  if (!data) return { type, chartData: [], total: 0, maxValue: 0 };

  if (type === "gender") {
    const ptWomen = data.totalPtWomen ?? 0;
    const ptMen = data.totalPtMen ?? 0;
    const ptNonBinary = data.totalPtNonBinary ?? 0;
    const ptOthersGender = (data as any).totalPtOthersGender ?? 0;
    const ftWomen = data.totalFtWomen ?? 0;
    const ftMen = data.totalFtMen ?? 0;
    const ftNonBinary = data.totalFtNonBinary ?? 0;
    const ftOthersGender = (data as any).totalFtOthersGender ?? 0;

    const maxValue = Math.max(ptWomen, ptMen, ptNonBinary, ptOthersGender, ftWomen, ftMen, ftNonBinary, ftOthersGender);

    const chartData = [
      { name: t("Part-Time"), Women: ptWomen, Men: ptMen, "Non-Binary": ptNonBinary, Other: ptOthersGender },
      { name: t("Full-Time"), Women: ftWomen, Men: ftMen, "Non-Binary": ftNonBinary, Other: ftOthersGender }
    ];

    return { type, chartData, total: data.totalJobsCreated, maxValue };
  }

  const ptYouth = data.totalPtYouth ?? 0;
  const ptNonYouth = data.totalPtNonYouth ?? 0;
  const ptOthersAge = (data as any).totalPtOthersAge ?? 0;
  const ftYouth = data.totalFtYouth ?? 0;
  const ftNonYouth = data.totalFtNonYouth ?? 0;
  const ftOthersAge = (data as any).totalFtOthersAge ?? 0;

  const maxValue = Math.max(ptYouth, ptNonYouth, ptOthersAge, ftYouth, ftNonYouth, ftOthersAge);
  const chartData = [
    { name: t("Part-Time"), Youth: ptYouth, "Non-Youth": ptNonYouth, Other: ptOthersAge },
    { name: t("Full-Time"), Youth: ftYouth, "Non-Youth": ftNonYouth, Other: ftOthersAge }
  ];
  return { type, chartData, total: data.totalJobsCreated, maxValue };
};

export const parseVolunteersByType = (
  data: TotalJobsCreatedDto | undefined,
  type: "gender" | "age",
  t: typeof useT
): ChartDataVolunteers => {
  if (!data) return { chartData: [], type, total: 0 };

  if (type === "gender") {
    const chartData: ChartDataItem[] = [
      { name: t("Women"), value: (data as any).volunteerWomen ?? 0 },
      { name: t("Men"), value: (data as any).volunteerMen ?? 0 },
      { name: t("Unknown"), value: (data as any).volunteerOthers ?? 0 },
      { name: t("Non-Binary"), value: (data as any).volunteerNonBinary ?? 0 }
    ];
    const total = (data as any).totalVolunteers ?? chartData.reduce((s, i: any) => s + (i.value ?? 0), 0);
    return { type, chartData, total };
  }
  const chartData: ChartDataItem[] = [
    { name: t("Youth"), value: (data as any).volunteerYouth ?? 0 },
    { name: t("Non-Youth"), value: (data as any).volunteerNonYouth ?? 0 },
    { name: t("Unknown"), value: (data as any).volunteerAgeOthers ?? 0 }
  ];
  const total = (data as any).totalVolunteers ?? chartData.reduce((s, i: any) => s + (i.value ?? 0), 0);
  return { type, chartData, total };
};

interface Option {
  title: string;
  value: string;
}

interface HectaresUnderRestoration {
  restorationStrategiesRepresented: Record<string, number>;
  targetLandUseTypesRepresented: Record<string, number>;
}

interface ParsedDataItem {
  label: string;
  value: number;
}

interface ParsedLandUseType extends ParsedDataItem {
  valueText: string;
}

export interface HectaresUnderRestorationData {
  totalSection: {
    totalHectaresRestored: number;
    numberOfSites: number;
  };
  restorationStrategiesRepresented: ParsedDataItem[];
  graphicTargetLandUseTypes: ParsedLandUseType[];
}

interface TreeSpeciesData {
  treeSpeciesAmount: number;
  treeSpeciesPercentage: number;
  dueDate: string | number | Date;
}

interface RestorationData {
  treesUnderRestorationActualTotal?: TreeSpeciesData[];
  treesUnderRestorationActualForProfit?: TreeSpeciesData[];
  treesUnderRestorationActualNonProfit?: TreeSpeciesData[];
}

interface ChartDataPoint {
  time: Date;
  value: number;
  name: string;
}

export interface ChartCategory {
  name: string;
  values: ChartDataPoint[];
}

interface PolygonIndicator {
  id?: number;
  poly_name?: string;
  status?: string;
  data?: Record<string, number>;
  value?: Record<string, any>;
  [key: string]: any;
}

export interface ParsedPolygonsData {
  graphicTargetLandUseTypes: ParsedLandUseType[];
  totalSection: {
    totalHectaresRestored: number;
  };
}

interface ParsedResult {
  chartData: ChartDataItem[];
  total: number;
}

type YearlyData = {
  name: number;
  treeCoverLoss: number;
  treeCoverLossFires: number;
};

export const cohortNames = {
  ppc: "PPC",
  terrafund: "TerraFund Top 100",
  "terrafund-landscapes": "TerraFund Landscapes",
  hbf: "HBF",
  "epa-ghana-pilot": "EPA-Ghana Pilot"
};
export const formatNumberUS = (value: number) =>
  value ? (value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : value.toLocaleString("en-US")) : "";

export const formatNumberChart = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString("en-US");
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const formatMonth = (monthNumber: number): string => MONTHS[monthNumber - 1];

export const countValuesPerYear = (data: DataPoint[]): Record<string, number> => {
  return data.reduce((acc, item) => {
    const year = item.time.split("-")[0];
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const createQueryParams = (filters: any) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => queryParams.append(`filter[${key}][]`, v));
    } else if (value) {
      queryParams.append(`filter[${key}]`, value as string);
    }
  });
  return queryParams.toString();
};

export const getRestorationGoalResumeData = (data: TreeRestorationGoalDto) => [
  { name: "Total", value: data?.totalTreesGrownGoal, color: "#13487A" },
  { name: "Enterprise", value: data?.forProfitTreeCount, color: "#7BBD31" },
  { name: "Non Profit", value: data?.nonProfitTreeCount, color: "#B9EDFF" }
];

export const getRestorationGoalDataForChart = (
  data: RestorationData,
  isPercentage: boolean,
  shouldShowOnlyOneLine: boolean
): ChartCategory[] => {
  const createChartPoints = (
    sourceData: TreeSpeciesData[] | undefined,
    categoryName: string
  ): { sum: number; values: ChartDataPoint[] } => {
    let sum = 0;
    const values =
      sourceData?.map(item => {
        sum += isPercentage ? item.treeSpeciesPercentage : item.treeSpeciesAmount;
        return {
          time: new Date(item.dueDate),
          value: sum,
          name: categoryName
        };
      }) || [];

    return { sum, values };
  };

  const addCategoryToChart = (
    chartData: ChartCategory[],
    categoryName: string,
    values: ChartDataPoint[],
    sum: number
  ): void => {
    const shouldAdd = !shouldShowOnlyOneLine || (shouldShowOnlyOneLine && sum > 0);
    if (shouldAdd) {
      chartData.push({ name: categoryName, values });
    }
  };

  const chartData: ChartCategory[] = [];

  if (!shouldShowOnlyOneLine) {
    const { values } = createChartPoints(data.treesUnderRestorationActualTotal, "Total");
    chartData.push({ name: "Total", values });
  }

  const { sum: enterpriseSum, values: enterpriseValues } = createChartPoints(
    data.treesUnderRestorationActualForProfit,
    "Enterprise"
  );
  addCategoryToChart(chartData, "Enterprise", enterpriseValues, enterpriseSum);

  const { sum: nonProfitSum, values: nonProfitValues } = createChartPoints(
    data.treesUnderRestorationActualNonProfit,
    "Non Profit"
  );
  addCategoryToChart(chartData, "Non Profit", nonProfitValues, nonProfitSum);

  return chartData;
};

export type AggregateReportData = {
  dueDate?: string | null;
  aggregateAmount?: number;
};

export const getNewRestorationGoalDataForChart = (data?: GetV2EntityUUIDAggregateReportsResponse): ChartCategory[] => {
  if (!data) return [];

  const allDates = new Set<string>();
  const categories = ["tree-planted", "seeding-records", "trees-regenerating"] as const;

  categories.forEach(category => {
    data[category]?.forEach((item: AggregateReportData) => {
      if (item.dueDate) {
        allDates.add(new Date(item.dueDate).toISOString().split("T")[0]);
      }
    });
  });

  const sortedDates = Array.from(allDates).sort();

  const createChartPoints = (
    sourceData: AggregateReportData[],
    categoryName: string
  ): { sum: number; values: ChartDataPoint[] } => {
    const nullSum = sourceData
      .filter(item => item.dueDate === null)
      .reduce((acc, item) => acc + (item.aggregateAmount ?? 0), 0);

    let sum = nullSum;

    const dateAmountMap = sourceData.reduce((acc, item) => {
      if (item.dueDate) {
        const dateKey = new Date(item.dueDate).toISOString().split("T")[0];
        if (!acc[dateKey]) {
          acc[dateKey] = 0;
        }
        acc[dateKey] += item.aggregateAmount ?? 0;
      }
      return acc;
    }, {} as Record<string, number>);

    const values = sortedDates.map(date => {
      sum += dateAmountMap[date] ?? 0;
      return {
        time: new Date(date),
        value: sum,
        name: categoryName
      };
    });

    return { sum, values };
  };

  const chartData: ChartCategory[] = [];

  categories.forEach(category => {
    const categoryData = data[category];
    if (categoryData) {
      const { values } = createChartPoints(
        categoryData,
        category
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );
      chartData.push({
        name: category
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        values
      });
    }
  });

  return chartData;
};

export const formatNumberLocaleString = (value: number): string => {
  return value.toLocaleString();
};

export const getPercentage = (value: number, total: number): string => {
  return ((value / total) * 100).toFixed(1);
};

export const calculatePercentage = (value: number, total: number): number => {
  if (!total) return 0;
  return Number(((value / total) * 100).toFixed(1));
};

export const calculateTotals = (data: GroupedBarChartData): { [key: string]: number } => {
  return data.chartData.reduce((acc, item) => {
    if (data.type === "gender") {
      acc["Women"] = (acc["Women"] || 0) + (item["Women"] as number);
      acc["Men"] = (acc["Men"] || 0) + (item["Men"] as number);
      acc["Non-Binary"] = (acc["Non-Binary"] || 0) + (item["Non-Binary"] as number);
      acc["Other"] = (acc["Other"] || 0) + (item["Other"] as number);
    } else {
      acc["Youth"] = (acc["Youth"] || 0) + (item["Youth"] as number);
      acc["Non-Youth"] = (acc["Non-Youth"] || 0) + (item["Non-Youth"] as number);
      acc["Other"] = (acc["Other"] || 0) + (item["Other"] as number);
    }
    return acc;
  }, {} as { [key: string]: number });
};

export const formatLabelsVolunteers = (value: string): string => {
  const formattedValues: { [key: string]: string } = {
    women: "Women",
    youth: "Youth",
    men: "Men",
    non_youth: "Non-Youth"
  };

  return formattedValues[value] || value;
};

export const COLORS_VOLUNTEERS = ["#70B52B", "#239FDC", "#065327", "#09354D"];

export const getBarColorRestoration = (name: string) => {
  if (name.includes("Tree Planting")) return "#7BBD31";
  if (name.includes("Direct Seeding")) return "#27A9E0";
  if (name.includes("Assisted Natural Regeneration")) return "#13487A";
  if (name.includes("Multiple Strategies")) return "#24555C";
  if (name.includes("No Strategy Identified")) return "#795305";
  return "#13487A";
};

export const getPercentageVolunteers = (value: number, total: number): string => {
  return ((value / total) * 100).toFixed(1);
};

export const calculateTotalsVolunteers = (chartData: ChartDataItem[]): { [key: string]: number } => {
  return chartData.reduce<{ [key: string]: number }>((acc, item) => {
    acc[item.name] = item.value as number;
    return acc;
  }, {});
};

const landUseTypeOptions: Option[] = [
  { title: "Agroforest", value: "agroforest" },
  { title: "Mangrove", value: "mangrove" },
  { title: "Natural Forest", value: "natural-forest" },
  { title: "Silvopasture", value: "silvopasture" },
  { title: "Riparian Area or Wetland", value: "riparian-area-or-wetland" },
  { title: "Urban Forest", value: "urban-forest" },
  { title: "Woodlot or Plantation", value: "woodlot-or-plantation" },
  { title: "Peatland", value: "peatland" },
  { title: "Open Natural Ecosystem", value: "open-natural-ecosystem" }
];

const getRestorationStrategyOptions = {
  "tree-planting": "Tree Planting",
  "direct-seeding": "Direct Seeding",
  "assisted-natural-regeneration": "Assisted Natural Regeneration"
};

export const parseHectaresUnderRestorationData = (
  totalHectaresRestored: number,
  numberOfSites: number,
  hectaresUnderRestoration: HectaresUnderRestoration | undefined
): HectaresUnderRestorationData => {
  if (totalHectaresRestored === undefined || numberOfSites === undefined) {
    return {
      totalSection: {
        totalHectaresRestored: 0,
        numberOfSites: 0
      },
      restorationStrategiesRepresented: [],
      graphicTargetLandUseTypes: []
    };
  }

  if (hectaresUnderRestoration == null) {
    return {
      totalSection: {
        totalHectaresRestored: Number((totalHectaresRestored ?? 0).toFixed(0)),
        numberOfSites: numberOfSites ?? 0
      },
      restorationStrategiesRepresented: [],
      graphicTargetLandUseTypes: []
    };
  }

  const objectToArray = (obj: Record<string, number> = {}): ParsedDataItem[] => {
    return Object.entries(obj).map(([name, value]) => ({
      label: name,
      value
    }));
  };

  const formatValueText = (value: number): string => {
    if (!totalHectaresRestored) return "0 ha (0%)";

    const percentage = (value / totalHectaresRestored) * 100;

    // Special handling for very small percentages
    if (percentage < 0.1 && percentage > 0) {
      let decimals = 1;
      while (percentage.toFixed(decimals) === "0.000000".slice(0, decimals + 2)) {
        decimals++;
        if (decimals > 6) break;
      }
      return `${Number(value.toFixed(1)).toLocaleString()} ha (${percentage.toFixed(decimals)}%)`;
    }

    return `${Number(value.toFixed(1)).toLocaleString()} ha (${percentage.toFixed(1)}%)`;
  };

  const getLandUseTypeTitle = (value: string | null): string => {
    if (!value) return "No Type Identified";
    const option = landUseTypeOptions.find(opt => opt.value === value);
    return option ? option.title : value;
  };

  const noStrategyValue = hectaresUnderRestoration?.restorationStrategiesRepresented?.[""] || 0;

  const restorationStrategiesRepresented: ParsedDataItem[] = [
    {
      label: getRestorationStrategyOptions["direct-seeding"],
      value: hectaresUnderRestoration?.restorationStrategiesRepresented?.["direct-seeding"] || 0
    },
    {
      label: getRestorationStrategyOptions["assisted-natural-regeneration"],
      value: hectaresUnderRestoration?.restorationStrategiesRepresented?.["assisted-natural-regeneration"] || 0
    },
    {
      label: getRestorationStrategyOptions["tree-planting"],
      value: hectaresUnderRestoration?.restorationStrategiesRepresented?.["tree-planting"] || 0
    },
    {
      label: "Multiple Strategies",
      value: Object.keys(hectaresUnderRestoration?.restorationStrategiesRepresented || {})
        .filter(
          key => key !== "" && !["direct-seeding", "assisted-natural-regeneration", "tree-planting"].includes(key)
        )
        .reduce((sum, key) => sum + (hectaresUnderRestoration?.restorationStrategiesRepresented?.[key] || 0), 0)
    },
    {
      label: "No Strategy Identified",
      value: noStrategyValue
    }
  ].filter(item => item.value > 0);

  const graphicTargetLandUseTypes = objectToArray(hectaresUnderRestoration?.targetLandUseTypesRepresented).map(item => {
    const adjustedValue = totalHectaresRestored < item.value ? totalHectaresRestored : item.value;
    return {
      label: getLandUseTypeTitle(item.label),
      value: adjustedValue,
      valueText: formatValueText(adjustedValue)
    };
  });

  return {
    totalSection: {
      totalHectaresRestored: Number((totalHectaresRestored ?? 0).toFixed(0)),
      numberOfSites: numberOfSites ?? 0
    },
    restorationStrategiesRepresented,
    graphicTargetLandUseTypes
  };
};

export const parseDataToObjetive = (projectData?: {
  objectives?: string | null;
  landTenureProjectArea?: string[] | null;
}): Objetive => {
  const objetiveText = projectData?.objectives || "No Objective";
  const landTenure = projectData?.landTenureProjectArea
    ? projectData?.landTenureProjectArea.join(", ")
    : "Under Review";
  return {
    objetiveText,
    preferredLanguage: "English",
    landTenure
  };
};

export const getFrameworkName = (frameworks: any[], frameworkKey: string): string | undefined => {
  const framework = frameworks.find(fw => fw.framework_slug === frameworkKey);
  return framework ? framework.name : undefined;
};

export const getCohortName = (cohortKey: string): string | undefined => {
  return cohortNames[cohortKey as keyof typeof cohortNames];
};

export const getCohortNamesFromArray = (cohortKeys: string[]): string[] => {
  return cohortKeys.map(key => getCohortName(key)).filter((name): name is string => name !== undefined);
};

export const getFirstCohortFromArray = (cohort: string[] | null | undefined): string => {
  return cohort && cohort.length > 0 ? cohort[0] : "";
};

export const formatCohortDisplay = (cohort: string[] | null | undefined): string => {
  if (!cohort || cohort.length === 0) return "";
  if (cohort.length === 1) return getCohortName(cohort[0]) || cohort[0];
  return getCohortNamesFromArray(cohort).join(", ");
};

export const isEmptyChartData = (chartType: string, data: any): boolean => {
  if (!data) return false;
  switch (chartType) {
    case CHART_TYPES.multiLineChart:
      return data?.every((item: any) => Array.isArray(item.values) && item.values.length === 0);
    case CHART_TYPES.groupedBarChart:
      if (data.chartData && data.type === "gender") {
        return data?.chartData.every((item: any) => item.Women === 0 && item.Men === 0);
      }
      if (data.chartData && data.type === "age") {
        return data?.chartData.every((item: any) => item.Youth === 0 && item["Non-Youth"] === 0);
      }
      if (data.length === 0) return true;
      return false;
    case CHART_TYPES.doughnutChart:
      return data?.chartData?.every((item: any) => item.value === 0);
    case CHART_TYPES.simpleBarChart:
      if (data.length === 0) return true;
      if (data.length > 0) return data?.every((item: any) => item.value === 0);
      return false;
    default:
      return false;
  }
};

const formatLabel = (key: string): string => {
  return key
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const parsePolygonsIndicatorDataForLandUse = (
  polygonsIndicator: PolygonIndicator[],
  totalHectares: number
): ParsedPolygonsData => {
  if (!polygonsIndicator?.length) {
    return DEFAULT_POLYGONS_DATA;
  }

  const { aggregatedData } = polygonsIndicator.reduce(
    (acc, polygon) => {
      if (!polygon.data) return acc;

      Object.entries(polygon.data).forEach(([key, value]) => {
        const label = formatLabel(key);
        if (label == "") {
          return acc;
        }
        const numericValue = Number(value);
        acc.aggregatedData[label] = (acc.aggregatedData[label] ?? 0) + numericValue;
      });

      return acc;
    },
    {
      aggregatedData: {} as Record<string, number>
    }
  );

  const graphicTargetLandUseTypes = Object.entries(aggregatedData).map(([label, value]) => {
    const percentage = calculatePercentage(value as number, totalHectares);
    const adjustedValue = (value as number) > totalHectares ? totalHectares : value;
    return {
      label,
      value: adjustedValue as number,
      valueText: `${Math.round(value as number)}ha (${percentage.toFixed(0)}%)`,
      valueNotRounded: value as number
    };
  });

  return {
    graphicTargetLandUseTypes,
    totalSection: {
      totalHectaresRestored: totalHectares
    }
  };
};

export const parsePolygonsIndicatorDataForStrategies = (polygonsIndicator: PolygonIndicator[]): ParsedDataItem[] => {
  const totals = {
    "Tree Planting": 0,
    "Direct Seeding": 0,
    "Assisted Natural Regeneration": 0,
    "Multiple Strategies": 0
  };

  polygonsIndicator.forEach(polygon => {
    const strategies = polygon.data ? Object.keys(polygon.data) : [];

    if (strategies.length === 1) {
      const strategy = strategies[0];
      switch (strategy) {
        case "tree_planting":
          totals["Tree Planting"] += polygon.data?.[strategy] ?? 0;
          break;
        case "direct_seeding":
          totals["Direct Seeding"] += polygon.data?.[strategy] ?? 0;
          break;
        case "assisted_natural_regeneration":
          totals["Assisted Natural Regeneration"] += polygon.data?.[strategy] ?? 0;
          break;
      }
    } else if (strategies.length > 1) {
      const totalValue = polygon.data ? Object.values(polygon.data).reduce((sum, value) => sum + (value ?? 0), 0) : 0;
      totals["Multiple Strategies"] += totalValue;
    }
  });

  return Object.entries(totals).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2))
  }));
};

export const parsePolygonsIndicatorDataForEcoRegion = (polygons: PolygonIndicator[]): ParsedResult => {
  const result: ParsedResult = {
    chartData: [],
    total: 0
  };

  const ecoRegionMap = new Map<string, number>();

  polygons.forEach(polygon => {
    polygon.data &&
      Object.entries(polygon.data).forEach(([name, value]) => {
        ecoRegionMap.set(name, (ecoRegionMap.get(name) ?? 0) + value);
      });
  });

  result.chartData = Array.from(ecoRegionMap, ([name, value]) => ({
    name: formatLabel(name),
    value: Number(value.toFixed(3))
  }));

  result.total = Number(result.chartData.reduce((sum, item) => sum + Number(item.value), 0).toFixed(3));

  return result;
};

export function parseTreeCoverData(
  treeCoverLossData: PolygonIndicator[],
  treeCoverLossFiresData: PolygonIndicator[]
): YearlyData[] {
  const years = Array.from(
    new Set(
      treeCoverLossData
        .flatMap(entry => (entry.data ? Object.keys(entry.data) : []))
        .concat(treeCoverLossFiresData.flatMap(entry => (entry.data ? Object.keys(entry.data) : [])))
    )
  ).sort();

  return years.map(year => {
    const yearNumber = parseInt(year, 10);

    const treeCoverLossSum = treeCoverLossData.reduce((sum, entry) => {
      return sum + (entry.data?.[year] || 0);
    }, 0);

    const treeCoverLossFiresSum = treeCoverLossFiresData.reduce((sum, entry) => {
      return sum + (entry.data?.[year] || 0);
    }, 0);

    return {
      name: yearNumber,
      treeCoverLoss: treeCoverLossSum,
      treeCoverLossFires: treeCoverLossFiresSum
    };
  });
}

export const calculateTotalsFromProjects = (projects: DashboardProjectsLightDto[]) => {
  if (!projects || projects.length === 0) {
    return {
      totalTreesRestored: 0,
      totalHectaresRestored: 0,
      totalJobsCreated: 0,
      totalTreesRestoredGoal: 0,
      totalEnterpriseCount: 0,
      totalNonProfitCount: 0,
      totalSites: 0
    };
  }

  return projects.reduce(
    (acc, project) => {
      acc.totalTreesRestored += project.treesPlantedCount ?? 0;

      acc.totalHectaresRestored += project.totalHectaresRestoredSum ?? 0;

      acc.totalJobsCreated += project.totalJobsCreated ?? 0;

      acc.totalTreesRestoredGoal += project.treesGrownGoal ?? 0;

      acc.totalSites += project.totalSites ?? 0;

      if (project.organisationType === "for-profit-organization") {
        acc.totalEnterpriseCount += 1;
      } else if (project.organisationType === "non-profit-organization") {
        acc.totalNonProfitCount += 1;
      }

      return acc;
    },
    {
      totalTreesRestored: 0,
      totalHectaresRestored: 0,
      totalJobsCreated: 0,
      totalTreesRestoredGoal: 0,
      totalEnterpriseCount: 0,
      totalNonProfitCount: 0,
      totalSites: 0
    }
  );
};

export const groupProjectsByCountry = (projects: DashboardProjectsLightDto[]) => {
  if (projects == null || projects.length === 0) {
    return [];
  }

  const countryGroups = projects.reduce(
    (acc, project) => {
      const country = project.country;
      if (country == null) return acc;

      if (!acc[country]) {
        acc[country] = {
          country: country,
          numberOfProjects: 0,
          totalTreesPlanted: 0,
          totalJobsCreated: 0,
          hectaresRestored: 0
        };
      }

      acc[country].numberOfProjects += 1;
      acc[country].totalTreesPlanted += project.treesPlantedCount ?? 0;
      acc[country].totalJobsCreated += project.totalJobsCreated ?? 0;
      acc[country].hectaresRestored += project.totalHectaresRestoredSum ?? 0;

      return acc;
    },
    {} as Record<
      string,
      {
        country: string;
        numberOfProjects: number;
        totalTreesPlanted: number;
        totalJobsCreated: number;
        hectaresRestored: number;
      }
    >
  );

  return Object.values(countryGroups).sort((a, b) => a.country.localeCompare(b.country));
};
