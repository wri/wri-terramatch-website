import { useT } from "@transifex/react";
import Link from "next/link";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import { FinancialReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

type FinancialReportHeaderProps = {
  financialReport?: FinancialReportFullDto;
};

const FinancialReportHeader = ({ financialReport }: FinancialReportHeaderProps) => {
  const t = useT();

  if (!financialReport) return null;

  return (
    <PageHeader
      className="h-[203px]"
      title={"Financial Report"}
      subtitles={[financialReport?.createdAt ? new Date(financialReport?.createdAt).toLocaleDateString() : ""]}
      hasBackButton={false}
    >
      <div className="flex gap-4">
        <When condition={financialReport?.status === "due"}>
          <Button as={Link} href={`/entity/financial-reports/edit/${financialReport?.uuid}`}>
            <Button>{t("Edit")}</Button>
          </Button>
        </When>
        <When condition={financialReport?.status === "started"}>
          <Button as={Link} href={`/entity/financial-reports/edit/${financialReport?.uuid}`}>
            {t("Continue Financial Report")}
          </Button>
        </When>
      </div>
    </PageHeader>
  );
};

export default FinancialReportHeader;
