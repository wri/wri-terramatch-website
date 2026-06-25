import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { useRouter } from "next/router";
import { FC } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { FormEntity } from "@/connections/Form";
import { useModalContext } from "@/context/modal.provider";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";

export type StatusProps = { title: string; icon: IconNames; className: string };

type EntityStatusModalProps = {
  statusProps: StatusProps;
  feedback?: string | null;
  needMoreInformation?: boolean;
  showProvideFeedback?: boolean;
  entityName: FormEntity;
  entityUuid: string;
  formStepId?: string | null;
};

const EntityStatusModal: FC<EntityStatusModalProps> = ({
  statusProps,
  feedback,
  needMoreInformation,
  showProvideFeedback,
  entityName,
  entityUuid,
  formStepId
}) => {
  const t = useT();
  const router = useRouter();
  const { closeModal, modalOpened } = useModalContext();
  const shouldShowProvideFeedback = showProvideFeedback ?? needMoreInformation ?? false;

  const handleClose = () => closeModal(ModalId.STATUS);
  const handleProvideFeedback = () => {
    const targetStepId = formStepId ?? "summary";

    handleClose();
    router.push(
      `/entity/${kebabCase(entityName)}/edit/${entityUuid}?${STEP_QUERY_PARAM}=${encodeURIComponent(targetStepId)}`
    );
  };

  return (
    <ModalConfirmation
      open={modalOpened(ModalId.STATUS)}
      onOpenChange={open => !open && handleClose()}
      title={statusProps.title}
      content={
        <Flex direction="column" align="center" gap={3}>
          <Icon name={statusProps.icon} className={statusProps.className} width={40} height={40} />
          <Text textStyle="400" color="neutral.900">
            {feedback ?? t("No feedback provided")}
          </Text>
        </Flex>
      }
      buttonsPrimary={
        shouldShowProvideFeedback
          ? [
              {
                id: "provide-feedback",
                children: t("Provide Feedback"),
                className: "!w-full",
                variant: "primary",
                onClick: handleProvideFeedback
              }
            ]
          : undefined
      }
      buttonsCancel={[
        { id: "close", children: t("Close"), onClick: handleClose, className: "!w-full", variant: "secondary" }
      ]}
    />
  );
};

export default EntityStatusModal;
