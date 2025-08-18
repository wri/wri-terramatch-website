import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import { EntityName } from "@/types/common";

interface GetEditEntityHandlerArgs {
  entityUUID: string;
  entityName: EntityName;
  entityStatus: string;
  updateRequestStatus: string;
}

/**
 * To get edit entity handler, this will apply the shared logic to all entities.
 * @param args GetEditEntityHandlerArgs
 * @returns { handleEdit }
 */
export const useGetEditEntityHandler = ({
  entityName,
  entityUUID,
  entityStatus,
  updateRequestStatus
}: GetEditEntityHandlerArgs) => {
  const t = useT();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const { getReadableEntityName } = useGetReadableEntityName();
  let editTitle = t("Are you sure you want to edit your {entityName}?", {
    entityName: getReadableEntityName(entityName)
  });
  let editContent = t(
    "Are you sure you want to edit this {entityName}? Please note that these changes will need to be approved.",
    {
      entityName: getReadableEntityName(entityName)
    }
  );

  if (entityStatus === "approved" && updateRequestStatus === "draft") {
    editTitle = t("Continue working on draft report?");
    editContent = t(
      'By clicking "Edit," you\'ll access your draft report. You can edit the report contents and either save the report as a draft again, or click to the end and press "Submit" to send it to your project manager for review.'
    );
  }

  const handleEdit = () => {
    if (entityStatus === "awaiting-approval" || updateRequestStatus === "awaiting-approval") {
      openModal(
        ModalId.REVIEW_IN_PROGRESS,
        <Modal
          iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
          title={t("Review in Progress")}
          content={t(
            "While we're reviewing your {entityName}, you can't make changes for now. This ensures a thorough review. After it's done, you can make any needed adjustments.</br></br>If you have any questions or concerns, contact our support team through the help center.",
            { entityName: getReadableEntityName(entityName) }
          )}
          primaryButtonProps={{
            children: t("Close"),
            onClick: () => closeModal(ModalId.REVIEW_IN_PROGRESS)
          }}
        />
      );
    } else {
      openModal(
        ModalId.CONFIRM_EDIT,
        <Modal
          iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
          title={editTitle}
          content={editContent}
          primaryButtonProps={{
            children: t("Edit"),
            onClick: () => {
              router.push(`/entity/${entityName}/edit/${entityUUID}?mode=edit`);
              closeModal(ModalId.CONFIRM_EDIT);
            }
          }}
          secondaryButtonProps={{
            children: t("Cancel"),
            onClick: () => closeModal(ModalId.CONFIRM_EDIT)
          }}
        />
      );
    }
  };

  return { handleEdit };
};
