import { useT } from "@transifex/react";
import _ from "lodash";
import { useMemo } from "react";
import { When } from "react-if";

import FinancialDescriptionsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDescriptionsSection";
import FinancialDocumentsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDocumentsSection";
import FinancialExchangeSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialExchangeSection";
import FundingSourcesSection from "@/admin/components/ResourceTabs/HistoryTab/components/FundingSourcesSection";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Text from "@/components/elements/Text/Text";
import type { ActionTrackerCardRowProps } from "@/components/extensive/ActionTracker/ActionTrackerCardRow";
import ActionTrackerCardRow from "@/components/extensive/ActionTracker/ActionTrackerCardRow";
import List from "@/components/extensive/List/List";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import Container from "@/components/generic/Layout/Container";
import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import { useModalContext } from "@/context/modal.provider";
import { V2FileRead, V2FundingTypeRead, V2OrganisationRead } from "@/generated/apiSchemas";
import FinancialCurrentRatioChart from "@/pages/reports/financial-report/[uuid]/components/FinancialCurrentRatioChart";
import FinancialStackedBarChart from "@/pages/reports/financial-report/[uuid]/components/FinancialStackedBarChart";
import {
  calculateFinancialRatioStats,
  formatDescriptionData,
  formatDocumentData,
  formatExchangeData
} from "@/utils/financialReport";

import BuildStrongerProfile from "../BuildStrongerProfile";
import OrganizationEditModal from "../edit/OrganizationEditModal";
import Files from "../Files";
import CardFinancial from "./components/cardFinancial";

