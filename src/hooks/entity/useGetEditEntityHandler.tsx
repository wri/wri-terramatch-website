import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
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

  const handleEdit = () => {
    if (entityStatus === "awaiting-approval" || updateRequestStatus === "awaiting-approval") {
      openModal(
        <Modal
          iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
          title={t("Review in Progress")}
          content={t(
            "While we're reviewing your {entityName}, you can't make changes for now. This ensures a thorough review. After it's done, you can make any needed adjustments.</br></br>If you have any questions or concerns, contact our support team through the help center.",
            { entityName: getReadableEntityName(entityName) }
          )}
          primaryButtonProps={{
            children: t("Close"),
            onClick: closeModal
          }}
        />
      );
    } else {
      openModal(
        <Modal
          iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
          title={t("Are you sure you want to edit your {entityName}?", {
            entityName: getReadableEntityName(entityName)
          })}
          content={t(
            "Are you sure you want to edit this {entityName}? Please note that these changes will need to be approved.",
            { entityName: getReadableEntityName(entityName) }
          )}
          primaryButtonProps={{
            children: t("Edit"),
            onClick: () => {
              router.push(`/entity/${entityName}/edit/${entityUUID}?mode=edit`);
              closeModal();
            }
          }}
          secondaryButtonProps={{
            children: t("Cancel"),
            onClick: closeModal
          }}
        />
      );
    }
  };

  return { handleEdit };
};
