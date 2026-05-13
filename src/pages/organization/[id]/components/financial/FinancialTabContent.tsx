import { useT } from "@transifex/react";
import _ from "lodash";
import { FC, useMemo } from "react";

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
import {
  useOrganisationFinancialIndicators,
  useOrganisationFinancialReports,
  useOrganisationFundingTypes
} from "@/connections/Organisation";
import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import { useModalContext } from "@/context/modal.provider";
import {
  FinancialIndicatorDto,
  FinancialReportLightDto,
  OrganisationFullDto
} from "@/generated/v3/userService/userServiceSchemas";
import FinancialBudgetStackedBarChart from "@/pages/reports/financial-report/[uuid]/components/FinancialBudgetStackedBarChart";
import FinancialCurrentRatioChart from "@/pages/reports/financial-report/[uuid]/components/FinancialCurrentRatioChart";
import FinancialStackedBarChart from "@/pages/reports/financial-report/[uuid]/components/FinancialStackedBarChart";
import { UploadedFile } from "@/types/common";
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
  organization?: OrganisationFullDto;
};

type FinancialIndicatorWithUuid = FinancialIndicatorDto & { uuid: string };

const FinancialTabContent: FC<FinancialTabContentProps> = ({ organization }) => {
  const t = useT();
  const { openModal } = useModalContext();

  const [, { financialIndicators }] = useOrganisationFinancialIndicators({
    organisationUuid: organization?.uuid ?? ""
  });

  const [, { financialReports }] = useOrganisationFinancialReports({
    organisationUuid: organization?.uuid ?? ""
  });

  const [, { fundingTypes }] = useOrganisationFundingTypes({
    organisationUuid: organization?.uuid ?? ""
  });

  const budgetFiles = useMemo(() => {
    return financialIndicators
      .filter(fi => fi.collection === "budget" && fi.documentation != null && fi.documentation.length > 0)
      .flatMap(fi => fi.documentation ?? []);
  }, [financialIndicators]);

  /**
   * Checks if there are incomplete steps (Build a Stronger Profile section).
   * @returns boolean
   */
  const incompleteSteps = useMemo(() => {
    const hasBudgetFiles = budgetFiles.length > 0;
    return {
      statementFiles: !hasBudgetFiles
    };
  }, [budgetFiles]);

  const showIncompleteStepsSection = _.values(incompleteSteps).includes(true);

  const mappedReportActions: ActionTrackerCardRowProps[] = (financialReports ?? []).map(
    (report: FinancialReportLightDto) => ({
      title: organization?.name ?? report.organisationName ?? t("Financial Report"),
      subtitle: `Year: ${report.yearOfReport ?? ""}`,
      status: Object.values(StatusEnum).includes(report.status as StatusEnum)
        ? (report.status as StatusEnum)
        : StatusEnum.DRAFT,
      ctaLink: `/reports/financial-report/${report.uuid}`,
      ctaText: t("View Report"),
      onClick: () => ({}),
      statusText: report.status,
      updatedAt: report.dueAt ? `Due: ${new Date(report.dueAt).toLocaleDateString()}` : ""
    })
  );

  const financialData = useMemo(() => financialIndicators, [financialIndicators]);
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
  const hasBudgetData =
    Array.isArray(financialData) && financialData.some(item => item.collection === "budget" && item.amount);

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
                {organization?.finStartMonth != null
                  ? getMonthOptions(t).find(opt => opt.value == organization.finStartMonth)?.title
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
                .filter((item: FinancialIndicatorWithUuid) => item.collection === "profit")
                .map((item: FinancialIndicatorWithUuid) => (
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

      {hasBudgetData && (
        <Container className="mx-auto rounded-2xl p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Budget By Year")}
          </Text>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <FinancialBudgetStackedBarChart data={financialData} currency={organization?.currency} />
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {financialData
                .filter((item: FinancialIndicatorWithUuid) => item.collection === "budget")
                .map((item: FinancialIndicatorWithUuid) => (
                  <CardFinancial
                    key={item.uuid ?? item.entityUuid}
                    title={t(item.year.toString())}
                    data={item.amount && item.amount > 0 ? `+${item.amount}` : item.amount ? `-${item.amount}` : "0"}
                    description={t("Budget")}
                    currency={organization?.currency}
                  />
                ))}
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
        <FundingSourcesSection data={fundingTypes} currency={organization?.currency ?? undefined} />
      </Container>
      {/* {previous design} */}
      <Container className="hidden py-15">
        <Text variant="text-heading-2000">{t("Financial Information")}</Text>

        {/* Files */}
        {!incompleteSteps.statementFiles && budgetFiles.length > 0 && (
          <Files
            title={t("Operating Budget Documents")}
            files={budgetFiles.map(
              file =>
                ({
                  uuid: file.uuid,
                  name: file.name,
                  fileName: file.fileName,
                  mimeType: file.mimeType,
                  size: file.size,
                  url: file.url ?? undefined,
                  thumbUrl: file.thumbUrl ?? undefined,
                  createdAt: file.createdAt,
                  collectionName: file.collectionName,
                  description: file.description ?? undefined,
                  photographer: file.photographer ?? undefined
                } as UploadedFile)
            )}
          />
        )}
        {/* Build a Stronger Profile */}
        {showIncompleteStepsSection && (
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
        )}
      </Container>
    </Container>
  );
};

export default FinancialTabContent;
