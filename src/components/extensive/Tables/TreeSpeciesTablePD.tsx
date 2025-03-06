import { orderBy } from "lodash";
import { FC, useMemo } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { TableType } from "@/components/extensive/Tables/TreeSpeciesTableNew/columnDefinitions";
import { SupportedEntity, useSeedings, useTreeSpecies } from "@/connections/EntityAssocation";
import { TreeReportCountsEntity, useTreeReportCounts } from "@/connections/TreeReportCounts";
import { useGetV2SeedingsENTITYUUID, useGetV2TreeSpeciesEntityUUID } from "@/generated/apiComponents";
import { SeedingDto, TreeSpeciesDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { useTableType, useTreeTableColumns } from "./TreeSpeciesTableNew/hooks";

export interface TreeSpeciesTablePDProps {
  entityUuid: string;
  entity: SupportedEntity;
  setTotalCount?: React.Dispatch<React.SetStateAction<number>>;
  setTotalSpecies?: React.Dispatch<React.SetStateAction<number>>;
  setTotalSpeciesGoal?: React.Dispatch<React.SetStateAction<number>>;
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

const TreeSpeciesTablePD: FC<TreeSpeciesTablePDProps> = ({
  entityUuid,
  entity,
  setTotalCount,
  setTotalSpecies,
  setTotalSpeciesGoal,
  collection,
  headerName = "species Name",
  secondColumnWidth = "",
  tableType: tableTypeFromProps,
  visibleRows = 5,
  galleryType,
  data
}) => {
  const [treeSpeciesLoaded, { associations: treeSpecies }] = useTreeSpecies({ entity, uuid: entityUuid, collection });
  const [seedingsLoaded, { associations: seedingsAssociations }] = useSeedings({ entity, uuid: entityUuid });
  const [reportCountsLoaded, { reportCounts, establishmentTrees }] = useTreeReportCounts({
    // If the entity in this component is not a valid TreeReportCountsEntity, the connection will
    // avoid issuing any API requests and will return undefined for reportCounts
    entity: entity as TreeReportCountsEntity,
    uuid: entityUuid,
    collection
  });
  const loaded = treeSpeciesLoaded && seedingsLoaded && reportCountsLoaded;

  const queryParams: any = {};

  if (collection != null) {
    queryParams["filter[collection]"] = collection;
  }

  const { data: apiResponse } = useGetV2TreeSpeciesEntityUUID(
    {
      queryParams,
      pathParams: {
        uuid: entityUuid,
        entity: entity?.replace("Report", "-report")
      }
    },
    {
      enabled: !!entityUuid && collection !== "seeds"
    }
  );

  const { data: seedings } = useGetV2SeedingsENTITYUUID(
    {
      pathParams: {
        uuid: entityUuid,
        entity: entity?.replace("Report", "-report")
      }
    },
    {
      enabled: !!entityUuid && collection === "seeds"
    }
  );

  const tableType = useTableType(entity, collection, tableTypeFromProps);
  const columns = useTreeTableColumns(tableType, headerName, secondColumnWidth);

  const v3TreeSpecies = useMemo(() => {
    const reportCountEntries = Object.entries(reportCounts ?? {});
    const getReportAmount = (name?: string) =>
      reportCountEntries.find(([reportName]) => reportName?.toLowerCase() === name?.toLowerCase())?.[1].amount ?? 0;

    const plants: (SeedingDto | TreeSpeciesDto)[] = (collection === "seeds" ? seedingsAssociations : treeSpecies) ?? [];
    const entityPlants: TreeSpeciesTableRowData[] = plants.map(row => {
      const speciesTypes = [];
      if (row.taxonId == null && collection !== "seeds") speciesTypes.push("non-scientific");
      const tableRowData = { name: [row.name, speciesTypes] as [string, string[]], uuid: row.name ?? "" };
      if (tableType !== "noGoal" && tableType.endsWith("Goal")) {
        const reportAmount = getReportAmount(row.name);
        return {
          ...tableRowData,
          treeCount: reportAmount,
          goalCount: row.amount ?? 0,
          treeCountGoal: [reportAmount, row.amount ?? 0]
        };
      }
      if (entity === "siteReports" || entity === "nurseryReports") {
        return { ...tableRowData, treeCount: row.amount };
      }
      return { ...tableRowData, treeCount: getReportAmount(row.name) ?? 0 };
    });
    const reportPlants: TreeSpeciesTableRowData[] = reportCountEntries
      .filter(([reportName]) => plants.find(({ name }) => name?.toLowerCase() === reportName?.toLowerCase()) == null)
      .map(([name, { amount, taxonId }]) => {
        const speciesTypes = [];
        if (taxonId == null && collection !== "seeds") speciesTypes.push("non-scientific");
        if (entity !== "projectReports" && !establishmentTrees?.includes(name)) speciesTypes.push("new");
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
  }, [collection, entity, establishmentTrees, reportCounts, seedingsAssociations, tableType, treeSpecies]);

  const processTreeSpeciesTableData = (rows: any[]): TreeSpeciesTableRowData[] => {
    if (!rows) return [];
    const total = rows.reduce(
      (sum, row) => sum + ((entity === "siteReports" ? row.amount : row.report_amount) ?? 0),
      0
    );
    if (setTotalCount) {
      setTotalCount(total);
    }
    if (setTotalSpecies) {
      const plantedSpeciesCount = (apiResponse?.count_new_species ?? 0) + (apiResponse?.count_reported_species ?? 0);
      setTotalSpecies(plantedSpeciesCount);
    }
    if (setTotalSpeciesGoal) {
      setTotalSpeciesGoal(apiResponse?.count_stablished_species ?? 0);
    }
    return rows.map(row => {
      let speciesTypes = [];
      if (!row.taxon_id) speciesTypes.push("non-scientific");
      if (row.is_new_species) speciesTypes.push("new");
      const tableRowData = {
        name: [row.name, speciesTypes] as [string, string[]],
        uuid: row.name as string // name is unique, but not all rows have a UUID
      };
      if (tableType !== "noGoal" && tableType.endsWith("Goal")) {
        return { ...tableRowData, treeCountGoal: [row.report_amount, row.amount] };
      }
      if (entity === "siteReports") {
        return { ...tableRowData, treeCount: row.amount };
      }
      return { ...tableRowData, treeCount: row.report_amount ?? "0" };
    });
  };

  const processSeedingTableData = (rows: any[]): TreeSpeciesTableRowData[] => {
    if (!rows) return [];
    if (setTotalCount) {
      const total = rows.reduce((sum, row) => sum + row.amount, 0);
      setTotalCount(total);
    }
    if (setTotalSpecies) {
      setTotalSpecies(rows.length);
    }
    return rows.map(row => {
      let speciesTypes = ["tree"];
      return {
        name: [row.name, speciesTypes],
        treeCount: row.amount,
        uuid: row.name
      };
    });
  };

  const tableData =
    collection === "seeds"
      ? seedings?.data
        ? processSeedingTableData(seedings.data)
        : []
      : apiResponse?.data
      ? processTreeSpeciesTableData(apiResponse.data)
      : [];

  if (!loaded) return null;
  return (
    <div>
      <Table
        data={data ?? tableData}
        columns={columns}
        variant={VARIANT_TABLE_TREE_SPECIES}
        hasPagination
        invertSelectPagination
        visibleRows={visibleRows}
        galleryType={galleryType}
      />
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

export default TreeSpeciesTablePD;
