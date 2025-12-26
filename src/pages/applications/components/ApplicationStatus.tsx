import { useT } from "@transifex/react";
import cn from "classnames";
import { last } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useSubmission, useSubmissionCreate } from "@/connections/FormSubmission";
import { useFundingProgramme } from "@/connections/FundingProgramme";
import { useModalContext } from "@/context/modal.provider";
import {
  GetV2ReportingFrameworksAccessCodeACCESSCODEResponse,
  useGetV2ReportingFrameworksAccessCodeACCESSCODE
} from "@/generated/apiComponents";
import { ApplicationDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { Colors } from "@/types/common";
import Log from "@/utils/log";

interface ApplicationStatusProps {
  application?: ApplicationDto;
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
  const { uuid: submissionUuid } = last(application?.submissions) ?? {};
  const [, { data: currentSubmission }] = useSubmission({ id: submissionUuid, enabled: submissionUuid != null });
  const [, { data: fundingProgramme }] = useFundingProgramme({
    id: application?.fundingProgrammeUuid ?? undefined,
    enabled: application?.fundingProgrammeUuid != null
  });
  const stages = fundingProgramme?.stages;
  const fundingProgrammeStatus = fundingProgramme?.status;
  const t = useT();
  const router = useRouter();
  const uuid = router.query.id as string;
  const { openModal, closeModal } = useModalContext();
  const { data } = useGetV2ReportingFrameworksAccessCodeACCESSCODE(
    {
      // Note: it's odd that we're using the framework key as access code. They have been made consistent
      // in the database, and when implementing this pattern in v3, the framework should be fetched
      // by framework key instead.
      pathParams: { accessCode: fundingProgramme?.framework ?? "" }
    },
    {
      enabled: fundingProgramme?.framework != null,
      onError() {
        // override error toast
      }
    }
  );
  // @ts-ignore
  const reportingFramework = (data?.data ?? {}) as GetV2ReportingFrameworksAccessCodeACCESSCODEResponse;
  const stageIndex = stages?.findIndex(({ uuid }) => uuid === currentSubmission?.stageUuid);
  const nextStage =
    stageIndex != null && stages != null && stageIndex < stages.length - 1 ? stages[stageIndex + 1] : undefined;

  const [, { create, data: submission, isCreating, createFailure }] = useSubmissionCreate({});
  useRequestSuccess(
    isCreating,
    createFailure,
    useCallback(() => {
      router.push(`/form/submission/${submission?.uuid}/intro`);
    }, [router, submission?.uuid]),
    "Form submission creation failed"
  );

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
          subtitle: currentSubmission.feedback ?? undefined,
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
          title: t("Status: Not Selected"),
          subtitle: currentSubmission.feedback ?? undefined,
          color: "error",
          icon: IconNames.CROSS_CIRCLE
        };

      case "approved":
        if (nextStage != null) {
          return {
            title: t("Status: Application Approved! You are invited to submit {name}", { name: nextStage.name }),
            subtitle: currentSubmission.feedback ?? undefined,
            color: "success",
            icon: IconNames.CHECK_CIRCLE,
            primaryAction: {
              children: t("Start {name}", { name: nextStage.name }),
              onClick: () => {
                if (fundingProgramme?.uuid == null) {
                  Log.error("Funding programme UUID is missing");
                } else {
                  create({
                    fundingProgrammeUuid: fundingProgramme.uuid,
                    nextStageFromSubmissionUuid: currentSubmission.uuid
                  });
                }
              },
              disabled: isCreating
            }
          };
        } else {
          //All stages of the application are approved
          return {
            title: t("Status: Approved"),
            subtitle: t(
              reportingFramework.slug == null
                ? "Congratulations! Your application has been reviewed and approved. Please check back soon to set up your project. For additional guidance, feel free to contact your project manager for further instructions or email info@terramatch.org"
                : "Congratulations! Your application has been reviewed and approved by WRI. To start your monitoring activities, simply set up your monitoring project by clicking the button below. For additional guidance, feel free to contact WRI for further instructions or explore more information in the options provided below."
            ),
            color: "success",
            icon: IconNames.CHECK_CIRCLE,
            primaryAction:
              reportingFramework.slug == null
                ? undefined
                : {
                    children: t("Set up monitoring project"),
                    as: Link,
                    href: `/entity/projects/create/${reportingFramework.slug}?parent_name=application&parent_uuid=${application?.uuid}`
                  },
            secondaryAction:
              fundingProgramme?.readMoreUrl == null
                ? undefined
                : {
                    children: t("Learn More"),
                    iconProps: { name: IconNames.LINK, width: 14 },
                    as: Link,
                    href: fundingProgramme.readMoreUrl ?? undefined
                  }
          };
        }
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubmission, reportingFramework, application, t]);

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
          {statusProps.subtitle != null ? <Text variant="text-heading-100">{statusProps.subtitle}</Text> : null}
        </div>
        <div className="flex flex-col">
          {currentSubmission?.translatedFeedbackFields != null ? (
            <div className="mt-6 flex flex-col gap-2">
              <Text variant="text-body-900">{t("Provide more information for the following fields:")}</Text>
              <Text variant="text-heading-100">{currentSubmission.translatedFeedbackFields.join(", ")}</Text>
            </div>
          ) : null}
          {statusProps.secondaryAction != null || statusProps.primaryAction != null ? (
            <div className="mt-8 flex flex-wrap items-start gap-4">
              {statusProps.secondaryAction != null ? (
                <Button {...statusProps.secondaryAction} variant="secondary" />
              ) : null}
              {statusProps.primaryAction != null ? <Button {...statusProps.primaryAction} /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ApplicationStatus;
