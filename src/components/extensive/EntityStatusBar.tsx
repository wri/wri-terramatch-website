import { useT } from "@transifex/react";
import { FC, useCallback, useMemo } from "react";

import Button from "@/components/elements/Button/Button";
import StatusBar from "@/components/elements/StatusBar/StatusBar";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { EntityFullDto } from "@/connections/Entity";
import { FormEntity } from "@/connections/Form";
import { useModalContext } from "@/context/modal.provider";

import EntityStatusModal, { StatusProps } from "./EntityStatusModal";

type EntityStatusBarProps = {
  entityName: FormEntity;
  entity: EntityFullDto;
};

const StatusMapping = {
  started: "edit",
  due: "edit",
  approved: "success",
  "awaiting-approval": "awaiting",
  "needs-more-information": "warning"
} as const;
type StatusBarStatus = keyof typeof StatusMapping;

const hasUpdateRequest = ({ updateRequestStatus }: EntityFullDto) =>
  updateRequestStatus === "awaiting-approval" || updateRequestStatus === "needs-more-information";

export const getStatusProps = (
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
  const { openModal } = useModalContext();

  const entityStatus = (hasUpdateRequest(entity) ? entity.updateRequestStatus : entity.status) as StatusBarStatus;
  const needMoreInformation = entityStatus === "needs-more-information";
  const hasFeedback = needMoreInformation || entityStatus === "approved";
  const projectedEntityStatus = entityStatus == null ? undefined : StatusMapping[entityStatus];

  const statusProps = useMemo(() => getStatusProps(t, entity, entityStatus), [entity, entityStatus, t]);

  const viewFeedback = useCallback(() => {
    if (statusProps == null) return;
    openModal(
      ModalId.STATUS,
      <EntityStatusModal
        statusProps={statusProps}
        feedback={entity.feedback}
        needMoreInformation={needMoreInformation}
        entityName={entityName}
        entityUuid={entity.uuid}
      />
    );
  }, [entity.feedback, entity.uuid, entityName, needMoreInformation, openModal, statusProps]);

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
