import { useT } from "@transifex/react";
import Link from "next/link";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { SrpReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

interface SocioEconomicReportHeaderProps {
  socioEconomicReport: SrpReportFullDto;
}

const SocioEconomicReportHeader = ({ socioEconomicReport }: SocioEconomicReportHeaderProps) => {
  const t = useT();

  if (!socioEconomicReport) return null;

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler(
    "srp-reports",
    socioEconomicReport.uuid,
    `Annual Socio-Economic Report - ${socioEconomicReport.organisationName}`
  );

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "srp-reports",
    entityUUID: socioEconomicReport?.uuid,
    entityStatus: socioEconomicReport?.status,
    updateRequestStatus: socioEconomicReport?.updateRequestStatus
  });

  const title = `Annual Socio-Economic Report ${
    socioEconomicReport?.createdAt ? new Date(socioEconomicReport?.createdAt).toLocaleDateString() : ""
  }`;

  const subtitles = [
    socioEconomicReport?.projectName,
    `${t("Organisation")}: ${socioEconomicReport?.organisationName}`,
    useFrameworkTitle()
  ];

  return (
    <PageHeader className="h-[203px]" title={title} subtitles={subtitles} hasBackButton={false}>
      {socioEconomicReport?.status === "started" && (
        <Button as={Link} href={`/entity/srp-reports/edit/${socioEconomicReport?.uuid}`}>
          {t("Continue Report")}
        </Button>
      )}
      {socioEconomicReport?.status !== "started" && (
        <div className="flex gap-4">
          <Button variant="secondary" onClick={handleExport}>
            {t("Export")}
            <InlineLoader loading={exportLoader} />
          </Button>
          <Button onClick={handleEdit}>{t("Edit")}</Button>
        </div>
      )}
    </PageHeader>
  );
};

export default SocioEconomicReportHeader;
