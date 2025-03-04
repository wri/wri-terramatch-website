import { useMemo } from "react";

import { getTreeSpeciesColumns, TableType } from "@/components/extensive/Tables/TreeSpeciesTableNew/columnDefinitions";
import { SupportedEntity } from "@/connections/EntityAssocation";
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
        return entity === "projects" ? "noGoal" : "treeCountGoal";

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
