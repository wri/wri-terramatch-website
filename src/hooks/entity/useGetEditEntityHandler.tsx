import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { WarningIcon } from "@/redesignComponents/foundations/Icons/Function/WarningIcon";
import { EntityName } from "@/types/common";

interface GetEditEntityHandlerArgs {
  entityUUID: string;
  entityName: EntityName;
  entityStatus: string;
  updateRequestStatus: string | null;
}

/**
 * To get edit entity handler, this will apply the shared logic to all entities.
 * Returns `handleEdit` to trigger the appropriate modal and `EditModals` to render in the component tree.
 */
export const useGetEditEntityHandler = ({
  entityName,
  entityUUID,
  entityStatus,
  updateRequestStatus
}: GetEditEntityHandlerArgs) => {
  const t = useT();
  const router = useRouter();
  const [openReviewInProgressModal, setOpenReviewInProgressModal] = useState(false);
  const [openConfirmEditModal, setOpenConfirmEditModal] = useState(false);
  const pendingStepId = useRef<string | null | undefined>(undefined);
  const { getReadableEntityName } = useGetReadableEntityName();
  const readableEntityNameSingular = (getReadableEntityName(entityName, true) ?? t("Entity")).toLowerCase();

  let editTitle = t("Are you sure you want to edit your {entityName}?", {
    entityName: getReadableEntityName(entityName)
  });
  let editContent: string = t(
    "Are you sure you want to edit this {entityName}? Please note that these changes will need to be approved.",
    { entityName: getReadableEntityName(entityName) }
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
      setOpenReviewInProgressModal(true);
    } else {
      pendingStepId.current = stepId;
      setOpenConfirmEditModal(true);
    }
  };

  const EditModals = (
    <>
      <ModalConfirmation
        open={openReviewInProgressModal}
        onOpenChange={open => setOpenReviewInProgressModal(open)}
        title={t("Review in Progress")}
        content={
          <Flex flexDirection="column" gap={2} alignItems="center">
            <WarningIcon boxSize={10} color="warning.500" />
            <Text textStyle="400" color="neutral.900">
              {t(
                "While we're reviewing your {entityName}, you can't make changes for now. This ensures a thorough review. After it's done, you can make any needed adjustments.",
                {
                  entityName: getReadableEntityName(entityName)
                }
              )}
            </Text>
            <Text textStyle="400" color="neutral.900">
              {t("If you have any questions or concerns, contact our support team through the help center.")}
            </Text>
          </Flex>
        }
        buttonsCancel={[
          {
            id: "cancel",
            className: "w-fit",
            children: t("Cancel"),
            onClick: () => setOpenReviewInProgressModal(false)
          }
        ]}
      />
      <ModalConfirmation
        open={openConfirmEditModal}
        onOpenChange={open => setOpenConfirmEditModal(open)}
        title={editTitle}
        content={editContent}
        buttonsCancel={[{ id: "cancel", children: t("Cancel"), onClick: () => setOpenConfirmEditModal(false) }]}
        buttonsPrimary={[
          {
            id: "edit",
            children: t("Edit"),
            onClick: () => {
              setOpenConfirmEditModal(false);
              const stepId = pendingStepId.current;
              if (stepId != null) {
                router.push(
                  `/entity/${entityName}/edit/${entityUUID}?${STEP_QUERY_PARAM}=${encodeURIComponent(stepId)}`
                );
              } else {
                router.push(`/entity/${entityName}/edit/${entityUUID}?mode=edit`);
              }
            }
          }
        ]}
      />
    </>
  );

  return { handleEdit, EditModals };
};
