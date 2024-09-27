import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import Button from "@/components/elements/Button/Button";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import { useModalContext } from "@/context/modal.provider";
import { usePutV2TasksUUIDSubmit } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import { useReportingWindow } from "@/hooks/useReportingWindow";

interface ReportingTaskHeaderProps {
  project: any;
  reportingTask: any;
  reports: any;
}

const ReportingTaskHeader = ({ project, reportingTask, reports }: ReportingTaskHeaderProps) => {
  const t = useT();
  const { format } = useDate();
  const { openModal, closeModal } = useModalContext();
  const router = useRouter();

  const { mutate: submitReportingTask } = usePutV2TasksUUIDSubmit({
    onSuccess() {
      openModal(
        ModalId.REPORTS_SUBMITTED,
        <Modal
          title={t("Reports submitted")}
          content={t(
            "Your reports have been submitted. You can view them in the ‘completed’ reports sections in your project page"
          )}
          iconProps={{
            height: 60,
            width: 60,
            className: "fill-secondary",
            name: IconNames.EXCLAMATION_CIRCLE
          }}
          primaryButtonProps={{
            children: "Close",
            onClick: () => {
              closeModal(ModalId.REPORTS_SUBMITTED);
              router.replace(`/project/${project.uuid}?tab=reporting-tasks`);
            }
          }}
        />
      );
    }
  });

  const ModalsMapping = {
    ready_to_submit: {
      title: t("Are you sure you want to submit these reports?"),
      content: t("Sending these reports will forward all the information to WRI for review."),
      primaryButtonProps: {
        children: t("Submit Reports"),
        onClick: () => {
          submitReportingTask({ pathParams: { uuid: reportingTask.uuid } });
          closeModal(ModalId.MODALS_MAPPING);
        }
      },
      secondaryButtonProps: {
        children: t("Cancel"),
        onClick: closeModal
      }
    },

    has_mandatory: {
      title: t("Complete Mandatory Task"),
      content: t(
        "Please complete the mandatory task before submitting your reports. You won't be able to submit until it's done."
      ),
      primaryButtonProps: {
        children: t("Close"),
        onClick: () => closeModal(ModalId.MODALS_MAPPING)
      }
    },

    has_outstanding_tasks: {
      title: t("Are you sure you want to submit these reports? You currently have {count} outstanding reports", {
        count: reports.outstandingAdditionalCount
      }),
      content: t("Sending these reports will forward all the information to WRI for review."),
      primaryButtonProps: {
        children: t("Submit Reports"),
        onClick: () => {
          submitReportingTask({ pathParams: { uuid: reportingTask.uuid } });
          closeModal(ModalId.MODALS_MAPPING);
        }
      },
      secondaryButtonProps: {
        children: t("Cancel"),
        onClick: closeModal
      }
    }
  };

  const submitReportingTaskHandler = () => {
    let modalProps: any = ModalsMapping.ready_to_submit;
    if (reports.outstandingMandatoryCount > 0) {
      modalProps = ModalsMapping.has_mandatory;
    } else if (reports.outstandingAdditionalCount > 0) {
      modalProps = ModalsMapping.has_outstanding_tasks;
    }

    openModal(
      ModalId.MODALS_MAPPING,
      <Modal {...modalProps} iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }} />
    );
  };

  const window = useReportingWindow(reportingTask?.due_at);
  const title = t("Reporting Task {window}", { window });

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          { title: t("My Projects"), path: "/my-projects" },
          { title: project.name, path: `/project/${project.uuid}` },
          { title }
        ]}
      />
      <PageHeader
        className="h-[203px]"
        title={title}
        subtitles={[t("Due by {due_at}", { due_at: format(reportingTask?.due_at, "d MMMM, yyyy, HH:mm") })]}
        hasBackButton={false}
      >
        <Button id="submit-button" onClick={submitReportingTaskHandler}>
          {t("Submit Report")}
        </Button>
      </PageHeader>
    </>
  );
};

export default ReportingTaskHeader;
