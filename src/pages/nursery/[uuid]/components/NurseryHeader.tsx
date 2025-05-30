import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { deleteNursery } from "@/connections/Entity";
import { useModalContext } from "@/context/modal.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

interface NurseryHeaderProps {
  nursery: any;
}

const NurseryHeader = ({ nursery }: NurseryHeaderProps) => {
  const t = useT();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const { openToast } = useToastContext();

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler("nurseries", nursery?.uuid, nursery?.name);

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: nursery?.uuid,
    entityStatus: nursery?.status,
    updateRequestStatus: nursery?.updateRequestStatus
  });

  const subtitles = [t("Project name: {project}", { project: nursery?.projectName }), useFrameworkTitle()];

  const onDeleteNursery = () => {
    openModal(
      ModalId.CONFIRM_NURSERY_DELETION,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Nursery Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this nursery? "
        )}
        primaryButtonProps={{
          children: t("Delete"),
          onClick: async () => {
            try {
              await deleteNursery(nursery?.uuid);
              router.push("/my-projects");
              openToast(t("The nursery has been successfully deleted"));
            } catch (error) {
              openToast(t("Something went wrong!"), ToastType.ERROR);
            } finally {
              closeModal(ModalId.CONFIRM_NURSERY_DELETION);
            }
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.CONFIRM_NURSERY_DELETION)
        }}
      />
    );
  };

  return (
    <PageHeader className="h-[203px]" title={nursery?.name} subtitles={subtitles} hasBackButton={false}>
      <div className="flex gap-4">
        <When condition={nursery?.nurseryReportsTotal === 0}>
          <Button variant="secondary" onClick={onDeleteNursery}>
            {t("Delete")}
          </Button>
        </When>
        <If condition={nursery?.status === "started"}>
          <Then>
            <Button as={Link} href={`/entity/nurseries/edit/${nursery?.uuid}`}>
              {t("Continue Nursery")}
            </Button>
          </Then>
          <Else>
            <Button variant="secondary" onClick={handleExport}>
              {t("Export")}
              <InlineLoader loading={exportLoader} />
            </Button>
            <Button onClick={handleEdit}>{t("Edit")}</Button>
          </Else>
        </If>
      </div>
    </PageHeader>
  );
};

export default NurseryHeader;