type FinancialTabContentProps = {
  organization?: V2OrganisationRead;
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

const FinancialTabContent = ({ organization }: FinancialTabContentProps) => {
  const t = useT();
  const { openModal } = useModalContext();

  /**
   * Checks if there are incomplete steps (Build a Stronger Profile section).
   * @returns boolean
   */
  const incompleteSteps = useMemo(() => {
    const statementFiles = _.pick<any, keyof V2OrganisationRead>(
      organization,
      // @ts-ignore
      ["op_budget_3year", "op_budget_2year", "op_budget_1year"]
    );

    return {
      statementFiles: _.some(statementFiles, _.isEmpty)
    };
  }, [organization]);

  const showIncompleteStepsSection = _.values(incompleteSteps).includes(true);

  const files: V2FileRead[] = useMemo(() => {
    return [
      // @ts-ignore
      ...(organization?.op_budget_3year ?? []),
      ...(organization?.op_budget_2year ?? []),
      // @ts-ignore
      ...(organization?.op_budget_1year ?? [])
    ];
  }, [organization]);

  const financialReports = (organization as any)?.financialReports ?? [];
  const mappedReportActions: ActionTrackerCardRowProps[] = (financialReports ?? []).map((report: any) => ({
    title: report.name,
    subtitle: `Year: ${report.year_of_report}`,
    status: Object.values(StatusEnum).includes(report.status) ? report.status : StatusEnum.DRAFT,
    ctaLink: `/reports/financial-report/${report.uuid}`,
    ctaText: t("View Report"),
    onClick: () => {},
    statusText: report.status,
    updatedAt: report.due_at ? `Due: ${new Date(report.due_at).toLocaleDateString()}` : "",
    updatedBy: report.updated_by || ""
  }));

  const fundingTypes: V2FundingTypeRead[] =
    organization && (organization as any)?.funding_types ? (organization as any)?.funding_types : [];

  const financialData = (organization as any)?.financialCollection;
  const financialRatioStats = calculateFinancialRatioStats(financialData);
  const hasNetProfitData =
    Array.isArray(financialData) &&
    financialData.some(
      item =>
        (item.collection === "revenue" && item.amount) ||
        (item.collection === "expenses" && item.amount) ||
        (item.collection === "profit" && item.amount)
    );
  const hasCurrentRatioData =
    Array.isArray(financialData) && financialData.some(item => item.collection === "current-ratio" && item.amount);

  return (
    <Container className="mx-0 flex max-w-full flex-col gap-14 px-0 pb-15">
      <Container className="max-w-full bg-neutral-50 px-0 py-16">
        <Container className="mx-auto grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-4.5 rounded-lg bg-white p-8 text-center shadow-all">
            <Text variant="text-22-bold" className="mb-2">
              {t("Basic Info")}
            </Text>
            <div className="flex flex-col gap-1">
              <Text variant="text-16-light">{t("Local Currency")}</Text>
              <Text variant="text-18-bold">
                {organization?.currency
                  ? getCurrencyOptions(t).find(opt => opt.value == organization?.currency)?.title
                  : "Not Provided"}
              </Text>
            </div>
            <div className="flex flex-col gap-1">
              <Text variant="text-16-light">{t("Financial Year Start Month")}</Text>
              <Text variant="text-18-bold">
                {organization?.fin_start_month
                  ? getMonthOptions(t).find(opt => opt.value == organization?.fin_start_month)?.title
                  : "Not Provided"}
              </Text>
            </div>
          </div>
          {mappedReportActions?.length > 0 && (
            <div className="flex h-72 flex-col gap-4 rounded-lg bg-white p-8 text-center shadow-all">
              <Text variant="text-24-bold">{t("Financial Reports")}</Text>
              <List
                className="flex h-full w-full flex-1 flex-col gap-3 overflow-y-auto px-28 py-3 text-left"
                items={mappedReportActions}
                render={row => <ActionTrackerCardRow {...row} />}
              />
            </div>
          )}
        </Container>
      </Container>

      {hasNetProfitData && (
        <Container className="mx-auto rounded-2xl p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Net Profit By Year")}
          </Text>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <FinancialStackedBarChart data={financialData} currency={organization?.currency} />
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {financialData
                .filter((item: FinancialStackedBarChartProps) => item.collection === "profit")
                .map((item: FinancialStackedBarChartProps) => (
                  <CardFinancial
                    key={item.uuid}
                    title={t(item.year.toString())}
                    data={item.amount && item.amount > 0 ? `+${item.amount}` : item.amount ? `-${item.amount}` : "0"}
                    description={t("Net Profit")}
                    currency={organization?.currency}
                  />
                ))}
            </div>
          </div>
        </Container>
      )}
      {hasCurrentRatioData && (
        <Container className="mx-auto rounded-2xl p-8 shadow-all">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <Text variant="text-24-bold" className="mb-2">
                {t("Current Ratio by Year")}
              </Text>
              <FinancialCurrentRatioChart data={financialData} currency={organization?.currency} />
            </div>
            <div className="flex h-full flex-col justify-center">
              <div className="grid h-fit grid-cols-3 gap-x-4 gap-y-4">
                <CardFinancial
                  title={t("Latest Ratio")}
                  data={financialRatioStats.latestRatio.toString()}
                  description={financialRatioStats.latestYear.toString()}
                  currency={""}
                />
                <CardFinancial
                  title={t(`${financialRatioStats.yearCount}-Year Average`)}
                  data={financialRatioStats.averageRatio.toString()}
                  description={financialRatioStats.yearRange}
                  currency={""}
                />
              </div>
            </div>
          </div>
        </Container>
      )}

      <Container className="mx-auto grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Financial Documents per Year")}
          </Text>
          <FinancialDocumentsSection files={formatDocumentData(financialData)} />
        </div>
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Descriptions of Financials per Year")}
          </Text>
          <FinancialDescriptionsSection items={formatDescriptionData(financialData)} />
        </div>
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Exchange Rate by Year")}
          </Text>
          <FinancialExchangeSection items={formatExchangeData(financialData)} />
        </div>
      </Container>
      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        {/* getFundingTypesOptions */}
        <Text variant="text-24-bold" className="mb-2">
          {t("Major Funding Sources by Year")}
        </Text>
        <FundingSourcesSection data={fundingTypes} currency={organization?.currency} />
      </Container>
      {/* {previous design} */}
      <Container className="hidden py-15">
        <Text variant="text-heading-2000">{t("Financial Information")}</Text>

        {/* Files */}
        <When condition={!incompleteSteps.statementFiles}>
          <Files files={files} />
        </When>
        {/* Build a Stronger Profile */}
        <When condition={showIncompleteStepsSection}>
          <BuildStrongerProfile
            steps={[
              {
                showWhen: incompleteSteps.statementFiles,
                title: t("Add Financial Documents"),
                subtitle: t(
                  "Note that your organisation's financial documents denotes the amount of money managed by your organization in the given year, converted into USD."
                )
              }
            ]}
            subtitle={t(
              "Organizational Profiles with financial information are more likely to be successful in Funding Applications."
            )}
            onEdit={() =>
              openModal(ModalId.ORGANIZATION_EDIT_MODAL, <OrganizationEditModal organization={organization} />)
            }
          />
        </When>
      </Container>
    </Container>
  );
};

export default FinancialTabContent;
