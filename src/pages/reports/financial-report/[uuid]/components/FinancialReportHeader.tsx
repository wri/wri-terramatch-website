import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { FinancialReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";

type FinancialReportHeaderProps = {
  financialReport?: FinancialReportFullDto;
};

const FinancialReportHeader: FC<FinancialReportHeaderProps> = ({ financialReport }) => {
  const t = useT();

  if (financialReport == null) return null;

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler("financial-reports", financialReport.uuid);

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "financial-reports",
    entityUUID: financialReport.uuid,
    entityStatus: financialReport.status,
    updateRequestStatus: financialReport.updateRequestStatus
  });
  return (
    <PageHeader
      className="h-[203px]"
      title={t("Financial Report {createdAt}", {
        createdAt: financialReport.createdAt == null ? "" : new Date(financialReport.createdAt).toLocaleDateString()
      })}
      subtitles={[t("Organisation: {name}", { name: financialReport.organisationName })]}
      hasBackButton={false}
    >
      <div className="flex gap-4">
        {!financialReport.nothingToReport && (
          <Button variant="secondary" onClick={handleExport}>
            {t("Export")}
            <InlineLoader loading={exportLoader} />
          </Button>
        )}
        <Button onClick={() => handleEdit()}>{t("Edit")}</Button>
      </div>
    </PageHeader>
  );
};

export default FinancialReportHeader;
