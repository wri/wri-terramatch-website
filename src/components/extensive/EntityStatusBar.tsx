import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import Link from "next/link";
import { FC, useCallback, useMemo } from "react";

import Button from "@/components/elements/Button/Button";
import StatusBar from "@/components/elements/StatusBar/StatusBar";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { EntityFullDto } from "@/connections/Entity";
import { FormEntity } from "@/connections/Form";
import { useModalContext } from "@/context/modal.provider";
import { Status } from "@/types/common";

type EntityStatusBarProps = {
  entityName: FormEntity;
  entity: EntityFullDto;
};

const StatusMapping: { [index: string]: Status } = {
  started: "edit",
  due: "edit",
  approved: "success",
  "awaiting-approval": "awaiting",
  "needs-more-information": "warning"
};
type StatusBarStatus = keyof typeof StatusMapping;

const hasUpdateRequest = ({ updateRequestStatus }: EntityFullDto) =>
  updateRequestStatus != null && !["draft", "no-update"].includes(updateRequestStatus);

type StatusProps = { title: string; icon: IconNames; className: string };
const getStatusProps = (
  t: typeof useT,
  entity: EntityFullDto,
  entityStatus: StatusBarStatus
): StatusProps | undefined => {
  const titlePrefix = hasUpdateRequest(entity) ? "Change Request Status:" : "Status:";
  switch (entityStatus) {
    case "approved":
      return {
        title: t(`${titlePrefix} Approved`),
        icon: IconNames.CHECK_CIRCLE_FILL,
        className: "fill-secondary"
      };

    case "needs-more-information":
      return {
        title: t(`${titlePrefix} More Info Requested`),
        icon: IconNames.EXCLAMATION_CIRCLE_FILL,
        className: "fill-tertiary"
      };

    case "awaiting-approval":
      return {
        title: t(`${titlePrefix} Awaiting approval`),
        icon: IconNames.CLOCK,
        className: "fill-primary"
      };

    default:
      return undefined;
  }
};

const EntityStatusBar: FC<EntityStatusBarProps> = ({ entityName, entity }) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();

  const entityStatus = (hasUpdateRequest(entity) ? entity.updateRequestStatus : entity.status) as StatusBarStatus;
  const needMoreInformation = entityStatus === "needs-more-information";
  const hasFeedback = needMoreInformation || entityStatus === "approved";
  const projectedEntityStatus = entityStatus == null ? undefined : StatusMapping[entityStatus];

  const statusProps = useMemo(() => getStatusProps(t, entity, entityStatus), [entity, entityStatus, t]);

  const viewFeedback = useCallback(() => {
    if (statusProps == null) return;
    openModal(
      ModalId.STATUS,
      <Modal
        className="min-w-[500px]"
        iconProps={{ name: statusProps.icon, width: 60, height: 60, className: statusProps.className }}
        title={statusProps.title}
        content={entity.feedback ?? t("No feedback provided")}
        primaryButtonProps={
          needMoreInformation
            ? {
                as: Link,
                children: t("Provide Feedback"),
                href: `/entity/${kebabCase(entityName)}/edit/${entity.uuid}?mode=provide-feedback-entity`,
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
  }, [closeModal, entity.feedback, entity.uuid, entityName, needMoreInformation, openModal, statusProps, t]);

  return projectedEntityStatus == null ? null : (
    <StatusBar status={projectedEntityStatus} title={statusProps?.title ?? ""}>
      {hasFeedback ? (
        <Button variant="secondary" onClick={viewFeedback}>
          {t("View Feedback")}
        </Button>
      ) : null}
    </StatusBar>
  );
};

export default EntityStatusBar;
