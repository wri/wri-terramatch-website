import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import Link from "next/link";
import { FC } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { FormEntity } from "@/connections/Form";
import { useModalContext } from "@/context/modal.provider";

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
  const { closeModal } = useModalContext();

  return (
    <Modal
      className="min-w-[500px]"
      iconProps={{ name: statusProps.icon, width: 60, height: 60, className: statusProps.className }}
      title={statusProps.title}
      content={feedback ?? t("No feedback provided")}
      primaryButtonProps={
        needMoreInformation
          ? {
              as: Link,
              children: t("Provide Feedback"),
              href: `/entity/${kebabCase(entityName)}/edit/${entityUuid}?mode=provide-feedback-entity`,
              onClick: () => {
                closeModal(ModalId.STATUS);
              }
            }
          : {
              children: t("Close"),
              onClick: () => closeModal(ModalId.STATUS)
            }
      }
      secondaryButtonProps={
        needMoreInformation
          ? {
              children: t("Close"),
              onClick: () => closeModal(ModalId.STATUS)
            }
          : undefined
      }
    />
  );
};

export default EntityStatusModal;
