import { useT } from "@transifex/react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

type DisturbanceReportHeaderProps = {
  disturbanceReport?: DisturbanceReportFullDto;
};

const DisturbanceReportHeader = ({ disturbanceReport }: DisturbanceReportHeaderProps) => {
  const t = useT();

  if (!disturbanceReport) return null;

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler(
    "disturbance-reports",
    disturbanceReport.uuid,
    `${disturbanceReport.projectName} - Disturbance Report`
  );

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "disturbance-reports",
    entityUUID: disturbanceReport.uuid,
    entityStatus: disturbanceReport.status,
    updateRequestStatus: disturbanceReport.updateRequestStatus
  });

  const subtitles = [disturbanceReport?.projectName, useFrameworkTitle()];

  return (
    <PageHeader
      className="h-[203px]"
      title={`Disturbance Report ${
        disturbanceReport?.createdAt ? new Date(disturbanceReport?.createdAt).toLocaleDateString() : ""
      }`}
      subtitles={subtitles}
      hasBackButton={false}
    >
      <div className="flex gap-4">
        <When condition={!disturbanceReport.nothingToReport}>
          <Button variant="secondary" onClick={handleExport}>
            {t("Export")}
            <InlineLoader loading={exportLoader} />
          </Button>
        </When>
        <Button onClick={handleEdit}>{t("Edit")}</Button>
      </div>
    </PageHeader>
  );
};

export default DisturbanceReportHeader;
