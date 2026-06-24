import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";

import { useModalContext } from "@/context/modal.provider";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";

import { ModalId } from "../../Modal/ModalConst";

export interface SaveAndCloseModalProps {
  title?: string;
  content?: string;
  onConfirm?: () => void;
}

const SaveAndCloseModal = (props: SaveAndCloseModalProps) => {
  const { closeModal } = useModalContext();
  const t = useT();

  return (
    <ModalConfirmation
      open={true}
      title={props.title ?? t("Save and exit?")}
      content={
        props.content ?? (
          <Box>
            <Text as="span" textStyle="400">
              {t("Your progress will be saved as a draft. You can access this form again from the ")}
            </Text>
            <Text as="span" textStyle="400-bold">
              {t("Reporting Tasks")}
            </Text>
            <Text as="span" textStyle="400">
              {t(" section on your project page.")}
            </Text>
          </Box>
        )
      }
      buttonsPrimary={[
        {
          id: "close",
          children: t("Save and exit"),
          variant: "primary",
          className: "!w-full",
          onClick: () => {
            props.onConfirm?.();
            closeModal(ModalId.SAVE_AND_CLOSE_MODAL);
          }
        }
      ]}
      buttonsCancel={[
        {
          id: "cancel",
          children: t("Cancel"),
          className: "!w-full",
          variant: "secondary",
          onClick: () => closeModal(ModalId.SAVE_AND_CLOSE_MODAL)
        }
      ]}
      onOpenChange={() => closeModal(ModalId.SAVE_AND_CLOSE_MODAL)}
    />
  );
};

export default SaveAndCloseModal;
