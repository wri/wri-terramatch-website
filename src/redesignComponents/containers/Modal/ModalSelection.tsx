import { type SystemStyleObject, Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, ReactNode, useCallback, useMemo } from "react";

import Table from "@/redesignComponents/dataDisplay/Table/Table";

import ModalConfirmation, { ModalConfirmationProps } from "./ModalConfirmation";

export interface ModalSelectionItem {
  id: string | number;
  label: string;
  cells?: Record<string, string | null>;
}

export interface ModalSelectionColumn {
  key: string;
  label: string;
}

export const LABEL_COLUMN_KEY = "label";

interface SelectionCopy {
  title: string;
  description: ReactNode;
}

export interface ModalSelectionProps
  extends Pick<
    ModalConfirmationProps,
    "open" | "onOpenChange" | "modal" | "trapFocus" | "restoreFocus" | "blocking" | "size"
  > {
  items: ModalSelectionItem[];
  singular: SelectionCopy;
  plural: SelectionCopy;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmLabel?: string;
  view?: "list" | "table";
  columns?: ModalSelectionColumn[];
  footnote?: ReactNode;
}

type Props = PropsWithChildren<ModalSelectionProps & { action: "delete" | "submit" }>;

type SelectionTableRow = { id: string | number } & Record<string, string | number | null>;

const SELECTION_TABLE_CSS: SystemStyleObject = {
  border: "0.0625rem solid var(--chakra-colors-neutral-300)",
  borderRadius: "0.25rem",
  overflow: "hidden",
  "& >div>div": {
    maxHeight: "15rem",
    overflowX: "hidden",
    overflowY: "auto"
  },
  "& table": {
    tableLayout: "fixed",
    width: "100%"
  },
  "& table thead tr, & table thead tr th": {
    backgroundColor: "var(--chakra-colors-neutral-200)",
    position: "sticky",
    top: 0,
    zIndex: 1
  },
  "& table tbody tr:last-child": {
    borderBottom: "none !important"
  }
};

const toTableRow = ({ id, label, cells }: ModalSelectionItem): SelectionTableRow => ({
  ...cells,
  id,
  [LABEL_COLUMN_KEY]: label
});

const ModalSelection: FC<Props> = ({
  items,
  singular,
  plural,
  onConfirm,
  isLoading = false,
  confirmLabel,
  action,
  view = "list",
  columns,
  footnote,
  children,
  ...modalProps
}) => {
  const t = useT();
  const isSingle = items.length === 1;
  const isDelete = action === "delete";
  const copy = isSingle ? singular : plural;
  const notice = isDelete ? t("You can’t undo this.") : null;
  const tableColumns = view === "table" ? columns : undefined;
  const tableRows = useMemo(() => (tableColumns != null ? items.map(toTableRow) : []), [items, tableColumns]);
  const renderTableCell = useCallback((row: SelectionTableRow, columnKey: string) => {
    const value = row[columnKey] ?? "—";
    return (
      <Text textStyle="300" color="neutral.800" title={String(value)} truncate>
        {value}
      </Text>
    );
  }, []);

  return (
    <ModalConfirmation
      {...modalProps}
      title={copy.title}
      contentLayout="custom"
      contentPadding={children == null}
      content={
        <Flex className="flex-col gap-4">
          {isSingle ? (
            <Flex
              className={children == null ? "w-full flex-col items-center pt-2" : "w-full flex-col items-center pt-4"}
            >
              {!isDelete && (
                <Text textStyle="400" color="neutral.900" className="text-center">
                  {copy.description}
                </Text>
              )}
              <Text textStyle="500-bold" color="neutral.900" className="text-center">
                {items[0].label}
                {!isDelete && "?"}
              </Text>
              {isDelete && (
                <Text textStyle="400" color="neutral.900" className="text-center">
                  {copy.description}
                </Text>
              )}
              {notice != null && (
                <Text textStyle="400-bold" color="neutral.900" className="text-center">
                  {notice}
                </Text>
              )}
              {footnote}
            </Flex>
          ) : (
            <Box className="px-4">
              <Text textStyle="400" color="neutral.900" className={"mb-3"}>
                {copy.description}
                {notice != null && (
                  <>
                    {" "}
                    <Text as="span" textStyle="400-bold" color="neutral.900">
                      {notice}
                    </Text>
                  </>
                )}
              </Text>
              {tableColumns != null ? (
                <Table
                  css={SELECTION_TABLE_CSS}
                  variant="full-width"
                  data={tableRows}
                  columns={tableColumns}
                  renderDataCell={renderTableCell}
                  showPagination={false}
                  showItemCount={false}
                />
              ) : (
                <Box bg="neutral.200" className="rounded px-3 py-2">
                  <List.Root as="ul" className="list-disc space-y-2 pl-4">
                    {items.map(item => (
                      <List.Item key={item.id} _marker={{ color: "neutral.900" }}>
                        <Text as="span" textStyle="400" color="neutral.900">
                          {item.label}
                        </Text>
                      </List.Item>
                    ))}
                  </List.Root>
                </Box>
              )}
              {footnote}
            </Box>
          )}
          {children}
        </Flex>
      }
      confirmButton={{
        id: action,
        variant: isDelete ? "negative" : "primary",
        children: confirmLabel ?? (isDelete ? (isLoading ? t("Deleting...") : t("Delete")) : t("Yes, submit")),
        disabled: isLoading || items.length === 0,
        loading: isLoading,
        onClick: onConfirm
      }}
      cancelButton={{ disabled: isLoading }}
    />
  );
};

export default ModalSelection;
