import { useT } from "@transifex/react";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { useModalContext } from "@/context/modal.provider";
import { useToastContext } from "@/context/toast.provider";
import { useDeleteV2FormsSubmissionsUUID, usePostV2FormsSubmissionsUUIDNextStage } from "@/generated/apiComponents";
import { ApplicationRead, StageRead } from "@/generated/apiSchemas";
import { Colors } from "@/types/common";

interface ApplicationStatusProps {
  application: ApplicationRead;
}

interface StatusProps {
  title: string;
  subtitle?: string;
  color?: Colors;
  icon: IconNames;
  primaryAction?: IButtonProps;
  secondaryAction?: IButtonProps;
}

const ApplicationStatus = ({ application }: ApplicationStatusProps) => {
  const currentSubmission = application?.current_submission;
  //@ts-ignore
  const stages = application?.funding_programme?.stages?.data as StageRead[];
  const fundingProgrammeStatus = application?.funding_programme?.status;

  const t = useT();
  const router = useRouter();
  const uuid = router.query.id as string;
  const { openModal, closeModal } = useModalContext();
  const { openToast } = useToastContext();

  const currentStage = stages?.find(s => s.uuid === currentSubmission?.form?.stage_id);
  const nextStage = stages?.find(s => s.uuid === currentSubmission?.next_stage_uuid);
  const isFirstStage = application?.form_submissions?.length === 1;

  const { mutate: submitToNextStage, isLoading } = usePostV2FormsSubmissionsUUIDNextStage({
    onSuccess(data, variables, context) {
      // @ts-expect-error
      router.push(`/form/submission/${data?.data?.uuid}/intro`);
    }
  });

  const { mutate: deleteFormSubmission } = useDeleteV2FormsSubmissionsUUID({
    onSuccess() {
      openToast(t("Deleted Draft"));
      if (isFirstStage) {
        router.replace("/home");
      } else {
        window.location.reload();
      }

      closeModal();
    },
    onError() {
      openToast(t("Error Deleting Draft"));
      router.replace("/home");
    }
  });

  const statusProps = useMemo((): StatusProps | null => {
    switch (currentSubmission?.status) {
      case "started":
        return {
          title: t("Status: Draft"),
          subtitle: t(
            `This application is currently in draft status. To continue completing your application, please click the "Continue Application" button below. If you wish, you can delete the application by selecting the "Delete Draft" option.`
          ),
          color: undefined,
          icon: IconNames.EDIT_CIRCLE,
          primaryAction: {
            as: fundingProgrammeStatus === "disabled" ? "button" : Link,
            href: fundingProgrammeStatus === "disabled" ? undefined : `/form/submission/${currentSubmission.uuid}`,
            children: t("Continue Application"),
            onClick: () => {
              if (fundingProgrammeStatus === "disabled") {
                openModal(
                  <Modal
                    title={t("Application Closed")}
                    content={t(
                      "We're sorry to inform you that the application deadline for this opportunity has passed, and we are no longer accepting new applications.<br/><br/>We appreciate your interest in this opportunity and encourage you to keep an eye out for future openings. If you have any questions or concerns, please don't hesitate to reach out to us."
                    )}
                    primaryButtonProps={{
                      children: t("Close"),
                      onClick: closeModal
                    }}
                  />
                );
              }
            }
          },
          secondaryAction: {
            onClick: () => {
              openModal(
                <Modal
                  title={t("Are you sure you want to delete this {stageName} draft?", {
                    stageName: currentStage?.name
                  })}
                  content={
                    isFirstStage
                      ? t(
                          "When you delete this draft, the form application and all its associated data will be permanently removed. Please be aware that this action cannot be undone."
                        )
                      : t(
                          `Please note that this action will permanently remove all data associated with this draft, and it cannot be undone. However, your previous application submissions for the previous stages will remain intact. If you proceed with the deletion, you will need to provide {stageName} information again from scratch.`,
                          { stageName: currentStage?.name }
                        )
                  }
                  primaryButtonProps={{
                    children: "Delete Draft",
                    onClick: () => {
                      currentSubmission.uuid && deleteFormSubmission({ pathParams: { uuid: currentSubmission.uuid } });
                    }
                  }}
                  secondaryButtonProps={{
                    children: "Cancel",
                    onClick: closeModal
                  }}
                />
              );
            },
            children: t("Delete Draft")
          }
        };

      case "awaiting-approval":
        return { title: t("Status: Awaiting Approval"), color: "primary", icon: IconNames.CLOCK };

      case "requires-more-information":
        return {
          title: t("Status: More Information Requested"),
          subtitle: currentSubmission.feedback,
          color: "tertiary",
          icon: IconNames.WARNING,
          primaryAction: {
            as: Link,
            href: `/applications/request-more-information/${uuid}`,
            children: t("Add Information")
          }
        };

      case "rejected":
        return {
          title: t("Status: Rejected"),
          subtitle: currentSubmission.feedback,
          color: "error",
          icon: IconNames.CROSS
        };

      case "approved":
        if (nextStage) {
          //There is another staging for user to go through
          return {
            title: t("Status: Application Approved! You are invited to submit {name}", { name: nextStage.name }),
            subtitle: currentSubmission.feedback,
            color: "success",
            icon: IconNames.CHECK_CIRCLE,
            primaryAction: {
              children: t("Start {name}", { name: nextStage.name }),
              onClick: () =>
                submitToNextStage({
                  pathParams: {
                    uuid: currentSubmission.uuid ?? ""
                  }
                }),
              disabled: isLoading
            }
          };
        } else {
          //All stages of the application are approved
          return {
            title: t("Status: Approved"),
            subtitle: t(
              "Congratulations! Your application has been reviewed and approved by WRI. To start your monitoring activities, simply set up your monitoring project by clicking the button below. For additional guidance, feel free to contact WRI for further instructions or explore more information in the options provided below."
            ),
            color: "success",
            icon: IconNames.CHECK_CIRCLE,
            primaryAction: {
              children: t("Set up monitoring project"),
              as: Link,
              href: "/v1/createTerrafundProgramme/terrafund"
            },
            secondaryAction: {
              children: t("Learn More"),
              iconProps: { name: IconNames.LINK, width: 14 },
              as: Link,
              href: application?.funding_programme?.read_more_url
            }
          };
        }
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubmission, t]);

  if (!statusProps) return null;

  return (
    <section
      className={cn(
        "flex gap-6 rounded-lg bg-white p-6 shadow",
        !!statusProps?.color && `border border-${statusProps?.color}`
      )}
    >
      <Icon
        name={statusProps.icon}
        className={cn(
          "mt-1 min-w-[32px]",
          `fill-${statusProps.color || "neutral-800"}`,
          `stroke-${statusProps.color || "neutral-800"}`
        )}
        height={32}
        width={32}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4">
          <Text variant="text-heading-600">{statusProps.title}</Text>
          <When condition={!!statusProps.subtitle}>
            <Text variant="text-heading-100">{statusProps.subtitle}</Text>
          </When>
        </div>
        <div className="flex flex-col">
          <When condition={!!currentSubmission?.feedback_fields}>
            <div className="mt-6 flex flex-col gap-2">
              <Text variant="text-body-900">{t("Provide more information for the following fields:")}</Text>
              <Text variant="text-heading-100">{currentSubmission?.feedback_fields?.join(", ")}</Text>
            </div>
          </When>
          <When condition={!!statusProps.secondaryAction || !!statusProps.primaryAction}>
            <div className="mt-8 flex flex-wrap items-start gap-4">
              {!!statusProps.secondaryAction && <Button {...statusProps.secondaryAction} variant="secondary" />}
              {!!statusProps.primaryAction && <Button {...statusProps.primaryAction} />}
            </div>
          </When>
        </div>
      </div>
    </section>
  );
};

export default ApplicationStatus;
