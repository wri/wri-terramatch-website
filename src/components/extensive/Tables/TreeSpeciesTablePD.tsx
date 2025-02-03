import classNames from "classnames";

import LinearProgressBar from "@/components/elements/ProgressBar/LinearProgressBar/LinearProgressBar";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import { Framework } from "@/context/framework.provider";
import { useGetV2SeedingsENTITYUUID, useGetV2TreeSpeciesEntityUUID } from "@/generated/apiComponents";

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
  framework?: string;
  setTotalCount?: React.Dispatch<React.SetStateAction<number>>;
  setTotalSpecies?: React.Dispatch<React.SetStateAction<number>>;
  headerName?: string;
  collection?: string;
  secondColumnWidth?: string;
  data?: any;
  typeTable?:
    | "treeCount"
    | "treeCount/Goal"
    | "speciesCount/Goal"
    | "nonTreeCount"
    | "seedCount"
    | "treeCountSite"
    | "saplingsCount";
  visibleRows?: number;
  galleryType?: string;
}

export interface TreeSpeciesTableRowData {
  name: [string, string[]];
  treeCount?: string | number;
  treeCountGoal?: [number, number];
  seedCount?: string | number;
  nonTreeCount?: string | number;
  uuid: string;
}

const TreeSpeciesTablePD = ({
  modelUUID,
  modelName,
  framework,
  setTotalCount,
  setTotalSpecies,
  collection,
  headerName = "species Name",
  secondColumnWidth = "",
  typeTable,
  visibleRows = 5,
  galleryType,
  data
}: TreeSpeciesTablePDProps) => {
  const queryParams: any = {};

  if (collection != null) {
    queryParams["filter[collection]"] = collection;
  }

  const { data: apiResponse } = useGetV2TreeSpeciesEntityUUID(
    {
      queryParams,
      pathParams: {
        uuid: modelUUID,
        entity: modelName?.replace("Report", "-report")
      }
    },
    {
      enabled: !!modelUUID && collection !== "seeding"
    }
  );

  const { data: seedings } = useGetV2SeedingsENTITYUUID(
    {
      pathParams: {
        uuid: modelUUID,
        entity: modelName?.replace("Report", "-report")
      }
    },
    {
      enabled: !!modelUUID && collection === "seeding"
    }
  );

  const getCollectionType = (collection: string) => {
    let result = "tree";
    if (collection === "non-tree") {
      result =
        framework && framework.includes(Framework.HBF) && (modelName === "project" || modelName === "site")
          ? "treeCount/Goal"
          : "noGoal";
    }
    if (collection === "nursery-seedling") {
      result = modelName === "project" ? "noGoal" : "treeCount/Goal";
    }
    if (collection === "seeding") {
      result = "noGoal";
    }
    if (collection === "tree-planted") {
      result =
        (framework &&
          (framework.includes(Framework.HBF) ||
            framework.includes(Framework.TF) ||
            framework.includes(Framework.ENTERPRISES)) &&
          modelName === "project") ||
        (framework && framework.includes(Framework.HBF) && modelName === "site")
          ? "treeCount/Goal"
          : "noGoal";
    }
    if (collection === "replanting") {
      result = "noGoal";
    }
    return result;
  };

  const processTreeSpeciesTableData = (rows: any[]): TreeSpeciesTableRowData[] => {
    if (!rows) return [];
    if (setTotalCount) {
      const total = rows.reduce(
        (sum, row) => sum + ((modelName === "site-report" ? row.amount : row.report_amount) || 0),
        0
      );
      setTotalCount(total);
    }
    if (setTotalSpecies) {
      setTotalSpecies(rows.length);
    }
    return rows.map(row => {
      let speciesTypes = ["tree"];
      if (!row.taxon_id) speciesTypes.push("non-scientific");
      if (row.is_new_species) speciesTypes.push("new");
      if (getCollectionType(collection ?? "") !== "noGoal" && getCollectionType(collection ?? "").includes("Goal")) {
        return {
          name: [row.name, speciesTypes],
          treeCountGoal: [row.report_amount, row.amount],
          uuid: row.uuid
        };
      }
      if (modelName === "site-report") {
        return {
          name: [row.name, speciesTypes],
          treeCount: row.amount,
          uuid: row.uuid
        };
      }
      return {
        name: [row.name, speciesTypes],
        treeCount: row.report_amount ?? "0",
        uuid: row.uuid
      };
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
        uuid: row.uuid
      };
    });
  };

  const tableData =
    collection === "seeding"
      ? seedings?.data
        ? processSeedingTableData(seedings.data)
        : []
      : apiResponse?.data
      ? processTreeSpeciesTableData(apiResponse.data)
      : [];

  const rowSpeciesName = {
    accessorKey: "name",
    header: headerName,
    enableSorting: false,
    cell: (props: any) => {
      const value = props.getValue();
      const [speciesName, speciesTypes] = value;
      const iconConfigs: { [key: string]: { tooltip: string; icon: IconNames } } = {
        "non-scientific": {
          tooltip: "Non-scientific name",
          icon: IconNames.NON_SCIENTIFIC_NAME_CUSTOM
        },
        new: {
          tooltip: "New Species",
          icon: IconNames.NEW_TAG_TREE_SPECIES_CUSTOM
        }
      };

      const icons = Array.isArray(speciesTypes)
        ? speciesTypes.map((type: string) => {
            const config = iconConfigs[type];
            return config ? (
              <ToolTip
                key={type}
                title=""
                content={config.tooltip}
                colorBackground="white"
                placement="right"
                textVariantContent="text-14"
              >
                <Icon
                  name={config.icon}
                  className={classNames(
                    "h-7 w-7",
                    value[2] && value[2] === "approved" ? "text-tertiary-650" : "text-blueCustom-700 opacity-50"
                  )}
                />
              </ToolTip>
            ) : null;
          })
        : null;

      return (
        <div className="font-inherit flex items-center gap-1">
          {speciesName}
          {icons}
        </div>
      );
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
        if (!value) {
          return null;
        }
        return (
          <div className="grid grid-cols-2 gap-3">
            <LinearProgressBar
              color="primary"
              value={value[0] > value[1] ? 100 : (value[0] / value[1]) * 100}
              className={"mt-2 !h-1.5 bg-primary-200 lg:!h-2"}
            />
            <Text variant="text-14-bold" className="flex gap-2">
              {value[0].toLocaleString()}
              <Text variant="text-14" className="">
                of {value[1].toLocaleString()}
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
            <LinearProgressBar
              color="primary"
              value={value[0] > value[1] ? 100 : (value[0] / value[1]) * 100}
              className={"mt-2 !h-1.5 bg-primary-200 lg:!h-2"}
            />
            <Text variant="text-14-bold" className="flex gap-2">
              {value[0].toLocaleString()}
              <Text variant="text-14-light">of {value[1].toLocaleString()}</Text>
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
            <LinearProgressBar
              color="primary"
              value={value[0] > value[1] ? 100 : (value[0] / value[1]) * 100}
              className={"mt-2 !h-1.5 bg-primary-200 lg:!h-2"}
            />
            <Text variant="text-14-bold" className="flex gap-2">
              {value[0].toLocaleString()}
              <Text variant="text-14" className="">
                of {value[1].toLocaleString()}
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
        return <div className="text-14 !font-bold">{value.toLocaleString()}</div>;
      }
    }
  ];

  const columnNoGoal = [
    rowSpeciesName,
    {
      accessorKey: "treeCount",
      header: "Count",
      enableSorting: false,
      meta: { width: secondColumnWidth },
      cell: (props: any) => {
        const value = props.getValue();
        return (
          <div className="grid grid-cols-2 gap-3">
            <Text variant="text-14-bold" className="flex gap-2">
              {value.toLocaleString()}
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
        data={data ?? tableData}
        columns={columnTable[typeTable ?? (getCollectionType(collection ?? "") as ModelNameType)]}
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
