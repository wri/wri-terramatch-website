import Table from "../Table/Table";
import { VARIANT_TABLE_VERSION } from "../Table/TableVariants";

const VersionInformation = () => {
  const headers = [
    {
      accessorKey: "version",
      header: "Version",
      enableSorting: false
    },
    {
      accessorKey: "Date",
      header: "Date",
      enableSorting: false
    },
    {
      accessorKey: "Current",
      header: "Current",
      enableSorting: false,
      cell: (props: any) => {
        return (
          <div className="flex items-center justify-center">
            <button className="rounded-full bg-primary-500 px-2 py-1 text-white">{props.getValue()}</button>
          </div>
        );
      }
    }
  ];
  const data = [
    {
      version: "ID Wenguru v4",
      Date: "Feb 12, 24",
      Current: "No"
    },
    {
      version: "ID Wenguru v3",
      Date: "Feb 11, 24",
      Current: "No"
    },
    {
      version: "ID Wenguru v2",
      Date: "Feb 10, 24",
      Current: "No"
    },
    {
      version: "ID Wenguru v1",
      Date: "Feb 8, 24",
      Current: "No"
    },
    {
      version: "ID Wenguru v1",
      Date: "Feb 6, 24",
      Current: "No"
    }
  ];
  return (
    <div className="">
      <Table columns={headers} data={data} variant={VARIANT_TABLE_VERSION} />
    </div>
  );
};

export default VersionInformation;
