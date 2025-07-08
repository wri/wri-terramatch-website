import { useT } from "@transifex/react";

import FinancialDescriptionsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDescriptionsSection";
import FinancialDocumentsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDocumentsSection";
import FundingSourcesSection from "@/admin/components/ResourceTabs/HistoryTab/components/FundingSourcesSection";
import Text from "@/components/elements/Text/Text";
import Container from "@/components/generic/Layout/Container";
import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import CardFinancial from "@/pages/organization/[id]/components/financial/components/cardFinancial";
import { calculateFinancialRatioStats, formatDescriptionData, formatDocumentData } from "@/utils/financialReport";

import FinancialCurrentRatioChart from "../components/FinancialCurrentRatioChart";
import FinancialStackedBarChart from "../components/FinancialStackedBarChart";

type FinancialReportOverviewTabProps = {
  report?: any;
};

type FinancialStackedBarChartProps = {
  uuid: string;
  organisation_id: number;
  financial_report_id: number;
  collection: string;
  amount: number | null;
  year: number;
  description: string | null;
  documentation: any[];
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

  const financialRatioStats = calculateFinancialRatioStats(report?.financial_collection);

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

      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        <Text variant="text-24-bold" className="mb-2">
          {t("Financial Documents")}
        </Text>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6 ">
            <FinancialStackedBarChart data={report?.financial_collection} currency={report?.currency} />
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
            {report?.financial_collection
              .filter((item: FinancialStackedBarChartProps) => item.collection === "profit")
              .map((item: FinancialStackedBarChartProps) => (
                <CardFinancial
                  key={item.uuid}
                  title={t(item.year.toString())}
                  data={item.amount && item.amount > 0 ? `+${item.amount}` : item.amount ? `-${item.amount}` : "0"}
                  description={t("Net Profit")}
                />
              ))}
          </div>
        </div>
      </Container>

      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6 ">
            <Text variant="text-24-bold" className="mb-2">
              {t("Current Ratio by Year")}
            </Text>
            <FinancialCurrentRatioChart data={report?.financial_collection} />
          </div>
          <div className="flex h-full flex-col justify-center">
            <div className="grid h-fit grid-cols-3 gap-x-4 gap-y-4">
              <CardFinancial
                title={t("Latest Ratio")}
                data={financialRatioStats.latestRatio.toString()}
                description={financialRatioStats.latestYear.toString()}
              />
              <CardFinancial
                title={t(`${financialRatioStats.yearCount}-Year Average`)}
                data={financialRatioStats.averageRatio.toString()}
                description={financialRatioStats.yearRange}
              />
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
