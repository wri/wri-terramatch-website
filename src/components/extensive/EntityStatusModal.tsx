import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { useRouter } from "next/router";
import { FC } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { FormEntity } from "@/connections/Form";
import { useModalContext } from "@/context/modal.provider";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";

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
          <Icon name={statusProps.icon} width={60} height={60} className={statusProps.className} />
          {feedback ?? t("No feedback provided")}
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
