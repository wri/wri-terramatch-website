import { useT } from "@transifex/react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import { EntityFullDto } from "@/connections/Entity";

import { StatusProps } from "./EntityStatusModal";

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
