import { useT } from "@transifex/react";

// import { When } from "react-if";
import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import { FinancialReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
// import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
// import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";

type FinancialReportHeaderProps = {
  financialReport?: FinancialReportFullDto;
};

const FinancialReportHeader = ({ financialReport }: FinancialReportHeaderProps) => {
  const t = useT();

  if (!financialReport) return null;

  // const { handleExport, loading: exportLoader } = useGetExportEntityHandler(
  //   "financial-reports",
  //   financialReport.uuid,
  //   `${financialReport.organisationName} - Financial Report`
  // );

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "financial-reports",
    entityUUID: financialReport.uuid,
    entityStatus: financialReport.status,
    updateRequestStatus: financialReport.updateRequestStatus
  });
  return (
    <PageHeader
      className="h-[203px]"
      title={`Financial Report ${
        financialReport?.createdAt ? new Date(financialReport?.createdAt).toLocaleDateString() : ""
      }`}
      subtitles={[`${t("Organisation")}: ${financialReport?.organisationName}`]}
      hasBackButton={false}
    >
      <div className="flex gap-4">
        {/* TODO: export button temporarily disabled*/}
        {/* <When condition={!financialReport.nothingToReport}>
          <Button variant="secondary" onClick={handleExport}>
            {t("Export")}
            <InlineLoader loading={exportLoader} />
          </Button>
        </When> */}
        <Button onClick={handleEdit}>{t("Edit")}</Button>
      </div>
    </PageHeader>
  );
};

export default FinancialReportHeader;
