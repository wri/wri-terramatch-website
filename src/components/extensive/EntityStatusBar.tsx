import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import Button from "@/components/elements/Button/Button";
import StatusBar from "@/components/elements/StatusBar/StatusBar";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { EntityFullDto } from "@/connections/Entity";
import { FormEntity } from "@/connections/Form";

import EntityStatusModal, { StatusProps } from "./EntityStatusModal";

type EntityStatusBarProps = {
  entityName: FormEntity;
  entity: EntityFullDto;
};

const StatusMapping = {
  draft: "edit",
  due: "edit",
  approved: "success",
  "pending-approval": "awaiting",
  "information-required": "warning"
} as const;
export type StatusBarStatus = keyof typeof StatusMapping;

const hasUpdateRequest = ({ updateRequestStatus }: EntityFullDto) =>
  updateRequestStatus === "pending-approval" || updateRequestStatus === "information-required";

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

    case "information-required":
      return {
        title: t(`${titlePrefix} Information Required`),
        icon: IconNames.EXCLAMATION_CIRCLE_FILL,
        className: "fill-tertiary"
      };

    case "pending-approval":
      return {
        title: t(`${titlePrefix} Pending Approval`),
        icon: IconNames.CLOCK,
        className: "fill-primary"
      };

    default:
      return undefined;
  }
};

const EntityStatusBar: FC<EntityStatusBarProps> = ({ entityName, entity }) => {
  const t = useT();
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const entityStatus = (hasUpdateRequest(entity) ? entity.updateRequestStatus : entity.status) as StatusBarStatus;
  const needMoreInformation = entityStatus === "information-required";
  const hasFeedback = needMoreInformation || entityStatus === "approved";
  const projectedEntityStatus = entityStatus == null ? undefined : StatusMapping[entityStatus];

  const statusProps = useMemo(() => getStatusProps(t, entity, entityStatus), [entity, entityStatus, t]);

  const viewFeedback = useCallback(() => {
    if (statusProps == null) return;
    setOpenStatusModal(true);
  }, [statusProps]);

  return projectedEntityStatus == null ? null : (
    <StatusBar status={projectedEntityStatus} title={statusProps?.title ?? ""}>
      <EntityStatusModal
        statusProps={statusProps!}
        feedback={entity.feedback}
        needMoreInformation={needMoreInformation}
        entityName={entityName}
        entityUuid={entity.uuid}
        open={openStatusModal}
        onOpenChange={setOpenStatusModal}
      />
      {hasFeedback ? (
        <Button variant="secondary" onClick={viewFeedback}>
          {t("View Feedback")}
        </Button>
      ) : null}
    </StatusBar>
  );
};

export default EntityStatusBar;
