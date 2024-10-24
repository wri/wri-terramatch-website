import { MONTHS } from "@/constants/dashboardConsts";
import { DashboardTreeRestorationGoalResponse } from "@/generated/apiSchemas";

type DataPoint = {
  time: string;
  Total: number;
  Enterprise: number;
  "Non Profit": number;
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
export const getRestorationGoalDataForChart = (data: any, isPercentage: boolean) => {
  let chartData = [];
  let totalSum = 0;
  let enterpriseSum = 0;
  let nonProfitSum = 0;

  const totalData = {
    name: "Total",
    values: isPercentage
      ? data?.treesUnderRestorationActualTotal.map(
          (item: { treeSpeciesPercentage: number; dueDate: string | number | Date }) => {
            totalSum += item.treeSpeciesPercentage;
            return { time: new Date(item.dueDate), value: totalSum, name: "Total" };
          }
        )
      : data?.treesUnderRestorationActualTotal.map(
          (item: { treeSpeciesAmount: number; dueDate: string | number | Date }) => {
            totalSum += item.treeSpeciesAmount;
            return { time: new Date(item.dueDate), value: totalSum, name: "Total" };
          }
        )
  };

  chartData.push(totalData);

  const enterpriseData = {
    name: "Enterprise",
    values: isPercentage
      ? data?.treesUnderRestorationActualForProfit.map(
          (item: { treeSpeciesPercentage: number; dueDate: string | number | Date }) => {
            enterpriseSum += item.treeSpeciesPercentage;
            return { time: new Date(item.dueDate), value: enterpriseSum, name: "Enterprise" };
          }
        )
      : data?.treesUnderRestorationActualForProfit.map(
          (item: { treeSpeciesAmount: number; dueDate: string | number | Date }) => {
            enterpriseSum += item.treeSpeciesAmount;
            return { time: new Date(item.dueDate), value: enterpriseSum, name: "Enterprise" };
          }
        )
  };

  chartData.push(enterpriseData);

  const nonProfitData = {
    name: "Non Profit",
    values: isPercentage
      ? data?.treesUnderRestorationActualNonProfit.map(
          (item: { treeSpeciesPercentage: number; dueDate: string | number | Date }) => {
            nonProfitSum += item.treeSpeciesPercentage;
            return { time: new Date(item.dueDate), value: nonProfitSum, name: "Non Profit" };
          }
        )
      : data?.treesUnderRestorationActualNonProfit.map(
          (item: { treeSpeciesAmount: number; dueDate: string | number | Date }) => {
            nonProfitSum += item.treeSpeciesAmount;
            return { time: new Date(item.dueDate), value: nonProfitSum, name: "Non Profit" };
          }
        )
  };

  chartData.push(nonProfitData);

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
  console.log(hectaresUnderRestoration);
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
