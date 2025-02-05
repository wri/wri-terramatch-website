import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { useGetV2DisturbancesENTITYUUID } from "@/generated/apiComponents";

export interface DisturbancesTableProps {
  modelName: string;
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
  const queryParams: any = {};

  if (collection) {
    queryParams["filter[collection]"] = collection;
  }

  const { data: disturbances } = useGetV2DisturbancesENTITYUUID(
    {
      queryParams,
      pathParams: { entity: modelName, uuid: modelUUID }
    },
    {
      enabled: !!modelUUID
    }
  );

  const processDisturbanceData = (rows: any[]) => {
    if (!rows) return [];
    return rows.map(row => ({
      name: row.type,
      extent: row.extent ?? "N/A",
      intensity: row.intensity ?? "N/A",
      description: row.description ?? "N/A",
      uuid: row.uuid
    }));
  };

  const tableData = disturbances?.data ? processDisturbanceData(disturbances.data) : [];

  const rowDisturbanceType = {
    accessorKey: "name",
    header: headerName,
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      return <div className="font-inherit flex items-center gap-1">{value}</div>;
    }
  };

  const columnExtent = {
    accessorKey: "extent",
    header: "Extent",
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      return <div className="text-14 !font-bold">{value}</div>;
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

  const columnDescription = {
    accessorKey: "description",
    header: "Description",
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      return <div className="text-14">{value}</div>;
    }
  };

  return (
    <div>
      <Table
        data={tableData}
        columns={[rowDisturbanceType, columnExtent, columnIntensity, columnDescription]}
        variant={VARIANT_TABLE_TREE_SPECIES}
        hasPagination
        invertSelectPagination
        visibleRows={visibleRows}
      />
    </div>
  );
};

export default DisturbancesTablePD;
