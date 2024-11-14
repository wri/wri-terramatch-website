import { useT } from "@transifex/react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

interface SiteReportHeaderProps {
  report: any;
  reportTitle: string;
}

const SiteReportHeader = ({ report, reportTitle }: SiteReportHeaderProps) => {
  const t = useT();

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler(
    "site-reports",
    report.uuid,
    `${report.site.name} - ${report.report_title}`
  );
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "site-reports",
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.update_request_status
  });

  const frameworkTitle = useFrameworkTitle();

  return (
    <PageHeader
      className="h-[203px]"
      title={reportTitle}
      subtitles={[`${t("Organisation")}: ${report.organisation?.name}`, frameworkTitle]}
      hasBackButton={false}
    >
      <div className="flex gap-4">
        <When condition={!report.nothing_to_report}>
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
