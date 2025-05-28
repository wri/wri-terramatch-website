import { isEmpty } from "lodash";
import { useMemo } from "react";

import { useSiteReportIndex } from "@/connections/Entity";
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
  treesGrownGoal: number | null | undefined
) => {
  const [connectionLoaded, { fetchFailure, entities, included }] = useSiteReportIndex({
    pageNumber: 1,
    sortField: "dueAt",
    sortDirection: "ASC",
    filter: { status: "approved", projectUuid },
    sideloads: [{ entity: "treeSpecies", pageSize: 100 }],
    enabled: !isEmpty(projectUuid)
  });

  useValueChanged(fetchFailure, () => {
    if (fetchFailure != null) {
      Log.error("Error fetching site reports with tree species:", fetchFailure);
    }
  });

  const treeSpeciesData = useMemo(() => {
    if (entities == null || entities.length === 0) {
      return DEFAULT_TREE_SPECIES_DATA;
    }

    const reportsByUuid = new Map();
    entities.forEach(({ uuid, dueAt }) => {
      reportsByUuid.set(uuid, {
        dueAt: dueAt,
        // TODO: Now that this is correctly typed, we can see that organisationType is not on this DTO yet.
        organisationType: "non-profit-organization"
      });
    });

    const allDueDates = new Set<string>();
    entities.forEach(({ dueAt }) => {
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

    included
      ?.filter(({ type, attributes: { collection } }) => type === "treeSpecies" && collection === "tree-planted")
      .forEach(species => {
        const speciesAmount = Number(species.attributes?.amount || 0);
        if (speciesAmount <= 0) return;

        const entityUuid = species.attributes?.entityUuid;
        if (!entityUuid) {
          return;
        }

        const reportData = reportsByUuid.get(entityUuid);
        if (!reportData || !reportData.dueAt) {
          return;
        }

        const dueDate = new Date(reportData.dueAt);
        const periodKey = dueDate.toISOString().split("T")[0];

        const periodData = treesByPeriod.get(periodKey)!;
        periodData.total += speciesAmount;

        if (reportData.organisationType === "for-profit-organization") {
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
  }, [entities, included, treesGrownGoal]);

  return {
    treeSpeciesData,
    isLoading: !connectionLoaded,
    error: fetchFailure == null ? undefined : new Error(`Failed to fetch site reports: ${fetchFailure.message}`)
  };
};
