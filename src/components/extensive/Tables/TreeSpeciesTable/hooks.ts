import { sumBy } from "lodash";
import { useMemo } from "react";

import { getTreeSpeciesColumns, TableType } from "@/components/extensive/Tables/TreeSpeciesTable/columnDefinitions";
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

export const useTreeTableColumns = (tableType: TableType, headerName: string, secondColumnWidth: string) =>
  useMemo(
    () => getTreeSpeciesColumns({ tableType, headerName, secondColumnWidth }),
    [tableType, headerName, secondColumnWidth]
  );

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
