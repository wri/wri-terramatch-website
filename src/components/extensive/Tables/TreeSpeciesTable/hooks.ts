import { useT } from "@transifex/react";
import { orderBy, sumBy } from "lodash";
import { useMemo } from "react";

import { getTreeSpeciesColumns, TableType } from "@/components/extensive/Tables/TreeSpeciesTable/columnDefinitions";
import { PlantData } from "@/components/extensive/Tables/TreeSpeciesTable/index";
import { SupportedEntity, usePlants } from "@/connections/EntityAssocation";
import { TreeReportCountsEntity, useTreeReportCounts } from "@/connections/TreeReportCounts";
import { Framework, isTerrafund, useFrameworkContext } from "@/context/framework.provider";

export const useTableType = (entity: SupportedEntity, collection?: string, fromProps?: TableType): TableType => {
  const { framework } = useFrameworkContext();

  return useMemo(() => {
    if (fromProps != null) return fromProps;

    switch (collection) {
      case "non-tree":
        return (entity === "projects" || entity === "sites") && framework === Framework.HBF
          ? "treeCountGoal"
          : "noGoal";

      case "nursery-seedling":
        return entity === "projects" || entity === "nurseryReports" ? "noGoal" : "treeCountGoal";

      case "tree-planted":
        if (entity === "projects" && (framework === Framework.HBF || isTerrafund(framework))) {
          return "treeCountGoal";
        } else if (entity === "sites" && framework === Framework.HBF) {
          return "treeCountGoal";
        } else {
          return "noGoal";
        }

      default:
        return "noGoal";
    }
  }, [collection, entity, framework, fromProps]);
};

export const useTreeTableColumns = (tableType: TableType, headerName: string, secondColumnWidth: string) => {
  const t = useT();
  return useMemo(
    () =>
      getTreeSpeciesColumns({
        tableType,
        headerName: t(headerName ?? "Tree Species"),
        secondColumnWidth
      }),
    [tableType, t, headerName, secondColumnWidth]
  );
};

type AggregateTreeHookProps = {
  entity: SupportedEntity;
  entityUuid: string;
  collection: string;
};
export const usePlantTotalCount = ({ entity, entityUuid, collection }: AggregateTreeHookProps) => {
  // It's a little unfortunate that we're pulling both of these when only one is used, but in a component that's
  // using this hook, these are almost certainly both getting pulled anyway, and this is simpler from a code
  // readability perspective.
  const [, { associations: plants }] = usePlants({ entity, uuid: entityUuid, collection });
  const [, { reportCounts }] = useTreeReportCounts({
    // If the entity in this component is not a valid TreeReportCountsEntity, the connection will
    // avoid issuing any API requests and will return undefined for reportCounts
    entity: entity as TreeReportCountsEntity,
    uuid: entityUuid,
    collection
  });

  return useMemo(() => {
    if (entity.endsWith("Reports")) {
      return sumBy(plants, "amount");
    } else {
      return sumBy(Object.values(reportCounts ?? {}), "amount");
    }
  }, [entity, plants, reportCounts]);
};

export const usePlantSpeciesCount = ({ entity, entityUuid, collection }: AggregateTreeHookProps) => {
  const [, { associations: plants }] = usePlants({ entity, uuid: entityUuid, collection });
  const [, { reportCounts, establishmentTrees }] = useTreeReportCounts({
    entity: entity as TreeReportCountsEntity,
    uuid: entityUuid,
    collection
  });

  return useMemo(
    () => ({
      speciesCount: Object.keys(reportCounts ?? {}).length,
      speciesGoal: (entity === "projects" ? plants?.length : establishmentTrees?.length) ?? 0
    }),
    [entity, establishmentTrees?.length, plants?.length, reportCounts]
  );
};

export type TreeSpeciesTableRowData = {
  name: [string, string[]];
  uuid: string; // required by Table, but in this case it's not a real UUID.
  treeCount?: string | number;
  treeCountGoal?: [number, number];
};

type TableDataProps = {
  entity: SupportedEntity;
  entityUuid: string;
  collection?: string;
  tableType: TableType;
  plants: PlantData[];
};
export const useTableData = ({ entity, entityUuid, collection, tableType, plants }: TableDataProps) => {
  const [loaded, { reportCounts, establishmentTrees }] = useTreeReportCounts({
    // If the entity in this component is not a valid TreeReportCountsEntity, the connection will
    // avoid issuing any API requests and will return undefined for reportCounts
    entity: entity as TreeReportCountsEntity,
    uuid: entityUuid,
    collection
  });

  return useMemo(() => {
    if (!loaded) return undefined;

    const reportCountEntries = Object.entries(reportCounts ?? {});
    const getReportAmount = (name?: string) =>
      reportCountEntries.find(([reportName]) => reportName?.toLowerCase() === name?.toLowerCase())?.[1].amount ?? 0;

    const entityPlants: TreeSpeciesTableRowData[] = (plants ?? []).map(({ name, taxonId, amount }) => {
      const speciesTypes = [];
      if (taxonId == null && collection !== "seeds") speciesTypes.push("non-scientific");
      if (
        entity !== "projectReports" &&
        collection !== "seeds" &&
        establishmentTrees != null &&
        name != null &&
        !establishmentTrees.includes(name)
      ) {
        speciesTypes.push("new");
      }
      const tableRowData = { name: [name, speciesTypes] as [string, string[]], uuid: name ?? "" };
      if (tableType !== "noGoal" && tableType.endsWith("Goal")) {
        const reportAmount = getReportAmount(name);
        return {
          ...tableRowData,
          treeCount: reportAmount,
          goalCount: amount ?? 0,
          treeCountGoal: [reportAmount, amount ?? 0]
        };
      }
      if (entity.endsWith("Reports")) {
        return { ...tableRowData, treeCount: amount };
      }
      return { ...tableRowData, treeCount: getReportAmount(name) ?? 0 };
    });
    const reportPlants: TreeSpeciesTableRowData[] = reportCountEntries
      .filter(
        ([reportName]) => (plants ?? []).find(({ name }) => name?.toLowerCase() === reportName?.toLowerCase()) == null
      )
      .map(([name, { amount, taxonId }]) => {
        const speciesTypes = [];
        if (taxonId == null && collection !== "seeds") speciesTypes.push("non-scientific");
        if (entity !== "projectReports" && collection !== "seeds" && !establishmentTrees?.includes(name)) {
          speciesTypes.push("new");
        }
        const tableRowData = { name: [name, speciesTypes] as [string, string[]], uuid: name };
        if (tableType !== "noGoal" && tableType.endsWith("Goal")) {
          // treeCount included here to make sorting work; it is not displayed directly.
          return { ...tableRowData, treeCount: amount, goalCount: amount, treeCountGoal: [amount, amount] };
        }
        if (entity === "siteReports") {
          return { ...tableRowData, treeCount: 0 };
        }
        return { ...tableRowData, treeCount: amount };
      });

    return orderBy([...entityPlants, ...reportPlants], ["goalCount", "treeCount"], ["desc", "desc"]);
  }, [collection, entity, establishmentTrees, loaded, plants, reportCounts, tableType]);
};
