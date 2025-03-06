import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { useModalContext } from "@/context/modal.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useDeleteV2ProjectsUUID } from "@/generated/apiComponents";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

interface ProjectHeaderProps {
  project: any;
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const { openToast } = useToastContext();
  const router = useRouter();

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler("projects", project.uuid, project.name);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "projects",
    entityUUID: project.uuid,
    entityStatus: project.status,
    updateRequestStatus: project.update_request_status
  });

  const { mutate: deleteProject } = useDeleteV2ProjectsUUID({
    onSuccess() {
      router.push("/my-projects");
      openToast(t("The project has been successfully deleted"));
    },
    onError() {
      openToast(t("Something went wrong!"), ToastType.ERROR);
    }
  });

  const onDeleteProject = () => {
    openModal(
      ModalId.CONFIRM_PROJECT_DRAFT_DELETION,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Project Draft Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this project draft? "
        )}
        primaryButtonProps={{
          children: t("Yes"),
          onClick: () => {
            deleteProject({ pathParams: { uuid: project.uuid } });
            closeModal(ModalId.CONFIRM_PROJECT_DRAFT_DELETION);
          }
        }}
        secondaryButtonProps={{
          children: t("No"),
          onClick: () => closeModal(ModalId.CONFIRM_PROJECT_DRAFT_DELETION)
        }}
      />
    );
  };

  const subtitles = [`${t("Organisation")}: ${project?.organisationName}`, useFrameworkTitle()];

  return (
    <PageHeader className="h-[203px]" title={project.name} subtitles={subtitles} hasBackButton={false}>
      <If condition={project.status === "started"}>
        <Then>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => onDeleteProject()}>
              {t("Delete")}
            </Button>
            <Button as={Link} href={`/entity/projects/edit/${project.uuid}`}>
              {t("Continue Project")}
            </Button>
          </div>
        </Then>
        <Else>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={handleExport}>
              {t("Export")}
              <InlineLoader loading={exportLoader} />
            </Button>
            <Button onClick={handleEdit}>{t("Edit")}</Button>
          </div>
        </Else>
      </If>
    </PageHeader>
  );
};

export default ProjectHeader;
