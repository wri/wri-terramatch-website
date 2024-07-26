import { useT } from "@transifex/react";
import Link from "next/link";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import StatusBar from "@/components/elements/StatusBar/StatusBar";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import { GetV2UpdateRequestsENTITYUUIDResponse, useDeleteV2UpdateRequestsUUID } from "@/generated/apiComponents";
import { EntityName } from "@/types/common";

interface UpdateRequestStatusBarProps {
  entityName: EntityName;
  entityUUID: string;
  updateRequest: GetV2UpdateRequestsENTITYUUIDResponse;
}

const UpdateRequestStatusBar = ({ entityName, entityUUID, updateRequest }: UpdateRequestStatusBarProps) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const { mutateAsync: deleteUpdateRequest, isLoading, isSuccess } = useDeleteV2UpdateRequestsUUID();
  //@ts-ignore
  const feedback = updateRequest.feedback || "";
  const status = updateRequest.status || "";

  const projectStatus = getActionCardStatusMapper(t)[status]?.status;
  if (!projectStatus) return null;

  const statusMapping: any = {
    approved: {
      title: t("Change Request Status: Approved"),
      icon: IconNames.CHECK_CIRCLE_FILL,
      className: "fill-secondary",
      primaryButtonProps: {
        children: t("Acknowledge"),
        disabled: isLoading || isSuccess,
        onClick: async () => {
          await deleteUpdateRequest({ pathParams: { uuid: updateRequest.uuid! } });
          location.reload();
        }
      }
    },
    "awaiting-approval": {
      title: t("Change Request Status: Awaiting approval"),
      icon: IconNames.CLOCK,
      className: "fill-primary"
    },
    "needs-more-information": {
      title: t("Change Request Status: More Info Requested"),
      icon: IconNames.EXCLAMATION_CIRCLE_FILL,
      className: "fill-tertiary",
      primaryButtonProps: {
        as: Link,
        children: t("Provide Feedback"),
        href: `/entity/${entityName}/edit/${entityUUID}?mode=provide-feedback-change-request`,
        onClick: () => {
          closeModal(ModalId.CHANGE_REQUEST_STATUS);
        }
      },
      secondaryButtonProps: {
        children: t("Close"),
        onClick: () => closeModal(ModalId.CHANGE_REQUEST_STATUS)
      }
    }
  };
  const statusProps = statusMapping?.[status];

  const viewFeedback = () => {
    openModal(
      ModalId.CHANGE_REQUEST_STATUS,
      <Modal
        iconProps={{ name: statusProps.icon, width: 60, height: 60, className: statusProps.className }}
        title={statusProps.title}
        content={feedback || t("No feedback provided")}
        primaryButtonProps={statusProps.primaryButtonProps}
        secondaryButtonProps={statusProps.secondaryButtonProps}
      />
    );
  };

  return (
    <StatusBar status={projectStatus} title={statusProps?.title || ""}>
      <When condition={status !== "awaiting-approval"}>
        <Button variant="secondary" onClick={viewFeedback}>
          {t("View Feedback")}
        </Button>
      </When>
    </StatusBar>
  );
};

export default UpdateRequestStatusBar;
