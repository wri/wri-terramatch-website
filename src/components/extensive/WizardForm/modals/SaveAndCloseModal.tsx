import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ReactNode, useMemo } from "react";

import { useModalContext } from "@/context/modal.provider";
import { FormModelsDefinition } from "@/context/wizardForm.provider";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { EntityName, isReportModelName, SingularEntityName } from "@/types/common";
import { toArray } from "@/utils/array";

import { ModalId } from "../../Modal/ModalConst";

export interface SaveAndCloseModalProps {
  title?: string;
  content?: ReactNode;
  onConfirm?: ((shouldHideWarning?: boolean) => void) | (() => void);
  models?: FormModelsDefinition;
  shouldHideWarning: boolean;
}

const SaveAndCloseModal = (props: SaveAndCloseModalProps) => {
  const { closeModal } = useModalContext();
  const { getReadableEntityName } = useGetReadableEntityName();
  const t = useT();
  const models = useMemo(() => toArray(props.models), [props.models]);
  const modelName = models[0]?.model as EntityName | undefined;

  const defaultContent = useMemo(() => {
    if (modelName == null) {
      return null;
    }

    if (["projects", "sites", "nurseries", "projectReports", "siteReports", "nurseryReports"].includes(modelName)) {
      return (
        <Box>
          <Text as="span" textStyle="400">
            {t("TerraMatch will save the information you've entered in this form.")}
          </Text>
          <br />
          <Text as="span" textStyle="400">
            {t(
              'Be sure to return to complete this form and press "Submit" on the last page of the form to send your {entityName} to an Admin for review.',
              {
                entityName: getReadableEntityName(modelName as EntityName | SingularEntityName, true)
              }
            )}
          </Text>
        </Box>
      );
    }

    if (isReportModelName(modelName)) {
      return (
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
      );
    }

    return (
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
    );
  }, [getReadableEntityName, modelName, t]);

  return (
    <ModalConfirmation
      open={true}
      title={props.title ?? t("Save and Exit")}
      content={props.content ?? defaultContent}
      buttonsPrimary={[
        {
          id: "close",
          children: t("Save and Exit"),
          variant: "primary",
          className: "!w-full",
          onClick: () => {
            props.onConfirm?.(props.shouldHideWarning);
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
