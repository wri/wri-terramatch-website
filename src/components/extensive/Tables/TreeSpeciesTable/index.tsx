import { orderBy } from "lodash";
import { FC, useMemo } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { TableType } from "@/components/extensive/Tables/TreeSpeciesTable/columnDefinitions";
import { SupportedEntity, usePlants } from "@/connections/EntityAssocation";
import { TreeReportCountsEntity, useTreeReportCounts } from "@/connections/TreeReportCounts";

import { useTableType, useTreeTableColumns } from "./hooks";

export interface TreeSpeciesTablePDProps {
  entityUuid: string;
  entity: SupportedEntity;
  headerName?: string;
  collection?: string;
  secondColumnWidth?: string;
  data?: any;
  tableType?: TableType;
  visibleRows?: number;
  galleryType?: string;
}

export interface TreeSpeciesTableRowData {
  name: [string, string[]];
  uuid: string; // required by Table, but in this case it's not a real UUID.
  treeCount?: string | number;
  treeCountGoal?: [number, number];
}

const TreeSpeciesTable: FC<TreeSpeciesTablePDProps> = ({
  entityUuid,
  entity,
  collection,
  headerName = "species Name",
  secondColumnWidth = "",
  tableType: tableTypeFromProps,
  visibleRows = 5,
  galleryType,
  data
}) => {
  const [plantsLoaded, { associations: plants }] = usePlants({ entity, uuid: entityUuid, collection });
  const [reportCountsLoaded, { reportCounts, establishmentTrees }] = useTreeReportCounts({
    // If the entity in this component is not a valid TreeReportCountsEntity, the connection will
    // avoid issuing any API requests and will return undefined for reportCounts
    entity: entity as TreeReportCountsEntity,
    uuid: entityUuid,
    collection
  });
  const loaded = plantsLoaded && reportCountsLoaded;

  const queryParams: any = {};

  if (collection != null) {
    queryParams["filter[collection]"] = collection;
  }

  const tableType = useTableType(entity, collection, tableTypeFromProps);
  const columns = useTreeTableColumns(tableType, headerName, secondColumnWidth);

  const v3TreeSpecies = useMemo(() => {
    const reportCountEntries = Object.entries(reportCounts ?? {});
    const getReportAmount = (name?: string) =>
      reportCountEntries.find(([reportName]) => reportName?.toLowerCase() === name?.toLowerCase())?.[1].amount ?? 0;

    const entityPlants: TreeSpeciesTableRowData[] = (plants ?? []).map(({ name, taxonId, amount }) => {
      const speciesTypes = [];
      if (taxonId == null && collection !== "seeds") speciesTypes.push("non-scientific");
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
  }, [collection, entity, establishmentTrees, plants, reportCounts, tableType]);

  if (!loaded) return null;
  return (
    <div>
      <Table
        data={data ?? v3TreeSpecies}
        columns={columns}
        variant={VARIANT_TABLE_TREE_SPECIES}
        hasPagination
        invertSelectPagination
        visibleRows={visibleRows}
        galleryType={galleryType}
      />
    </div>
  );
};

export default TreeSpeciesTable;
