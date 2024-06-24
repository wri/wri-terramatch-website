import { useT } from "@transifex/react";
import Link from "next/link";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import StatusBar from "@/components/elements/StatusBar/StatusBar";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { useModalContext } from "@/context/modal.provider";
import { EntityName, Status } from "@/types/common";

interface EntityStatusBarProps {
  entityName: EntityName;
  entity: any;
}

const StatusMapping: { [index: string]: Status } = {
  started: "edit",
  due: "edit",
  approved: "success",
  "awaiting-approval": "awaiting",
  awaiting: "awaiting",
  pending: "awaiting",
  "needs-more-information": "warning",
  "nothing-to-report": "warning"
};

const EntityStatusBar = ({ entityName, entity }: EntityStatusBarProps) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();

  const feedback = entity.feedback;
  const entityStatus = entity.status;
  const needMoreInformation = entityStatus === "needs-more-information";
  const hasFeedback = needMoreInformation || entityStatus === "approved";
  const projectedEntityStatus = StatusMapping?.[entityStatus];

  if (!projectedEntityStatus) return null;

  const viewFeedback = () => {
    const statusPropsMapping: any = {
      approved: {
        title: t("Status: Approved"),
        icon: IconNames.CHECK_CIRCLE_FILL,
        className: "fill-secondary"
      },
      "needs-more-information": {
        title: t("Status: More Info Requested"),
        icon: IconNames.EXCLAMATION_CIRCLE_FILL,
        className: "fill-tertiary"
      }
    };
    const statusProps = statusPropsMapping?.[entityStatus];

    openModal(
      <Modal
        className="min-w-[500px]"
        iconProps={{ name: statusProps.icon, width: 60, height: 60, className: statusProps.className }}
        title={statusProps.title}
        content={feedback || t("No feedback provided")}
        primaryButtonProps={
          needMoreInformation
            ? {
                as: Link,
                children: t("Provide Feedback"),
                href: `/entity/${entityName}/edit/${entity.uuid}?mode=provide-feedback-entity`,
                onClick: () => {
                  closeModal();
                }
              }
            : {
                children: t("Close"),
                onClick: closeModal
              }
        }
        secondaryButtonProps={
          needMoreInformation
            ? {
                children: t("Close"),
                onClick: closeModal
              }
            : undefined
        }
      />
    );
  };

  return (
    <StatusBar status={projectedEntityStatus} description="">
      <When condition={hasFeedback}>
        <Button variant="secondary" onClick={viewFeedback}>
          {t("View Feedback")}
        </Button>
      </When>
    </StatusBar>
  );
};

export default EntityStatusBar;
