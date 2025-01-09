import classNames from "classnames";

import LinearProgressBar from "@/components/elements/ProgressBar/LinearProgressBar/LinearProgressBar";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";

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
  | "saplingsCount";

export interface TreeSpeciesTablePDProps {
  data: any[];
  modelName: ModelNameType;
  headerName?: string;
  secondColumnWidth?: string;
}

const TreeSpeciesTablePD = ({
  data,
  modelName,
  headerName = "species Name",
  secondColumnWidth = ""
}: TreeSpeciesTablePDProps) => {
  const rowSpeciesName = {
    accessorKey: "name",
    header: headerName,
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      if (value[0] === "Non-scientific name") {
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
      header: "Tree CounT",
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

  const columnTable: { [key in ModelNameType]: any[] } = {
    treeCount: columnTreeCount,
    seedCount: columnSeedCount,
    nonTreeCount: columnNonTreeCount,
    treeCountSite: columnTreeCountSite,
    "treeCount/Goal": columnTreeCountGoal,
    "speciesCount/Goal": columnSpeciesCountGoal,
    "seedCount/Goal": columnSeedCountGoal,
    saplingsCount: columnSaplingsCount
  };

  return (
    <div>
      <Table data={data} columns={columnTable[modelName]} variant={VARIANT_TABLE_TREE_SPECIES} hasPagination />
    </div>
  );
};

export default TreeSpeciesTablePD;
