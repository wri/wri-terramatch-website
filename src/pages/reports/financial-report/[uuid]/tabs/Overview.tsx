import { useT } from "@transifex/react";

import FinancialDescriptionsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDescriptionsSection";
import FinancialDocumentsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDocumentsSection";
import FundingSourcesSection from "@/admin/components/ResourceTabs/HistoryTab/components/FundingSourcesSection";
import Text from "@/components/elements/Text/Text";
import Container from "@/components/generic/Layout/Container";
import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import CardFinancial from "@/pages/organization/[id]/components/financial/components/cardFinancial";
import { formatDescriptionData, formatDocumentData } from "@/utils/financialReport";

type FinancialReportOverviewTabProps = {
  report?: any;
};

const FinancialReportOverviewTab = ({ report }: FinancialReportOverviewTabProps) => {
  const t = useT();

  if (!report) {
    return (
      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        <Text variant="text-16-light">{t("No financial report data available")}</Text>
      </Container>
    );
  }

  return (
    <Container className="mx-0 flex max-w-full flex-col gap-14 px-0 pb-15">
      <Container className="max-w-full bg-neutral-50 px-0 py-16">
        <Container className="mx-auto grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-4 rounded-lg bg-white p-8 text-center shadow-all">
            <Text variant="text-24-bold" className="mb-2">
              {t("Basic Info")}
            </Text>
            <div className="flex flex-col gap-1">
              <Text variant="text-16-light">{t("Local Currency")}</Text>
              <Text variant="text-20-bold">
                {report?.currency
                  ? getCurrencyOptions(t).find(opt => opt.value == report?.currency)?.title
                  : "Not Provided"}
              </Text>
            </div>
            <div className="flex flex-col gap-1">
              <Text variant="text-16-light">{t("Financial Year Start Month")}</Text>
              <Text variant="text-20-bold">
                {report?.fin_start_month
                  ? getMonthOptions(t).find(opt => opt.value == report?.fin_start_month)?.title
                  : "Not Provided"}
              </Text>
            </div>
          </div>
        </Container>
      </Container>

      {/* graphic */}
      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        <Text variant="text-24-bold" className="mb-2">
          {t("Financial Documents")}
        </Text>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6 ">
            <img src="/images/graphic-2.png" alt="Financial Documents" />
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
            <CardFinancial title={t("2020")} data={t("+77")} description={t("Net Profit")} />
            <CardFinancial title={t("2021")} data={t("+86")} description={t("Net Profit")} />
            <CardFinancial title={t("2022")} data={t("+67")} description={t("Net Profit")} />
            <CardFinancial title={t("2023")} data={t("+92")} description={t("Net Profit")} />
            <CardFinancial title={t("2024")} data={t("+82")} description={t("Net Profit")} />
            <CardFinancial title={t("2025")} data={t("+91")} description={t("Net Profit")} />
          </div>
        </div>
      </Container>

      {/* graphic */}
      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6 ">
            <Text variant="text-24-bold" className="mb-2">
              {t("Current Ratio by Year")}
            </Text>
            <img src="/images/graphic-3.png" alt="Financial Documents" />
          </div>
          <div className="flex h-full flex-col justify-center">
            <div className="grid h-fit grid-cols-3 gap-x-4 gap-y-4">
              <CardFinancial title={t("Latest Ratio")} data="2.4" description={t("2025")} />
              <CardFinancial title={t("5-Year Average")} data="2.4" description={t("2020 - 2025")} />
              <CardFinancial title={t("Trend")} data="+67" description={t("Improving")} />
            </div>
          </div>
        </div>
      </Container>

      <Container className="mx-auto grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Financial Documents per Year")}
          </Text>
          <FinancialDocumentsSection files={formatDocumentData(report?.financial_collection)} />
        </div>
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Descriptions of Financials per Year")}
          </Text>
          <FinancialDescriptionsSection items={formatDescriptionData(report?.financial_collection)} />
        </div>
      </Container>
      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        <Text variant="text-24-bold" className="mb-2">
          {t("Major Funding Sources by Year")}
        </Text>
        <FundingSourcesSection data={report?.funding_types} />
      </Container>
    </Container>
  );
};

export default FinancialReportOverviewTab;
