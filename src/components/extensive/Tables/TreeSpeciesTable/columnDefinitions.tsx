import classNames from "classnames";

import LinearProgressBar from "@/components/elements/ProgressBar/LinearProgressBar/LinearProgressBar";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Log from "@/utils/log";

import Icon, { IconNames } from "../../Icon/Icon";

export type TableType = "treeCountSite" | "treeCountGoal" | "noGoal" | "noCount";
type ColumnDefinitionProps = { tableType: TableType; headerName: string; secondColumnWidth: string };

export const getTreeSpeciesColumns = (props: ColumnDefinitionProps) => {
  switch (props.tableType) {
    case "treeCountSite":
      return columnTreeCountSite(props);
    case "treeCountGoal":
      return columnTreeCountGoal(props);
    case "noGoal":
      return columnNoGoal(props);
    case "noCount":
      return columnNoCount(props);

    default:
      Log.error("Unknown table type", props);
      return columnNoGoal(props);
  }
};

const rowSpeciesName = (headerName: string) => ({
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
});

const columnTreeCountSite = ({ secondColumnWidth }: ColumnDefinitionProps) => [
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

const columnTreeCountGoal = ({ secondColumnWidth, headerName }: ColumnDefinitionProps) => [
  rowSpeciesName(headerName),
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

const columnNoGoal = ({ secondColumnWidth, headerName }: ColumnDefinitionProps) => [
  rowSpeciesName(headerName),
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
            {value?.toLocaleString()}
          </Text>
        </div>
      );
    }
  }
];

const columnNoCount = ({ headerName }: ColumnDefinitionProps) => [rowSpeciesName(headerName)];
