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
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import {
  useGetV2ReportingFrameworksAccessCodeACCESSCODE,
  usePostV2FormsSubmissionsUUIDNextStage
} from "@/generated/apiComponents";
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
  const currentSubmission = (application?.form_submissions ?? []).find(
    ({ uuid }) => uuid === application?.current_submission_uuid
  );
  //@ts-ignore
  const stages = application?.funding_programme?.stages?.data as StageRead[];
  const fundingProgrammeStatus = application?.funding_programme?.status;
  const currentForm: any = currentSubmission?.form;
  const t = useT();
  const router = useRouter();
  const uuid = router.query.id as string;
  const { openModal, closeModal } = useModalContext();
  const { data } = useGetV2ReportingFrameworksAccessCodeACCESSCODE({
    // TODO: using the framework key as an access code here is really confusing and needs to be updated.
    // Will be related to some general application cleanup that Ben is getting set up in an epic.
    pathParams: { accessCode: currentForm?.framework_key ? currentForm?.framework_key : "terrafund" }
  });
  //@ts-ignore
  const terrafundReportingFramework = (data?.data || {}) as GetV2ReportingFrameworksAccessCodeACCESSCODEResponse;
  //@ts-ignore
  const nextStage = stages?.find(s => s.uuid === currentSubmission?.next_stage_uuid);

  const { mutate: submitToNextStage, isLoading } = usePostV2FormsSubmissionsUUIDNextStage({
    onSuccess(data, variables, context) {
      // @ts-expect-error
      router.push(`/form/submission/${data?.data?.uuid}/intro`);
    }
  });

  const statusProps = useMemo((): StatusProps | null => {
    switch (currentSubmission?.status) {
      case "started":
        return {
          title: t("Status: Draft"),
          subtitle: t(
            `This application is currently in draft status. To continue your application, please click the "Continue Application" button below. If you need help with your application, reach out to TerraMatch support, info@terramatch.org, or click the "Contact Support" button below.`
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
                  ModalId.APPLICATION_CLOSED,
                  <Modal
                    title={t("Application Closed")}
                    content={t(
                      "We're sorry to inform you that the application deadline for this opportunity has passed, and we are no longer accepting new applications.<br/><br/>We appreciate your interest in this opportunity and encourage you to keep an eye out for future openings. If you have any questions or concerns, please don't hesitate to reach out to us."
                    )}
                    primaryButtonProps={{
                      children: t("Close"),
                      onClick: () => closeModal(ModalId.APPLICATION_CLOSED)
                    }}
                  />
                );
              }
            }
          },
          secondaryAction: {
            onClick: () => {
              window.location.href = "mailto:info@terramatch.org?subject=TerraMatch%20Application%20Support";
            },
            children: t("Contact Support")
          }
        };

      case "awaiting-approval":
        return { title: t("Status: Awaiting Approval"), color: "primary", icon: IconNames.CLOCK };

      case "requires-more-information":
        return {
          title: t("Status: More Information Requested"),
          //@ts-ignore
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
          //@ts-ignore
          subtitle: currentSubmission.feedback,
          color: "error",
          icon: IconNames.CROSS_CIRCLE
        };

      case "approved":
        if (nextStage) {
          //There is another staging for user to go through
          return {
            title: t("Status: Application Approved! You are invited to submit {name}", { name: nextStage.name }),
            //@ts-ignore
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
              href: `/entity/projects/create/${terrafundReportingFramework.slug}?parent_name=application&parent_uuid=${application.uuid}`
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
  }, [currentSubmission, terrafundReportingFramework, t]);

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
          <When
            condition={
              //@ts-ignore
              !!currentSubmission?.translated_feedback_fields
            }
          >
            <div className="mt-6 flex flex-col gap-2">
              <Text variant="text-body-900">{t("Provide more information for the following fields:")}</Text>
              <Text variant="text-heading-100">
                {
                  //@ts-ignore
                  currentSubmission?.translated_feedback_fields?.join(", ")
                }
              </Text>
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
