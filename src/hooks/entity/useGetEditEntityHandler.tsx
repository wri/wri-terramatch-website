import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

import EntityInformationRequiredModal from "@/components/extensive/EntityInformationRequiredModal";
import { type StatusBarStatus, getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { FormEntity } from "@/connections/Form";
import { INFORMATION_REQUIRED, PENDING_APPROVAL } from "@/constants/statuses";
import { getEntityEditPageLink, getEntityEditPathSegment, v3EntityName } from "@/helpers/entity";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import { withReportsIndexReturn } from "@/pages/reports/report-index/reportIndex.utils";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { WarningIcon } from "@/redesignComponents/foundations/Icons/Function/WarningIcon";
import { EntityName, SingularEntityName } from "@/types/common";

interface GetEditEntityHandlerArgs {
  entityUUID: string;
  entityName: EntityName | SingularEntityName | string;
  entityStatus: string;
  updateRequestStatus: string | null;
  entityTitle?: string;
  reportTitle?: string;
  feedback?: string | null;
  useStatusModal?: boolean;
  useInformationRequiredModal?: boolean;
}

/**
 * To get edit entity handler, this will apply the shared logic to all entities.
 * Returns `handleEdit` to trigger the appropriate modal and `EditModals` to render in the component tree.
 */
export const useGetEditEntityHandler = ({
  entityName,
  entityUUID,
  entityStatus,
  updateRequestStatus,
  feedback,
  useStatusModal = false,
  entityTitle,
  reportTitle,
  useInformationRequiredModal = false
}: GetEditEntityHandlerArgs) => {
  const t = useT();
  const router = useRouter();
  const [stepId, setStepId] = useState<string | null | undefined>(undefined);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openReviewInProgressModal, setOpenReviewInProgressModal] = useState(false);
  const [openConfirmEditModal, setOpenConfirmEditModal] = useState(false);
  const pendingStepId = useRef<string | null | undefined>(undefined);
  const { getReadableEntityName } = useGetReadableEntityName();
  const editEntityName = getEntityEditPathSegment(entityName as EntityName | SingularEntityName);
  const formEntityName = v3EntityName(entityName as EntityName | SingularEntityName) as FormEntity;
  const hasRelevantUpdateRequest =
    updateRequestStatus === PENDING_APPROVAL || updateRequestStatus === INFORMATION_REQUIRED;
  const effectiveStatus = (hasRelevantUpdateRequest ? updateRequestStatus : entityStatus) as StatusBarStatus;
  const awaitingApproval = entityStatus === PENDING_APPROVAL || updateRequestStatus === PENDING_APPROVAL;
  const needsMoreInformation = entityStatus === INFORMATION_REQUIRED || updateRequestStatus === INFORMATION_REQUIRED;
  const shouldShowInformationRequiredModal = useInformationRequiredModal && needsMoreInformation && !awaitingApproval;
  const shouldShowStatusFeedbackModal = useStatusModal && needsMoreInformation && !awaitingApproval;
  const statusProps = getStatusProps(
    t,
    { status: entityStatus, updateRequestStatus } as Parameters<typeof getStatusProps>[1],
    effectiveStatus
  );

  let editTitle = t("Edit {entityName}?", {
    entityName: getReadableEntityName(entityName as EntityName | SingularEntityName, true)
  });

  let editContent: string = t(
    "Are you sure you want to edit {entityTitle} {reportTitle} Editing this {entityName} will require it to be resubmitted for approval.",
    {
      entityTitle: (
        <Text as="span" textStyle="400-bold">
          {entityTitle ?? ""}
        </Text>
      ),
      reportTitle: (
        <>
          <Text as="span" textStyle="400-bold">
            {reportTitle ?? getReadableEntityName(entityName as EntityName | SingularEntityName, true)}
          </Text>
          ?<br />
          <br />
        </>
      ),
      entityName: getReadableEntityName(entityName as EntityName | SingularEntityName, true)
    }
  );

  const handleEdit = (stepId?: string | null) => {
    if (awaitingApproval) {
      setOpenReviewInProgressModal(true);
    } else if (shouldShowInformationRequiredModal || (shouldShowStatusFeedbackModal && statusProps != null)) {
      setStepId(stepId);
      setOpenStatusModal(true);
    } else {
      pendingStepId.current = stepId;
      if (entityStatus === "draft") {
        router.push(`/entity/${editEntityName}/edit/${entityUUID}?mode=edit`);
        return;
      }
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
                "While we review your {entityName}, it is closed for editing. A Reviewer will either approve this {entityName} or request more information. If you have any questions or have critical changes to make in the meantime, please contact {email} with the details.",
                {
                  entityName: getReadableEntityName(entityName as EntityName | SingularEntityName, true),
                  email: (
                    <a href="mailto:info@terramatch.org" className="text-primary-500 underline">
                      info@terramatch.org
                    </a>
                  )
                }
              )}
            </Text>
          </Flex>
        }
        buttonsCancel={[
          {
            id: "cancel",
            className: "w-fit",
            variant: "secondary",
            children: t("Close"),
            onClick: () => setOpenReviewInProgressModal(false)
          }
        ]}
      />
      {useInformationRequiredModal ? (
        <EntityInformationRequiredModal
          feedback={feedback}
          entityName={formEntityName}
          entityUuid={entityUUID}
          formStepId={stepId}
          open={openStatusModal}
          onOpenChange={setOpenStatusModal}
        />
      ) : (
        statusProps != null && (
          <EntityStatusModal
            statusProps={statusProps}
            feedback={feedback}
            showProvideFeedback={shouldShowStatusFeedbackModal}
            entityName={formEntityName}
            entityUuid={entityUUID}
            formStepId={stepId}
            open={openStatusModal}
            onOpenChange={setOpenStatusModal}
          />
        )
      )}
      <ModalConfirmation
        open={openConfirmEditModal}
        onOpenChange={open => setOpenConfirmEditModal(open)}
        title={editTitle}
        content={editContent}
        classNameGroup="!w-full"
        buttonsCancel={[
          {
            id: "cancel",
            className: "!w-full",
            variant: "secondary",
            children: useInformationRequiredModal ? t("Close") : t("Cancel"),
            onClick: () => setOpenConfirmEditModal(false)
          }
        ]}
        buttonsPrimary={[
          {
            id: "edit",
            className: "!w-full",
            variant: "primary",
            children: t("Edit"),
            onClick: () => {
              setOpenConfirmEditModal(false);
              const stepId = pendingStepId.current;
              const from = typeof router.query.from === "string" ? router.query.from : undefined;
              if (stepId != null) {
                router.push(
                  withReportsIndexReturn(
                    `/entity/${editEntityName}/edit/${entityUUID}?${STEP_QUERY_PARAM}=${encodeURIComponent(stepId)}`,
                    from
                  )
                );
              } else if (entityStatus === "approved") {
                router.push(withReportsIndexReturn(getEntityEditPageLink(entityName, entityUUID), from));
              } else {
                router.push(withReportsIndexReturn(`/entity/${editEntityName}/edit/${entityUUID}?mode=edit`, from));
              }
            }
          }
        ]}
      />
    </>
  );

  return { handleEdit, EditModals };
};
