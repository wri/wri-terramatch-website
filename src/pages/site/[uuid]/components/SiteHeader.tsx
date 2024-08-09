import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useDeleteV2SitesUUID } from "@/generated/apiComponents";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

interface SiteHeaderProps {
  site: any;
}

const SiteHeader = ({ site }: SiteHeaderProps) => {
  const { openModal, closeModal } = useModalContext();
  const { openToast } = useToastContext();
  const t = useT();
  const router = useRouter();
  const { framework } = useFrameworkContext();

  const siteStatus = getActionCardStatusMapper(t)[site.status]?.status;
  const { handleExport } = useGetExportEntityHandler("sites", site.uuid, site.name);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "sites",
    entityUUID: site.uuid,
    entityStatus: site.status,
    updateRequestStatus: site.update_request_status
  });

  const { mutate: deleteSite } = useDeleteV2SitesUUID({
    onSuccess() {
      router.push("/my-projects");
      openToast(t("The site has been successfully deleted"));
    },
    onError() {
      openToast(t("Something went wrong!"), ToastType.ERROR);
    }
  });

  const onDeleteSite = () => {
    openModal(
      ModalId.CONFIRM_SITE_DELETION,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Site Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this site? "
        )}
        primaryButtonProps={{
          children: t("Delete"),
          onClick: () => {
            deleteSite({ pathParams: { uuid: site.uuid } });
            closeModal(ModalId.CONFIRM_SITE_DELETION);
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.CONFIRM_SITE_DELETION)
        }}
      />
    );
  };

  const subtitles = [t("Organisation: {org}", { org: site.organisation?.name }), useFrameworkTitle()];
  if (framework === Framework.PPC) {
    subtitles.push(t("Site ID: {id}", { id: site.ppc_external_id }));
  }

  return (
    <PageHeader className="h-[203px]" title={site.name} subtitles={subtitles} hasBackButton={false}>
      <div className="flex gap-4">
        <When condition={site.site_reports_total === 0}>
          <Button variant="secondary" onClick={onDeleteSite}>
            {t("Delete")}
          </Button>
        </When>
        <If condition={siteStatus === "edit"}>
          <Then>
            <Button as={Link} href={`/entity/sites/edit/${site.uuid}`}>
              {t("Continue Site")}
            </Button>
          </Then>
          <Else>
            <Button variant="secondary" onClick={handleExport}>
              {t("Export")}
            </Button>
            <Button onClick={handleEdit}>{t("Edit")}</Button>
          </Else>
        </If>
      </div>
    </PageHeader>
  );
};

export default SiteHeader;
