import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { useRouter } from "next/router";
import { FC } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { FormEntity } from "@/connections/Form";
import { useModalContext } from "@/context/modal.provider";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";

export type StatusProps = { title: string; icon: IconNames; className: string };

type EntityStatusModalProps = {
  statusProps: StatusProps;
  feedback?: string | null;
  needMoreInformation: boolean;
  entityName: FormEntity;
  entityUuid: string;
};

const EntityStatusModal: FC<EntityStatusModalProps> = ({
  statusProps,
  feedback,
  needMoreInformation,
  entityName,
  entityUuid
}) => {
  const t = useT();
  const router = useRouter();
  const { closeModal, modalOpened } = useModalContext();

  const handleClose = () => closeModal(ModalId.STATUS);

  return (
    <ModalConfirmation
      open={modalOpened(ModalId.STATUS)}
      onOpenChange={open => !open && handleClose()}
      title={statusProps.title}
      content={
        <Flex direction="column" align="center" gap={3}>
          <InformationRequiredIcon boxSize={10} color="warning.500" />
          <Text textStyle="400" color="neutral.900">
            {feedback ?? t("No feedback provided")}
          </Text>
        </Flex>
      }
      buttonsPrimary={
        needMoreInformation
          ? [
              {
                id: "provide-feedback",
                children: t("Provide Feedback"),
                className: "!w-full",
                variant: "primary",
                onClick: () => {
                  handleClose();
                  router.push(`/entity/${kebabCase(entityName)}/edit/${entityUuid}?formStepId=summary`);
                }
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
