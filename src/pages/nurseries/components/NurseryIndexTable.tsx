import { Box, TableCell as ChakraTableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useCallback, useMemo } from "react";

import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import TitleCell from "@/redesignComponents/dataDisplay/Table/components/TitleCell";
import Table, {
  CHECKBOX_COLUMN_KEY,
  TableColumn,
  TableRenderRowContext
} from "@/redesignComponents/dataDisplay/Table/Table";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import { CalendarIcon } from "@/redesignComponents/foundations/Icons";

import { useNurseryTableSelection } from "../NurseriesSelection.provider";
import type { NurseryIndexRow } from "../nurseryIndex.types";
import NurseryIndexEditButton from "./NurseryIndexEditButton";

const NurseryIndexTable = ({ nurseries }: { nurseries: NurseryIndexRow[] }) => {
  const t = useT();
  const { format } = useDate();
  const { selectedRows, isNurserySelected, handleRowSelected, handleAllItemsSelected } =
    useNurseryTableSelection(nurseries);

  const columns = useMemo<TableColumn[]>(
    () => [
      { key: "name", label: t("Name"), sortable: true, width: "50%" },
      { key: "status", label: t("Status"), sortable: true },
      { key: "createdAt", label: t("Date Created"), sortable: true },
      { key: "actions", label: "" }
    ],
    [t]
  );

  const renderRow = useCallback(
    (nursery: NurseryIndexRow, context?: TableRenderRowContext) => {
      const nurseryHref = getEntityDetailPageLink("nurseries", nursery.uuid);
      const isSelected = isNurserySelected(nursery);

      return (
        <TableRow
          className={context?.className != null ? `group ${context.className}` : "group"}
          aria-selected={isSelected}
        >
          <ChakraTableCell {...context?.getCellProps(CHECKBOX_COLUMN_KEY)}>
            <Checkbox
              name={`nursery-${nursery.id}`}
              aria-label={t("Select {nursery}", { nursery: nursery.name ?? t("Nursery") })}
              checked={isSelected}
              onCheckedChange={({ checked }) => handleRowSelected(nursery, checked === true)}
            />
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("name")}>
            <TitleCell label={nursery.name ?? t("Nursery")} link={nurseryHref} linkTarget="_self" showChevron={false} />
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("status")}>
            {nursery.status == null ? <Text>—</Text> : <TagSubmission state={nursery.status} size="small" />}
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("createdAt")}>
            <ActionStatusTag
              state="neutral-light"
              label={format(nursery.createdAt)}
              icon={<CalendarIcon boxSize="0.625rem" />}
              size="small"
              className="rounded bg-theme-neutral-200"
            />
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("actions")}>
            <NurseryIndexEditButton nursery={nursery} />
          </ChakraTableCell>
        </TableRow>
      );
    },
    [format, handleRowSelected, isNurserySelected, t]
  );

  return (
    <Box className="mobile:!w-full mobile:overflow-auto">
      <Table<NurseryIndexRow>
        data={nurseries}
        columns={columns}
        selectable
        selectedRows={selectedRows}
        onRowSelected={handleRowSelected}
        onAllItemsSelected={handleAllItemsSelected}
        renderRow={renderRow}
        pageSize={10}
        totalItems={nurseries.length}
        className="overflow-hidden rounded"
      />
    </Box>
  );
};

export default NurseryIndexTable;
