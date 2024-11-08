import { CHART_TYPES, MONTHS } from "@/constants/dashboardConsts";
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

type File = {
  collection_name: string;
  created_at: string;
  description: string | null;
  file_name: string;
  is_cover: boolean;
  is_public: boolean;
  lat: number;
  lng: number;
  mime_type: string;
  photographer: string | null;
  size: number;
  thumb_url: string;
  title: string;
  url: string;
  uuid: string;
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

interface ChartCategory {
  name: string;
  values: ChartDataPoint[];
}

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
  if (name.includes("direct seeding")) return "#27A9E0";
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
    return `${value.toFixed(0)} ha ${percentage.toFixed(2)}%`;
  };

  const getLandUseTypeTitle = (value: string): string => {
    const option = landUseTypeOptions.find(opt => opt.value === value);
    return option ? option.title : value;
  };
  const restorationStrategiesRepresented = objectToArray(
    hectaresUnderRestoration?.restoration_strategies_represented
  ).map(item => ({
    label: getRestorationStrategyOptions[item.label as keyof typeof getRestorationStrategyOptions] ?? item.label,
    value: item.value
  }));

  const graphicTargetLandUseTypes = objectToArray(hectaresUnderRestoration?.target_land_use_types_represented).map(
    item => ({
      label: getLandUseTypeTitle(item.label),
      value: item.value,
      valueText: formatValueText(item.value)
    })
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
      return data?.length === 0;
    default:
      return false;
  }
};

export const getCoverFileUrl = (files: File[]): string | null => {
  if (!files) return "/images/_AJL2963.jpg";
  const coverFile = files.find(file => file.is_cover === true);
  return coverFile ? coverFile.url : null;
};
