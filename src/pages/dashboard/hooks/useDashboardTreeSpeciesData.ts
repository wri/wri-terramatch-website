import { flatten, isEmpty } from "lodash";
import { useMemo } from "react";

import { useSiteReportIndex } from "@/connections/Entity";
import { selectTreeSpecies } from "@/connections/EntityAssociation";
import { TreeSpeciesDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

type TreeSpeciesDataByPeriod = {
  dueDate: string;
  treeSpeciesAmount: number;
  treeSpeciesPercentage: number;
};

type TreeSpeciesResponse = {
  forProfitTreeCount: number;
  nonProfitTreeCount: number;
  totalTreesGrownGoal: number;
  treesUnderRestorationActualTotal: TreeSpeciesDataByPeriod[];
  treesUnderRestorationActualForProfit: TreeSpeciesDataByPeriod[];
  treesUnderRestorationActualNonProfit: TreeSpeciesDataByPeriod[];
};

const DEFAULT_TREE_SPECIES_DATA: TreeSpeciesResponse = {
  forProfitTreeCount: 0,
  nonProfitTreeCount: 0,
  totalTreesGrownGoal: 0,
  treesUnderRestorationActualTotal: [],
  treesUnderRestorationActualForProfit: [],
  treesUnderRestorationActualNonProfit: []
};

export const useDashboardTreeSpeciesData = (
  projectUuid: string | undefined,
  treesGrownGoal: number | null | undefined,
  organisationType: string | null | undefined
) => {
  const [connectionLoaded, { loadFailure, data }] = useSiteReportIndex({
    pageNumber: 1,
    sortField: "dueAt",
    sortDirection: "ASC",
    filter: { status: "approved", projectUuid },
    sideloads: [{ entity: "treeSpecies", pageSize: 100 }],
    enabled: !isEmpty(projectUuid)
  });

  useValueChanged(loadFailure, () => {
    if (loadFailure != null) {
      Log.error("Error fetching site reports with tree species:", loadFailure);
    }
  });

  const treeSpeciesData = useMemo(() => {
    if (data == null || data.length === 0) {
      return DEFAULT_TREE_SPECIES_DATA;
    }

    const reportsByUuid = new Map();
    data.forEach(({ uuid, dueAt }) => {
      reportsByUuid.set(uuid, {
        dueAt: dueAt
      });
    });

    const allDueDates = new Set<string>();
    data.forEach(({ dueAt }) => {
      if (dueAt != null) {
        const dueDate = new Date(dueAt);
        const periodKey = dueDate.toISOString().split("T")[0];
        allDueDates.add(periodKey);
      }
    });

    const treesByPeriod = new Map<
      string,
      {
        total: number;
        forProfit: number;
        nonProfit: number;
      }
    >();

    allDueDates.forEach(date => {
      treesByPeriod.set(date, { total: 0, forProfit: 0, nonProfit: 0 });
    });

    const treeSpecies = flatten(
      data
        .map(({ uuid }) => selectTreeSpecies({ entity: "siteReports", uuid }).associations)
        .filter(trees => trees != null)
    ) as TreeSpeciesDto[];

    treeSpecies
      .filter(({ collection }) => collection === "tree-planted")
      .forEach(({ amount, entityUuid }) => {
        const speciesAmount = Number(amount ?? 0);
        if (speciesAmount <= 0 || entityUuid == null) return;

        const reportData = reportsByUuid.get(entityUuid);
        if (!reportData || !reportData.dueAt) {
          return;
        }

        const dueDate = new Date(reportData.dueAt);
        const periodKey = dueDate.toISOString().split("T")[0];

        const periodData = treesByPeriod.get(periodKey)!;
        periodData.total += speciesAmount;

        if (organisationType === "for-profit-organization") {
          periodData.forProfit += speciesAmount;
        } else {
          periodData.nonProfit += speciesAmount;
        }
      });

    const sortedPeriods = Array.from(treesByPeriod.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    let totalForProfit = 0;
    let totalNonProfit = 0;

    sortedPeriods.forEach(([, data]) => {
      totalForProfit += data.forProfit;
      totalNonProfit += data.nonProfit;
    });

    const treesUnderRestorationActualTotal: TreeSpeciesDataByPeriod[] = [];
    const treesUnderRestorationActualForProfit: TreeSpeciesDataByPeriod[] = [];
    const treesUnderRestorationActualNonProfit: TreeSpeciesDataByPeriod[] = [];

    sortedPeriods.forEach(([dueDate, data]) => {
      const totalPercentage = treesGrownGoal && treesGrownGoal > 0 ? (data.total / treesGrownGoal) * 100 : 0;
      const forProfitPercentage = treesGrownGoal && treesGrownGoal > 0 ? (data.forProfit / treesGrownGoal) * 100 : 0;
      const nonProfitPercentage = treesGrownGoal && treesGrownGoal > 0 ? (data.nonProfit / treesGrownGoal) * 100 : 0;

      treesUnderRestorationActualTotal.push({
        dueDate: `${dueDate}T00:00:00.000000Z`,
        treeSpeciesAmount: data.total,
        treeSpeciesPercentage: parseFloat(totalPercentage.toFixed(3))
      });

      treesUnderRestorationActualForProfit.push({
        dueDate: `${dueDate}T00:00:00.000000Z`,
        treeSpeciesAmount: data.forProfit,
        treeSpeciesPercentage: parseFloat(forProfitPercentage.toFixed(3))
      });

      treesUnderRestorationActualNonProfit.push({
        dueDate: `${dueDate}T00:00:00.000000Z`,
        treeSpeciesAmount: data.nonProfit,
        treeSpeciesPercentage: parseFloat(nonProfitPercentage.toFixed(3))
      });
    });

    return {
      forProfitTreeCount: totalForProfit,
      nonProfitTreeCount: totalNonProfit,
      totalTreesGrownGoal: treesGrownGoal || 0,
      treesUnderRestorationActualTotal: treesUnderRestorationActualTotal,
      treesUnderRestorationActualForProfit: treesUnderRestorationActualForProfit,
      treesUnderRestorationActualNonProfit: treesUnderRestorationActualNonProfit
    };
  }, [data, treesGrownGoal, organisationType]);

  return {
    treeSpeciesData,
    isLoading: !connectionLoaded,
    error: loadFailure == null ? undefined : new Error(`Failed to fetch site reports: ${loadFailure.message}`)
  };
};
