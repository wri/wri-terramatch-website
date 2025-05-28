import { useEffect, useMemo, useState } from "react";

import { loadSiteReportIndex } from "@/connections/Entity";
import { EntityIndexConnectionProps } from "@/connections/Entity";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [siteReportsData, setSiteReportsData] = useState<any[]>([]);
  const [treeSpeciesData, setTreeSpeciesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectUuid) return;

      setIsLoading(true);
      setError(null);

      try {
        const connectionProps: EntityIndexConnectionProps = {
          pageSize: 100,
          pageNumber: 1,
          sortField: "dueAt",
          sortDirection: "ASC",
          filter: {
            status: "approved",
            projectUuid: projectUuid
          },
          sideloads: [{ entity: "treeSpecies", pageSize: 100 }]
        };

        const connection = await loadSiteReportIndex(connectionProps);

        if (connection.fetchFailure != null) {
          throw new Error(`Failed to fetch site reports: ${connection.fetchFailure}`);
        }

        setSiteReportsData(connection.entities || []);

        if (connection.included && Array.isArray(connection.included)) {
          const treeSpeciesItems = connection?.included?.filter(
            item => item?.type === "treeSpecies" && item?.attributes?.collection === "tree-planted"
          );
          setTreeSpeciesData(treeSpeciesItems);
        } else {
          setTreeSpeciesData([]);
        }
      } catch (err) {
        console.error("Error fetching site reports with tree species:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectUuid]);

  const formattedTreeSpeciesData = useMemo(() => {
    if (!projectUuid || siteReportsData.length === 0) {
      return DEFAULT_TREE_SPECIES_DATA;
    }

    const reportsByUuid = new Map();
    siteReportsData.forEach(report => {
      if (report.uuid) {
        reportsByUuid.set(report.uuid, {
          dueAt: report.dueAt || report.attributes?.dueAt,
          organisationType: report.organisationType || report.attributes?.organisationType || "non-profit-organization"
        });
      }
    });

    const allDueDates = new Set<string>();
    siteReportsData.forEach(report => {
      const dueAt = report.dueAt || report.attributes?.dueAt;
      if (dueAt) {
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

    treeSpeciesData.forEach(species => {
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

    const result = {
      forProfitTreeCount: totalForProfit,
      nonProfitTreeCount: totalNonProfit,
      totalTreesGrownGoal: treesGrownGoal || 0,
      treesUnderRestorationActualTotal: treesUnderRestorationActualTotal,
      treesUnderRestorationActualForProfit: treesUnderRestorationActualForProfit,
      treesUnderRestorationActualNonProfit: treesUnderRestorationActualNonProfit
    };

    return result;
  }, [siteReportsData, treeSpeciesData, projectUuid, treesGrownGoal]);

  return {
    treeSpeciesData: formattedTreeSpeciesData,
    isLoading: isLoading && !!projectUuid,
    error
  };
};
