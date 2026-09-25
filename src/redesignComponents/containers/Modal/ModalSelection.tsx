import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, ReactNode } from "react";

import ModalConfirmation, { ModalConfirmationProps } from "./ModalConfirmation";

export interface ModalSelectionItem {
  id: string | number;
  label: string;
}

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
}

type Props = PropsWithChildren<ModalSelectionProps & { action: "delete" | "submit" }>;

const ModalSelection: FC<Props> = ({
  items,
  singular,
  plural,
  onConfirm,
  isLoading = false,
  confirmLabel,
  action,
  children,
  ...modalProps
}) => {
  const t = useT();
  const isSingle = items.length === 1;
  const isDelete = action === "delete";
  const copy = isSingle ? singular : plural;
  const notice = isDelete ? t("You can’t undo this.") : null;

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
                {items[0].label}?
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
            </Flex>
          ) : (
            <Box className="px-4">
              <Text textStyle="400" color="neutral.900" className={isDelete ? "mb-3" : undefined}>
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
