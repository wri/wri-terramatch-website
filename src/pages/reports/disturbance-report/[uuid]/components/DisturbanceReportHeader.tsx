import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { formatDateForEnGb } from "@/admin/apiProvider/utils/entryFormat";
import Button from "@/components/elements/Button/Button";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { deleteDisturbanceReport } from "@/connections/Entity";
import { useModalContext } from "@/context/modal.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

type DisturbanceReportHeaderProps = {
  disturbanceReport?: DisturbanceReportFullDto;
};

const DisturbanceReportHeader = ({ disturbanceReport }: DisturbanceReportHeaderProps) => {
  const { openModal, closeModal } = useModalContext();
  const { openToast } = useToastContext();
  const t = useT();
  const router = useRouter();
  const frameworkTitle = useFrameworkTitle();

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler(
    "disturbance-reports",
    disturbanceReport?.uuid ?? "",
    `${disturbanceReport?.projectName ?? ""} - Disturbance Report`
  );

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "disturbance-reports",
    entityUUID: disturbanceReport?.uuid ?? "",
    entityStatus: disturbanceReport?.status ?? "",
    updateRequestStatus: disturbanceReport?.updateRequestStatus ?? ""
  });

  if (!disturbanceReport) return null;

  const disturbanceReportStatus = getActionCardStatusMapper(t)[disturbanceReport.status as string]?.status;

  const subtitles = [disturbanceReport.projectName, frameworkTitle];

  const onDeleteDisturbanceReport = () => {
    openModal(
      ModalId.CONFIRM_DISTURBANCE_REPORT_DELETION,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Disturbance Report Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this disturbance report? "
        )}
        primaryButtonProps={{
          children: t("Delete"),
          onClick: async () => {
            try {
              const projectUuid = disturbanceReport.projectUuid;
              await deleteDisturbanceReport(disturbanceReport.uuid);
              router.push(`/project/${projectUuid}?tab=reporting-tasks&subTab=disturbance-reports`);
              openToast(t("The disturbance report has been successfully deleted"));
            } catch (error) {
              openToast(t("Something went wrong!"), ToastType.ERROR);
            } finally {
              closeModal(ModalId.CONFIRM_DISTURBANCE_REPORT_DELETION);
            }
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.CONFIRM_DISTURBANCE_REPORT_DELETION)
        }}
      />
    );
  };

  return (
    <PageHeader
      className="h-[203px]"
      title={`Disturbance Report ${
        disturbanceReport?.dateOfDisturbance ? formatDateForEnGb(disturbanceReport?.dateOfDisturbance) : ""
      }`}
      subtitles={subtitles}
      hasBackButton={false}
    >
      <div className="flex gap-4">
        <Button variant="secondary" onClick={onDeleteDisturbanceReport}>
          {t("Delete")}
        </Button>

        {disturbanceReportStatus === "edit" && (
          <Button as={Link} href={`/entity/disturbance-reports/edit/${disturbanceReport.uuid}`}>
            {t("Continue Site")}
          </Button>
        )}
        {disturbanceReportStatus !== "edit" && (
          <>
            <Button variant="secondary" onClick={handleExport}>
              {t("Export")}
              <InlineLoader loading={exportLoader} />
            </Button>
            <Button onClick={handleEdit}>{t("Edit")}</Button>
          </>
        )}
      </div>
    </PageHeader>
  );
};

export default DisturbanceReportHeader;
