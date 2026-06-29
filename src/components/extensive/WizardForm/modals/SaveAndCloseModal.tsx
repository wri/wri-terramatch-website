import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useMemo } from "react";

import { useModalContext } from "@/context/modal.provider";
import { FormModelsDefinition } from "@/context/wizardForm.provider";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { EntityName, isReportModelName } from "@/types/common";
import { toArray } from "@/utils/array";

import { ModalId } from "../../Modal/ModalConst";

export interface SaveAndCloseModalProps {
  title?: string;
  content?: string;
  onConfirm?: () => void;
  models?: FormModelsDefinition;
}

const SaveAndCloseModal = (props: SaveAndCloseModalProps) => {
  const { closeModal } = useModalContext();
  const t = useT();
  const models = useMemo(() => toArray(props.models), [props.models]);
  const isReportModel = isReportModelName(models[0].model as EntityName);

  return (
    <ModalConfirmation
      open={true}
      title={props.title ?? t("Save and exit?")}
      content={
        props.content ?? isReportModel ? (
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
        ) : (
          <Box>
            <Text as="span" textStyle="400">
              {t("Your progress will be saved as a draft. You can access this form again from the ")}
            </Text>
            <Text as="span" textStyle="400-bold">
              {t("Opportunities ")}
            </Text>
            <Text as="span" textStyle="400">
              {t(" section.")}
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
