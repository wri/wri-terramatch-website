import classNames from "classnames";

import LinearProgressBar from "@/components/elements/ProgressBar/LinearProgressBar/LinearProgressBar";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import { useGetV2TreeSpeciesEntityUUID } from "@/generated/apiComponents";

import Icon, { IconNames } from "../Icon/Icon";

export type ModelNameType =
  | "treeCount"
  | "nonTreeCount"
  | "seedCount"
  | "treeCountSite"
  | "treeCount/Goal"
  | "speciesCount/Goal"
  | "saplingsCount"
  | "seedCount/Goal"
  | "saplingsCount"
  | "noGoal";

export interface TreeSpeciesTablePDProps {
  modelUUID: string;
  modelName: string;
  headerName?: string;
  collection?: string;
  secondColumnWidth?: string;
}
// modelName = entity
// modelUUID = entity uuid
// collection (optional) for tree species only
const TreeSpeciesTablePD = ({
  modelUUID,
  modelName,
  collection,
  headerName = "species Name",
  secondColumnWidth = ""
}: TreeSpeciesTablePDProps) => {
  const queryParams: any = {};

  if (collection != null) {
    queryParams["filter[collection]"] = collection;
  }
  queryParams["page"] = 1;
  queryParams["per_page"] = 10;

  const { data: apiResponse } = useGetV2TreeSpeciesEntityUUID(
    {
      queryParams,
      pathParams: {
        uuid: modelUUID,
        entity: modelName?.replace("Report", "-report")
      }
    },
    {
      enabled: !!modelUUID
    }
  );

  console.log("rows modelUUID", modelUUID);
  console.log("rows modelName", modelName);
  console.log("rows collection", collection);
  console.log("rows", apiResponse);

  const processTableData = (rows: any[]) => {
    if (!rows) return [];

    return rows.map(row => {
      // Determine species type
      let speciesType = "tree";
      if (!row.taxon_id) {
        speciesType = "non-scientific";
      }
      // Note: Add logic here to determine if species is "new" based on project establishment
      // This would require additional context/data from the API

      return {
        name: [row.name, speciesType],
        treeCount: row.amount || "0",
        uuid: row.uuid
      };
    });
  };

  const tableData = apiResponse?.data ? processTableData(apiResponse.data) : [];

  console.log("rows tableData", tableData);

  const rowSpeciesName = {
    accessorKey: "name",
    header: headerName,
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      if (value[1] === "non-scientific") {
        return (
          <div className="font-inherit flex items-center gap-1">
            {value[0]}
            <ToolTip
              title=""
              content="Non-scientific name"
              colorBackground="white"
              placement="right"
              textVariantContent="text-14"
            >
              <Icon
                name={IconNames.NON_SCIENTIFIC_NAME_CUSTOM}
                className={classNames(
                  "mr-1 h-7 w-7",
                  value[2] && value[2] === "approved" ? "text-tertiary-650" : "text-blueCustom-700 opacity-50"
                )}
              />
            </ToolTip>
          </div>
        );
      }
      if (value[1] === "tree") {
        return <div className="font-inherit">{value[0]}</div>;
      }
      if (value[1] === "Native species") {
        return (
          <div className="font-inherit flex items-center gap-1">
            {value[0]}
            <ToolTip
              title=""
              content="Native species"
              colorBackground="white"
              placement="right"
              textVariantContent="text-14"
            >
              <Icon
                name={IconNames.NATIVE_SPECIES}
                className={classNames(
                  "h-7 w-7",
                  value[2] && value[2] === "approved" ? "text-tertiary-650" : "text-blueCustom-700 opacity-50"
                )}
              />
            </ToolTip>
          </div>
        );
      }
      if (value[1] === "new") {
        return (
          <div className="font-inherit flex items-center gap-1">
            {value[0]}
            <ToolTip
              title=""
              content="New Species"
              colorBackground="white"
              placement="right"
              textVariantContent="text-14"
            >
              <Icon
                name={IconNames.NEW_TAG_TREE_SPECIES_CUSTOM}
                className={classNames(
                  "mr-1 h-7 w-7",
                  value[2] && value[2] === "approved" ? "text-tertiary-650" : "text-blueCustom-700 opacity-50"
                )}
              />
            </ToolTip>
          </div>
        );
      }
    }
  };

  const columnTreeCount = [
    rowSpeciesName,
    {
      accessorKey: "treeCount",
      header: "Tree Count",
      enableSorting: false,
      meta: { width: secondColumnWidth },
      cell: (props: any) => {
        const value = props.getValue();
        return <div className="text-14 !font-bold">{value}</div>;
      }
    }
  ];

  const columnSeedCount = [
    rowSpeciesName,
    {
      accessorKey: "seedCount",
      header: "SEED Count",
      enableSorting: false,
      meta: { width: secondColumnWidth },
      cell: (props: any) => {
        const value = props.getValue();
        return <div className="text-14 !font-bold">{value}</div>;
      }
    }
  ];

  const columnNonTreeCount = [
    rowSpeciesName,
    {
      accessorKey: "nonTreeCount",
      header: "Non Tree Count",
      enableSorting: false,
      meta: { width: secondColumnWidth },
      cell: (props: any) => {
        const value = props.getValue();
        return <div className="text-14 !font-bold">{value}</div>;
      }
    }
  ];

  const columnTreeCountSite = [
    {
      accessorKey: "name",
      header: "Site Name",
      enableSorting: false
    },
    {
      accessorKey: "treeCount",
      header: "Tree Count",
      enableSorting: false,
      meta: { width: secondColumnWidth },
      cell: (props: any) => {
        const value = props.getValue();
        return <div className="text-14 !font-bold">{value}</div>;
      }
    }
  ];

  const columnTreeCountGoal = [
    rowSpeciesName,
    {
      accessorKey: "treeCountGoal",
      header: "Tree Count / goal",
      enableSorting: false,
      meta: { width: secondColumnWidth },
      cell: (props: any) => {
        const value = props.getValue();
        return (
          <div className="grid grid-cols-2 gap-3">
            <LinearProgressBar color="primary" value={50} className={"mt-2 !h-1.5 bg-primary-200 lg:!h-2"} />
            <Text variant="text-14-bold" className="flex gap-2">
              {value[0]}
              <Text variant="text-14" className="">
                of {value[1]}
              </Text>
            </Text>
          </div>
        );
      }
    }
  ];

  const columnSeedCountGoal = [
    rowSpeciesName,
    {
      accessorKey: "seedCountGoal",
      header: "Seed Count / goal",
      enableSorting: false,
      meta: { width: secondColumnWidth },
      cell: (props: any) => {
        const value = props.getValue();
        return (
          <div className="grid grid-cols-2 gap-3">
            <LinearProgressBar color="primary" value={50} className={"mt-2 !h-1.5 bg-primary-200 lg:!h-2"} />
            <Text variant="text-14-bold" className="flex gap-2">
              {value[0]}
              <Text variant="text-14-light">of {value[1]}</Text>
            </Text>
          </div>
        );
      }
    }
  ];

  const columnSpeciesCountGoal = [
    rowSpeciesName,
    {
      accessorKey: "speciesCountGoal",
      header: "SPECIES Count / goal",
      enableSorting: false,
      meta: { width: secondColumnWidth },
      cell: (props: any) => {
        const value = props.getValue();
        return (
          <div className="grid grid-cols-2 gap-3">
            <LinearProgressBar color="primary" value={50} className={"mt-2 !h-1.5 bg-primary-200 lg:!h-2"} />
            <Text variant="text-14-bold" className="flex gap-2">
              {value[0]}
              <Text variant="text-14" className="">
                of {value[1]}
              </Text>
            </Text>
          </div>
        );
      }
    }
  ];

  const columnSaplingsCount = [
    rowSpeciesName,
    {
      accessorKey: "treeCount",
      header: "saplings CounT",
      enableSorting: false,
      meta: { width: secondColumnWidth },
      cell: (props: any) => {
        const value = props.getValue();
        return <div className="text-14 !font-bold">{value}</div>;
      }
    }
  ];

  const columnNoGoal = [
    rowSpeciesName,
    {
      accessorKey: "treeCount",
      header: "Count",
      enableSorting: false,
      cell: (props: any) => {
        const value = props.getValue();
        return (
          <div className="grid grid-cols-2 gap-3">
            <Text variant="text-14-bold" className="flex gap-2">
              {value}
            </Text>
          </div>
        );
      }
    }
  ];

  const columnTable: { [key in ModelNameType]: any[] } = {
    treeCount: columnTreeCount,
    seedCount: columnSeedCount,
    nonTreeCount: columnNonTreeCount,
    treeCountSite: columnTreeCountSite,
    "treeCount/Goal": columnTreeCountGoal,
    "speciesCount/Goal": columnSpeciesCountGoal,
    "seedCount/Goal": columnSeedCountGoal,
    saplingsCount: columnSaplingsCount,
    noGoal: columnNoGoal
  };

  return (
    <div>
      <Table
        data={tableData}
        columns={"treeCount" in columnTable ? columnTable["treeCount"] : columnTable["noGoal"]}
        variant={VARIANT_TABLE_TREE_SPECIES}
        hasPagination
        invertSelectPagination
        visibleRows={5}
      />
    </div>
  );
};

export default TreeSpeciesTablePD;
