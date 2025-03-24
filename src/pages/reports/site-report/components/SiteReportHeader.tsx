import { useT } from "@transifex/react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

interface SiteReportHeaderProps {
  report: SiteReportFullDto;
  reportTitle: string;
}

const SiteReportHeader = ({ report, reportTitle }: SiteReportHeaderProps) => {
  const t = useT();

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler(
    "site-reports",
    report.uuid,
    `${report.siteName} - ${report.reportTitle}`
  );
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "site-reports",
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus
  });

  const frameworkTitle = useFrameworkTitle();

  return (
    <PageHeader
      className="h-[203px]"
      title={reportTitle}
      subtitles={[`${t("Organisation")}: ${report.organisationName}`, frameworkTitle]}
      hasBackButton={false}
    >
      <div className="flex gap-4">
        <When condition={!report.nothingToReport}>
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

export default SiteReportHeader;
