import { CHART_TYPES, DEFAULT_POLYGONS_DATA, MONTHS } from "@/constants/dashboardConsts";
import { GetV2EntityUUIDAggregateReportsResponse } from "@/generated/apiComponents";
import { DashboardTreeRestorationGoalResponse } from "@/generated/apiSchemas";

type DataPoint = {
  time: string;
  Total: number;
  Enterprise: number;
  "Non Profit": number;
};

type InputData = {
  country: string;
  countrySlug: string;
  descriptionObjetive: string;
  landTenure: string | null;
  name: string;
  organisation: string;
  restorationStrategy: string | null;
  survivalRate: string | null;
  targetLandUse: string | null;
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

interface Option {
  title: string;
  value: string;
}

interface TotalSectionHeader {
  country_name: string;
  total_enterprise_count: number;
  total_entries: number;
  total_hectares_restored: number;
  total_hectares_restored_goal: number;
  total_non_profit_count: number;
  total_trees_restored: number;
  total_trees_restored_goal: number;
}

interface DashboardVolunteersSurvivalRate {
  enterprise_survival_rate: number;
  men_volunteers: number;
  non_profit_survival_rate: number;
  non_youth_volunteers: number;
  number_of_nurseries: number;
  number_of_sites: number;
  total_volunteers: number;
  women_volunteers: number;
  youth_volunteers: number;
}

interface HectaresUnderRestoration {
  restoration_strategies_represented: Record<string, number>;
  target_land_use_types_represented: Record<string, number>;
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
  console.log("filters ", filters, JSON.stringify(filters));
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => queryParams.append(`filter[${key}][]`, v));
    } else if (value) {
      queryParams.append(`filter[${key}]`, value as string);
    }
  });
  return queryParams.toString();
};

export const getRestorationGoalResumeData = (data: DashboardTreeRestorationGoalResponse) => {
  return [
    { name: "Total", value: data?.totalTreesGrownGoal, color: "#13487A" },
    { name: "Enterprise", value: data?.forProfitTreeCount, color: "#7BBD31" },
    { name: "Non Profit", value: data?.nonProfitTreeCount, color: "#B9EDFF" }
  ];
};

export const getRestorationGoalDataForChart = (
  data: RestorationData,
  isPercentage: boolean,
  isProjectView: boolean
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
    const shouldAdd = !isProjectView || (isProjectView && sum > 0);
    if (shouldAdd) {
      chartData.push({ name: categoryName, values });
    }
  };

  const chartData: ChartCategory[] = [];

  if (!isProjectView) {
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
    const key1 = data.type === "gender" ? "Women" : "Youth";
    const key2 = data.type === "gender" ? "Men" : "Non-Youth";
    acc[key1] = (acc[key1] || 0) + (item[key1] as number);
    acc[key2] = (acc[key2] || 0) + (item[key2] as number);
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

export const COLORS_VOLUNTEERS = ["#7BBD31", "#27A9E0"];

export const getBarColorRestoration = (name: string) => {
  if (name.includes("Tree Planting")) return "#7BBD31";
  if (name.includes("Direct Seeding")) return "#27A9E0";
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
  totalSectionHeader: TotalSectionHeader,
  dashboardVolunteersSurvivalRate: DashboardVolunteersSurvivalRate,
  hectaresUnderRestoration: HectaresUnderRestoration
): HectaresUnderRestorationData => {
  if (!totalSectionHeader || !dashboardVolunteersSurvivalRate || !hectaresUnderRestoration) {
    return {
      totalSection: {
        totalHectaresRestored: 0,
        numberOfSites: 0
      },
      restorationStrategiesRepresented: [],
      graphicTargetLandUseTypes: []
    };
  }
  const { total_hectares_restored } = totalSectionHeader;
  const { number_of_sites } = dashboardVolunteersSurvivalRate;

  const objectToArray = (obj: Record<string, number> = {}): ParsedDataItem[] => {
    return Object.entries(obj).map(([name, value]) => ({
      label: name,
      value
    }));
  };

  const formatValueText = (value: number): string => {
    if (!total_hectares_restored) return "0 ha 0%";

    const percentage = (value / total_hectares_restored) * 100;

    // Special handling for very small percentages
    if (percentage < 0.1 && percentage > 0) {
      let decimals = 1;
      while (percentage.toFixed(decimals) === "0.000000".slice(0, decimals + 2)) {
        decimals++;
        if (decimals > 6) break;
      }
      return `${Math.round(value).toLocaleString()} ha ${percentage.toFixed(decimals)}%`;
    }

    return `${Math.round(value).toLocaleString()} ha ${percentage.toFixed(1)}%`;
  };

  const getLandUseTypeTitle = (value: string): string => {
    const option = landUseTypeOptions.find(opt => opt.value === value);
    return option ? option.title : value;
  };

  const restorationStrategiesRepresented: ParsedDataItem[] = [
    {
      label: getRestorationStrategyOptions["direct-seeding"],
      value: hectaresUnderRestoration?.restoration_strategies_represented?.["direct-seeding"] || 0
    },
    {
      label: getRestorationStrategyOptions["assisted-natural-regeneration"],
      value: hectaresUnderRestoration?.restoration_strategies_represented?.["assisted-natural-regeneration"] || 0
    },
    {
      label: getRestorationStrategyOptions["tree-planting"],
      value: hectaresUnderRestoration?.restoration_strategies_represented?.["tree-planting"] || 0
    },
    {
      label: "Multiple Strategies",
      value: Object.keys(hectaresUnderRestoration?.restoration_strategies_represented || {})
        .filter(key => !["direct-seeding", "assisted-natural-regeneration", "tree-planting"].includes(key))
        .reduce((sum, key) => sum + (hectaresUnderRestoration?.restoration_strategies_represented?.[key] || 0), 0)
    }
  ].filter(item => item.value > 0);

  const graphicTargetLandUseTypes = objectToArray(hectaresUnderRestoration?.target_land_use_types_represented).map(
    item => {
      const adjustedValue = total_hectares_restored < item.value ? total_hectares_restored : item.value;
      return {
        label: getLandUseTypeTitle(item.label),
        value: adjustedValue,
        valueText: formatValueText(adjustedValue)
      };
    }
  );

  return {
    totalSection: {
      totalHectaresRestored: total_hectares_restored ?? 0,
      numberOfSites: number_of_sites ?? 0
    },
    restorationStrategiesRepresented,
    graphicTargetLandUseTypes
  };
};

export const parseDataToObjetive = (data: InputData): Objetive => {
  const objetiveText = data?.descriptionObjetive;

  return {
    objetiveText,
    preferredLanguage: "English",
    landTenure: data?.landTenure ? data?.landTenure : "Under Review"
  };
};

export const getFrameworkName = (frameworks: any[], frameworkKey: string): string | undefined => {
  const framework = frameworks.find(fw => fw.framework_slug === frameworkKey);
  return framework ? framework.name : undefined;
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
        acc.aggregatedData[label] = (acc.aggregatedData[label] || 0) + numericValue;
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
          totals["Tree Planting"] += polygon.data?.[strategy] || 0;
          break;
        case "direct_seeding":
          totals["Direct Seeding"] += polygon.data?.[strategy] || 0;
          break;
        case "assisted_natural_regeneration":
          totals["Assisted Natural Regeneration"] += polygon.data?.[strategy] || 0;
          break;
      }
    } else if (strategies.length > 1) {
      const totalValue = polygon.data ? Object.values(polygon.data).reduce((sum, value) => sum + (value || 0), 0) : 0;
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
        ecoRegionMap.set(name, (ecoRegionMap.get(name) || 0) + value);
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
