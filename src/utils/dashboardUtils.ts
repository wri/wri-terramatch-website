import { MONTHS } from "@/constants/dashbordConsts";
import { DashboardTreeRestorationGoalResponse } from "@/generated/apiSchemas";

type DataPoint = {
  time: string;
  Total: number;
  Enterprise: number;
  "Non Profit": number;
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
