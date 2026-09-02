import { TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo } from "react";

import {
  getSeedingTableColumns,
  getSeedsPerKg,
  SeedingEntry
} from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import PlantTableEntryRenderer, {
  NO_GOAL_PLANTS_PER_PAGE
} from "@/components/extensive/PageElements/PageContent/components/PlantTableEntryRenderer";
import { PlantData } from "@/components/extensive/Tables/TreeSpeciesTable";
import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { getAnswer } from "@/components/extensive/WizardForm/utils";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { COUNT_TABLE_SPECIES_PER_PAGE_MIN } from "@/pages/project/[uuid]/tabs/constants/Detail.constants";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { FULL_WIDTH_TABLE_HEADER_STYLES } from "@/redesignComponents/dataDisplay/Table/tableStyles";

type SeedingsEntryValueProps = {
  field: FieldDefinition;
  values: any;
  fieldsProvider: FormFieldsProvider;
};

type SampleSeedingRow = {
  id: string;
  name?: string | null;
  seedsInSample?: number | string | null;
  weightOfSample?: number | string | null;
  seedsPerKg: string | null;
};

const SeedingsSampleTable: FC<{ seedings: SeedingEntry[] }> = ({ seedings }) => {
  const t = useT();
  const columns = useMemo(
    () =>
      getSeedingTableColumns(t, false).map(column => ({
        key: String(column.accessorKey),
        label: String(column.header ?? "")
      })),
    [t]
  );
  const tableData = useMemo<SampleSeedingRow[]>(
    () =>
      seedings.map((seeding, index) => ({
        id: seeding.uuid ?? `seeding-${index}`,
        name: seeding.name,
        seedsInSample: seeding.seedsInSample,
        weightOfSample: seeding.weightOfSample,
        seedsPerKg: getSeedsPerKg(seeding)
      })),
    [seedings]
  );

  return (
    <Table
      data={tableData}
      columns={columns}
      variant="full-width"
      css={FULL_WIDTH_TABLE_HEADER_STYLES}
      totalItems={tableData.length}
      pageSize={NO_GOAL_PLANTS_PER_PAGE}
      showItemCount={false}
      showPagination={tableData.length > NO_GOAL_PLANTS_PER_PAGE}
      className={classNames(
        "mt-[0.125rem] !w-full max-w-[45.3125rem]",
        tableData.length <= COUNT_TABLE_SPECIES_PER_PAGE_MIN && "mb-3"
      )}
      renderRow={(row, context) => (
        <TableRow className={context?.className}>
          {columns.map(column => (
            <TableCell key={column.key} {...context?.getCellProps(column.key)}>
              <Text textStyle="400" color="neutral.700">
                {row[column.key as keyof SampleSeedingRow] ?? ""}
              </Text>
            </TableCell>
          ))}
        </TableRow>
      )}
    />
  );
};

const SeedingsEntryValue: FC<SeedingsEntryValueProps> = ({ field, values, fieldsProvider }) => {
  const t = useT();
  const seedings = useMemo(
    () => ((getAnswer(field, values, fieldsProvider) ?? []) as SeedingEntry[]).filter(seeding => seeding != null),
    [field, fieldsProvider, values]
  );

  if (seedings.length === 0) return null;

  if (field.additionalProps?.capture_count === true) {
    const plants = seedings.map(
      ({ name, amount }) =>
        ({
          name,
          amount,
          taxonId: null
        } as PlantData)
    );
    return <PlantTableEntryRenderer amountColumnLabel={t("Number of Seeds")} plants={plants} tableType="noGoal" />;
  }

  return <SeedingsSampleTable seedings={seedings} />;
};

export default SeedingsEntryValue;
