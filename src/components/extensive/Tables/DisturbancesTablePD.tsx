import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { useDisturbances } from "@/connections/EntityAssociation";

export type DisturbanceEntity = "projectReports" | "siteReports" | "sites" | "projects";
export interface DisturbancesTableProps {
  modelName: DisturbanceEntity;
  modelUUID: string;
  collection?: string;
  visibleRows?: number;
  headerName?: string;
}

const DisturbancesTablePD = ({
  modelName,
  modelUUID,
  collection,
  visibleRows = 5,
  headerName = "Disturbance Type"
}: DisturbancesTableProps) => {
  const [, { associations: disturbances }] = useDisturbances({ entity: modelName, uuid: modelUUID });

  const processDisturbanceData = (rows: any[]) => {
    if (!rows) return [];
    return rows.map(row => ({
      name: row.type ? row.type.charAt(0).toUpperCase() + row.type.slice(1) : "N/A",
      intensity: row.intensity ? row.intensity.charAt(0).toUpperCase() + row.intensity.slice(1) : "N/A",
      extent: row.extent ? `${row.extent}%` : "N/A",
      description: row.description ?? "N/A",
      uuid: row.uuid
    }));
  };

  const tableData = processDisturbanceData(disturbances ?? []);

  const rowDisturbanceType = {
    accessorKey: "name",
    header: headerName,
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      return <div className="font-inherit flex items-center gap-1">{value}</div>;
    }
  };

  const columnIntensity = {
    accessorKey: "intensity",
    header: "Intensity",
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      return <div className="text-14 !font-bold">{value}</div>;
    }
  };

  const columnExtent = {
    accessorKey: "extent",
    header: "Extent (% of Site Affected)",
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      return <div className="text-14 !font-bold">{value}</div>;
    }
  };

  const columnDescription = {
    accessorKey: "description",
    header: "Description",
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      return <div className="text-14">{value}</div>;
    }
  };

  const getColumns = () => {
    const finalColumns = [rowDisturbanceType];
    if (disturbances?.[0]?.intensity) {
      finalColumns.push(columnIntensity);
    }
    if (disturbances?.[0]?.extent) {
      finalColumns.push(columnExtent);
    }
    finalColumns.push(columnDescription);
    return finalColumns;
  };
  return (
    <div>
      <Table
        data={tableData}
        columns={getColumns()}
        variant={VARIANT_TABLE_TREE_SPECIES}
        hasPagination
        invertSelectPagination
        visibleRows={visibleRows}
      />
    </div>
  );
};

export default DisturbancesTablePD;
