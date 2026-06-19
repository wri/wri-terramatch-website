import { Button, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Modal } from "@worldresources/wri-design-systems";
import { useRouter } from "next/router";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { useModalContext } from "@/context/modal.provider";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { EntityName } from "@/types/common";

interface GetEditEntityHandlerArgs {
  entityUUID: string;
  entityName: EntityName;
  entityStatus: string;
  updateRequestStatus: string | null;
}

/**
 * To get edit entity handler, this will apply the shared logic to all entities.
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
  const readableEntityNameSingular = (getReadableEntityName(entityName, true) ?? t("Entity")).toLowerCase();
  let editTitle = t("Are you sure you want to edit your {entityName}?", {
    entityName: getReadableEntityName(entityName)
  });
  let editContent = t(
    "Are you sure you want to edit this {entityName}? Please note that these changes will need to be approved.",
    {
      entityName: getReadableEntityName(entityName)
    }
  );

  if (entityStatus === "started") {
    editTitle = t("Continue working on draft {entityName}?", {
      entityName: readableEntityNameSingular
    });
    editContent = t(
      'By clicking "Edit," you\'ll access your draft {entityName}. You can edit the {entityName} contents and either save it as a draft again, or click to the end and press "Submit" to send it to your project manager for review.',
      { entityName: readableEntityNameSingular }
    );
  }

  const handleEdit = (stepId?: string | null) => {
    if (entityStatus === "awaiting-approval" || updateRequestStatus === "awaiting-approval") {
      openModal(
        ModalId.REVIEW_IN_PROGRESS,
        <Modal
          open={true}
          header={t("Review in Progress")}
          content={
            <Text>
              {t(
                "While we're reviewing your {entityName}, you can't make changes for now. This ensures a thorough review. After it's done, you can make any needed adjustments.</br></br>If you have any questions or concerns, contact our support team through the help center.",
                { entityName: getReadableEntityName(entityName) }
              )}
            </Text>
          }
          footer={<Button onClick={() => closeModal(ModalId.REVIEW_IN_PROGRESS)}>{t("Close")}</Button>}
          onClose={() => {
            closeModal(ModalId.REVIEW_IN_PROGRESS);
          }}
        />
      );
    } else {
      openModal(
        ModalId.CONFIRM_EDIT,
        <ModalConfirmation
          title={editTitle}
          content={editContent}
          open={true}
          onOpenChange={() => closeModal(ModalId.CONFIRM_EDIT)}
          buttonsCancel={[{ id: "cancel", children: t("Cancel"), onClick: () => closeModal(ModalId.CONFIRM_EDIT) }]}
          buttonsPrimary={[
            {
              id: "edit",
              children: t("Edit"),
              onClick: () => {
                if (stepId != null) {
                  router.push(
                    `/entity/${entityName}/edit/${entityUUID}?${STEP_QUERY_PARAM}=${encodeURIComponent(stepId)}`
                  );
                } else {
                  router.push(`/entity/${entityName}/edit/${entityUUID}?mode=edit`);
                }
                closeModal(ModalId.CONFIRM_EDIT);
              }
            }
          ]}
        />
      );
    }
  };

  return { handleEdit };
};
