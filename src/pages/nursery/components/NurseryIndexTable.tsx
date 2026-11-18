import { Box, TableCell as ChakraTableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useCallback, useMemo } from "react";

import DownloadActionCell from "@/components/extensive/EntityIndex/DownloadActionCell";
import EntityUpdateStatus from "@/components/extensive/EntityIndex/EntityUpdateStatus";
import { stopRowClick } from "@/components/extensive/EntityIndex/stopRowClick";
import { useDate } from "@/hooks/useDate";
import { useIsMobile } from "@/hooks/useIsMobile";
import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
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
import { getNurseryDetailUrl } from "../nurseryIndex.utils";
import { downloadNurseries } from "../useNurseriesBulkActions";
import NurseryIndexEditButton from "./NurseryIndexEditButton";

const NurseryIndexTable: FC<{ nurseries: NurseryIndexRow[]; embeddedInProject: boolean }> = ({
  nurseries,
  embeddedInProject
}) => {
  const t = useT();
  const { format } = useDate();
  const isMobile = useIsMobile();
  const { selectedRows, isNurserySelected, handleRowSelected, handleAllItemsSelected } =
    useNurseryTableSelection(nurseries);

  const columns = useMemo<TableColumn[]>(
    () => [
      { key: "name", label: t("Name"), sortable: true, width: "24rem" },
      { key: "status", label: t("Status"), sortable: true, width: "12.5rem" },
      { key: "updateRequestStatus", label: t("Updates"), sortable: true, width: "15.625rem" },
      { key: "updatedAt", label: t("Latest Update"), sortable: true, width: "10.625rem" },
      { key: "createdAt", label: t("Date Created"), sortable: true, width: "9.375rem" },
      { key: "actions", label: "", width: isMobile ? "9rem" : "8.125rem" }
    ],
    [isMobile, t]
  );

  const renderRow = useCallback(
    (nursery: NurseryIndexRow, context?: TableRenderRowContext) => {
      const nurseryHref = getNurseryDetailUrl(nursery.uuid, !embeddedInProject);
      const isSelected = isNurserySelected(nursery);

      return (
        <TableRow
          className={classNames("group", context?.className, { "cursor-pointer": !isMobile })}
          aria-selected={isSelected}
          onClick={isMobile ? undefined : () => handleRowSelected(nursery, !isSelected)}
        >
          {isMobile ? null : (
            <ChakraTableCell {...context?.getCellProps(CHECKBOX_COLUMN_KEY)} onClick={stopRowClick}>
              <Checkbox
                name={`nursery-${nursery.id}`}
                aria-label={t("Select {nursery}", { nursery: nursery.name ?? t("Nursery") })}
                checked={isSelected}
                onCheckedChange={({ checked }) => handleRowSelected(nursery, checked === true)}
              />
            </ChakraTableCell>
          )}
          <ChakraTableCell {...context?.getCellProps("name")}>
            <TitleCell
              label={nursery.name ?? t("Nursery")}
              link={nurseryHref}
              linkTarget="_self"
              showChevron={false}
              onClick={stopRowClick}
            />
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("status")}>
            {nursery.status == null ? <Text>—</Text> : <TagSubmission state={nursery.status} size="small" />}
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("updateRequestStatus")}>
            <EntityUpdateStatus status={nursery.updateRequestStatus} />
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("updatedAt")}>
            {nursery.updatedAt !== "" ? (
              <Box w="min-content">
                <FeedbackTag
                  type="info-white"
                  size="default"
                  label={format(nursery.updatedAt)}
                  icon={<CalendarIcon boxSize={2.5} />}
                />
              </Box>
            ) : (
              <Text textStyle="300" color="neutral.800">
                –
              </Text>
            )}
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
          <ChakraTableCell {...context?.getCellProps("actions")} onClick={stopRowClick}>
            {isMobile ? (
              <DownloadActionCell
                ariaLabel={t("Download {nursery}", { nursery: nursery.name ?? t("Nursery") })}
                onDownload={() => downloadNurseries([nursery], t)}
              />
            ) : (
              <NurseryIndexEditButton nursery={nursery} />
            )}
          </ChakraTableCell>
        </TableRow>
      );
    },
    [format, handleRowSelected, isMobile, isNurserySelected, t, embeddedInProject]
  );

  return (
    <Box className="mobile:!w-full mobile:overflow-auto">
      <Table<NurseryIndexRow>
        data={nurseries}
        columns={columns}
        selectable={!isMobile}
        selectedRows={selectedRows}
        onRowSelected={handleRowSelected}
        onAllItemsSelected={handleAllItemsSelected}
        renderRow={renderRow}
        pageSize={10}
        paginationVariant={isMobile ? "compact" : "default"}
        totalItems={nurseries.length}
        className="overflow-hidden rounded"
      />
    </Box>
  );
};

export default NurseryIndexTable;
