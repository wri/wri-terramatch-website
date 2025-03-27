import { useT } from "@transifex/react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

interface NurseryReportHeaderProps {
  report: NurseryReportFullDto;
  title: string;
}

const NurseryReportHeader = ({ report, title }: NurseryReportHeaderProps) => {
  const t = useT();

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler(
    "nursery-reports",
    report?.uuid,
    `${report?.nurseryName} - ${report?.reportTitle}`
  );
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nursery-reports",
    entityUUID: report?.uuid,
    entityStatus: report?.status,
    updateRequestStatus: report?.updateRequestStatus
  });

  const frameworkSubtitle = useFrameworkTitle();

  return (
    <PageHeader
      className="h-[203px]"
      title={title}
      subtitles={[t("Organisation: {org}", { org: report?.organisationName }), frameworkSubtitle]}
      hasBackButton={false}
    >
      <div className="flex gap-4">
        <When condition={!report?.nothingToReport}>
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

export default NurseryReportHeader;
