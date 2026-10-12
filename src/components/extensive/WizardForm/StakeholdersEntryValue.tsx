import { TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { FC, useMemo } from "react";

import { StakeholderEntry } from "@/components/elements/Inputs/DataTable/RHFStakeholdersTable";
import { NO_GOAL_PLANTS_PER_PAGE } from "@/components/extensive/PageElements/PageContent/components/PlantTableEntryRenderer";
import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { getStakeholderKeyRoleOptions } from "@/constants/options/stakeholders";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { FULL_WIDTH_TABLE_HEADER_STYLES } from "@/redesignComponents/dataDisplay/Table/tableStyles";
import { formatOptionsList } from "@/utils/options";

type StakeholdersEntryValueProps = {
  field: FieldDefinition;
  values: Dictionary<any>;
};

type StakeholderRow = {
  id: string;
  index: number;
  name: string;
  keyRole: string;
  description: string;
};

const StakeholdersEntryValue: FC<StakeholdersEntryValueProps> = ({ field, values }) => {
  const t = useT();
  const columns = useMemo(
    () => [
      { key: "index", label: "#" },
      { key: "name", label: t("Stakeholder Name") },
      { key: "keyRole", label: t("Key Role") },
      { key: "description", label: t("Description") }
    ],
    [t]
  );
  const rows = useMemo<StakeholderRow[]>(() => {
    const keyRoleOptions = getStakeholderKeyRoleOptions(t);
    return ((values[field.name] ?? []) as StakeholderEntry[])
      .filter(stakeholder => stakeholder != null)
      .map((stakeholder, index) => ({
        id: stakeholder.uuid ?? `stakeholder-${index}`,
        index: index + 1,
        name: stakeholder.name ?? "",
        keyRole: formatOptionsList(keyRoleOptions, stakeholder.keyRole ?? undefined),
        description: stakeholder.description ?? ""
      }));
  }, [field.name, t, values]);

  if (rows.length === 0) return null;

  return (
    <Table
      data={rows}
      columns={columns}
      variant="full-width"
      css={FULL_WIDTH_TABLE_HEADER_STYLES}
      totalItems={rows.length}
      pageSize={NO_GOAL_PLANTS_PER_PAGE}
      showItemCount={false}
      showPagination={rows.length > NO_GOAL_PLANTS_PER_PAGE}
      className="mb-3 mt-[0.125rem] !w-full max-w-[45.3125rem]"
      renderRow={(row, context) => (
        <TableRow className={context?.className}>
          {columns.map(({ key }) => (
            <TableCell key={key} {...context?.getCellProps(key)}>
              <Text textStyle="400" color="neutral.700" whiteSpace="pre-line">
                {row[key as keyof StakeholderRow]}
              </Text>
            </TableCell>
          ))}
        </TableRow>
      )}
    />
  );
};

export default StakeholdersEntryValue;
