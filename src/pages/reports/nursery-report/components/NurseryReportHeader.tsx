import { useT } from "@transifex/react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

interface NurseryReportHeaderProps {
  report: any;
  title: string;
}

const NurseryReportHeader = ({ report, title }: NurseryReportHeaderProps) => {
  const t = useT();

  const { handleExport } = useGetExportEntityHandler("nursery-reports", report.uuid, report.name);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nursery-reports",
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.update_request_status
  });

  const frameworkSubtitle = useFrameworkTitle();

  return (
    <PageHeader
      className="h-[203px]"
      title={title}
      subtitles={[t("Organisation: {org}", { org: report.organisation?.name }), frameworkSubtitle]}
      hasBackButton={false}
    >
      <div className="flex gap-4">
        <When condition={!report.nothing_to_report}>
          <Button variant="secondary" onClick={handleExport}>
            {t("Export")}
          </Button>
        </When>
        <Button onClick={handleEdit}>{t("Edit")}</Button>
      </div>
    </PageHeader>
  );
};

export default NurseryReportHeader;
