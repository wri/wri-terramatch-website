import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ReactNode, useMemo } from "react";

import { useModalContext } from "@/context/modal.provider";
import { FormModelsDefinition } from "@/context/wizardForm.provider";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { BaseModelNames, EntityName, isReportModelName } from "@/types/common";
import { toArray } from "@/utils/array";

import { ModalId } from "../../Modal/ModalConst";

export interface SaveAndCloseModalProps {
  title?: string;
  content?: ReactNode;
  onConfirm?: () => void;
  models?: FormModelsDefinition;
}

const PROFILE_SECTION_LABELS: Partial<Record<BaseModelNames, string>> = {
  projects: "Project",
  sites: "Site",
  nurseries: "Nursery"
};

const SaveAndCloseModal = (props: SaveAndCloseModalProps) => {
  const { closeModal } = useModalContext();
  const t = useT();
  const models = useMemo(() => toArray(props.models), [props.models]);
  const modelName = models[0]?.model as EntityName | undefined;

  const defaultContent = useMemo(() => {
    if (modelName == null) {
      return null;
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

    const profileSectionLabel = PROFILE_SECTION_LABELS[modelName as BaseModelNames];
    if (profileSectionLabel != null) {
      return (
        <Box>
          <Text as="span" textStyle="400">
            {t("Your progress will be saved as a draft. You can access this form again from the ")}
          </Text>
          <Text as="span" textStyle="400-bold">
            {t(profileSectionLabel)}
          </Text>
          <Text as="span" textStyle="400">
            {t(" section.")}
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
  }, [modelName, t]);

  return (
    <ModalConfirmation
      open={true}
      title={props.title ?? t("Save and exit?")}
      content={props.content ?? defaultContent}
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
