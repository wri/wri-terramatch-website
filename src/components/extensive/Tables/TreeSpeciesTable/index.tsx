import { FC } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { TableType } from "@/components/extensive/Tables/TreeSpeciesTable/columnDefinitions";
import { SupportedEntity, usePlants } from "@/connections/EntityAssocation";
import Log from "@/utils/log";

import { TreeSpeciesTableRowData, useTableData, useTableType, useTreeTableColumns } from "./hooks";

export type PlantData = {
  name?: string;
  amount?: number;
  taxonId?: string;
};

type TreeSpeciesTableViewProps = {
  data: TreeSpeciesTableRowData[];
  tableType: TableType;
  headerName?: string;
  visibleRows?: number;
  galleryType?: string;
  secondColumnWidth?: string;
};

type GoalsDataFetcherProps = {
  plants: PlantData[];
  children: (tableType: TableType, data: TreeSpeciesTableRowData[]) => JSX.Element;
  entity: SupportedEntity;
  entityUuid: string;
  collection?: string;
  tableType?: TableType;
};

type TreeSpeciesDataFetcherProps = {
  children: (tableType: TableType, data: TreeSpeciesTableRowData[]) => JSX.Element;
  entity: SupportedEntity;
  entityUuid: string;
  collection?: string;
  tableType?: TableType;
};

type TreeSpeciesTableProps = Omit<TreeSpeciesTableViewProps, "data" | "tableType"> &
  Omit<TreeSpeciesDataFetcherProps, "entityUuid" | "entity" | "children"> & {
    entity?: SupportedEntity;
    entityUuid?: string;
    data?: TreeSpeciesTableRowData[];
    plants?: PlantData[];
  };

const GoalsDataFetcher: FC<GoalsDataFetcherProps> = ({
  plants,
  entity,
  entityUuid,
  collection,
  tableType: tableTypeFromProps,
  children: render
}) => {
  const tableType = useTableType(entity, collection, tableTypeFromProps);
  const plantRows = useTableData({ entity, entityUuid, collection, tableType, plants });

  return plantRows != null ? render(tableType, plantRows) : null;
};

const TreeSpeciesDataFetcher: FC<TreeSpeciesDataFetcherProps> = ({
  children: render,
  entity,
  entityUuid,
  collection,
  tableType
}) => {
  const [, { associations: plants }] = usePlants({ entity, uuid: entityUuid, collection });
  return plants == null ? null : (
    <GoalsDataFetcher {...{ plants, entity, entityUuid, collection, tableType }}>{render}</GoalsDataFetcher>
  );
};

const TreeSpeciesTableView: FC<TreeSpeciesTableViewProps> = ({
  data,
  tableType,
  headerName = "Species Name",
  visibleRows = 5,
  galleryType,
  secondColumnWidth = ""
}) => (
  <div>
    <Table
      data={data}
      columns={useTreeTableColumns(tableType, headerName, secondColumnWidth)}
      variant={VARIANT_TABLE_TREE_SPECIES}
      hasPagination
      invertSelectPagination
      visibleRows={visibleRows}
      galleryType={galleryType}
    />
  </div>
);

const TreeSpeciesTable: FC<TreeSpeciesTableProps> = props => {
  const {
    entityUuid,
    entity,
    collection,
    headerName,
    secondColumnWidth,
    tableType,
    visibleRows,
    galleryType,
    data,
    plants
  } = props;

  // If we receive no explicit data, but we have an entity and entityUUID, render the full data fetcher
  // composition
  if (data == null && plants == null && entity != null && entityUuid != null) {
    return (
      <TreeSpeciesDataFetcher {...{ entity, entityUuid, collection, tableType }}>
        {(tableType, data) => (
          <TreeSpeciesTableView {...{ data, tableType, headerName, visibleRows, galleryType, secondColumnWidth }} />
        )}
      </TreeSpeciesDataFetcher>
    );
  }

  // If we receive plants but not converted table data, render the goals data fetcher composition
  if (plants != null && data == null && entity != null && entityUuid != null) {
    return (
      <GoalsDataFetcher {...{ plants, entity, entityUuid, collection, tableType }}>
        {(tableType, data) => (
          <TreeSpeciesTableView {...{ data, tableType, headerName, visibleRows, galleryType, secondColumnWidth }} />
        )}
      </GoalsDataFetcher>
    );
  }

  // If we have converted table data and a table type, we only need the view.
  if (data != null && tableType != null) {
    return <TreeSpeciesTableView {...{ data, tableType, headerName, visibleRows, galleryType, secondColumnWidth }} />;
  }

  Log.error("Invalid TreeSpeciesTableProps", { props });
  return null;
};

export default TreeSpeciesTable;
