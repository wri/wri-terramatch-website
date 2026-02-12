import { useT } from "@transifex/react";
import _ from "lodash";
import { useMemo } from "react";
import { When } from "react-if";
import { useSelector } from "react-redux";

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
import { V2FundingTypeRead } from "@/generated/apiSchemas";
import {
  FinancialIndicatorDto,
  FinancialReportLightDto,
  FundingTypeDto,
  MediaDto,
  OrganisationFullDto
} from "@/generated/v3/userService/userServiceSchemas";
import FinancialBudgetStackedBarChart from "@/pages/reports/financial-report/[uuid]/components/FinancialBudgetStackedBarChart";
import FinancialCurrentRatioChart from "@/pages/reports/financial-report/[uuid]/components/FinancialCurrentRatioChart";
import FinancialStackedBarChart from "@/pages/reports/financial-report/[uuid]/components/FinancialStackedBarChart";
import { StoreResource } from "@/store/apiSlice";
import { AppStore } from "@/store/store";
import { mediaToUploadedFile, UploadedFile } from "@/types/common";
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

type FinancialChartDataItem = {
  uuid: string;
  organisationId?: number;
  financialReportId?: number;
  collection: string;
  amount: number | null;
  year: number;
  description: string | null;
  documentation: unknown[];
};

type OrganisationWithFinancialData = OrganisationFullDto & {
  financialCollection?: FinancialIndicatorDto[];
  financialReports?: FinancialReportLightDto[];
  fundingTypes?: FundingTypeDto[];
};

const FinancialTabContent = ({ organization }: FinancialTabContentProps) => {
  const t = useT();
  const { openModal } = useModalContext();

  const financialIndicators = useSelector((store: AppStore): FinancialIndicatorDto[] => {
    const financialIndicatorsStore = store.api?.financialIndicators;
    if (!financialIndicatorsStore) return [];
    return Object.values(financialIndicatorsStore)
      .map((resource: StoreResource<FinancialIndicatorDto>) => resource?.attributes)
      .filter((attrs): attrs is FinancialIndicatorDto => Boolean(attrs));
  });

  const financialReportsStore = useSelector((store: AppStore): FinancialReportLightDto[] => {
    const financialReportsStore = store.api?.financialReports;
    if (!financialReportsStore) return [];
    return Object.values(financialReportsStore)
      .map((resource: StoreResource<FinancialReportLightDto>) => resource?.attributes)
      .filter((attrs): attrs is FinancialReportLightDto => Boolean(attrs));
  });

  const fundingTypesStore = useSelector((store: AppStore): FundingTypeDto[] => {
    const fundingTypesStore = store.api?.fundingTypes;
    if (!fundingTypesStore) return [];
    return Object.values(fundingTypesStore)
      .map((resource: StoreResource<FundingTypeDto>) => resource?.attributes)
      .filter((attrs): attrs is FundingTypeDto => Boolean(attrs));
  });

  const convertToChartData = useMemo(
    () =>
      (indicators: FinancialIndicatorDto[]): FinancialChartDataItem[] => {
        return indicators.map(item => ({
          uuid: item.entityUuid,
          collection: item.collection,
          amount: item.amount,
          year: item.year,
          description: item.description,
          documentation: (item.documentation as unknown[]) || []
        }));
      },
    []
  );

  const orgWithFinancialData = organization as OrganisationWithFinancialData | undefined;

  const financialData: FinancialIndicatorDto[] = useMemo(
    () =>
      financialIndicators.length > 0
        ? financialIndicators.filter(
            (item: FinancialIndicatorDto) =>
              item.collection === "budget" ||
              item.collection === "revenue" ||
              item.collection === "expenses" ||
              item.collection === "profit" ||
              item.collection === "current-ratio" ||
              item.collection === "description-documents"
          )
        : orgWithFinancialData?.financialCollection ?? [],
    [financialIndicators, orgWithFinancialData]
  );

  /**
   * Checks if there are incomplete steps (Build a Stronger Profile section).
   * Uses FinancialIndicators with 'description-documents' collection to check for missing documentation.
   * @returns boolean
   */
  const incompleteSteps = useMemo(() => {
    const descriptionDocs = financialData.filter(item => item.collection === "description-documents");

    const hasEmptyDocumentation = descriptionDocs.some(
      item => !item.documentation || (Array.isArray(item.documentation) && item.documentation.length === 0)
    );

    return {
      statementFiles: hasEmptyDocumentation
    };
  }, [financialData]);

  const showIncompleteStepsSection = _.values(incompleteSteps).includes(true);

  const files: UploadedFile[] = useMemo(() => {
    const descriptionDocs = financialData.filter(item => item.collection === "description-documents");

    const mediaFiles: MediaDto[] = descriptionDocs.flatMap(item => (item.documentation as MediaDto[]) || []);

    return mediaFiles.map(media => mediaToUploadedFile(media));
  }, [financialData]);

  const financialReports: FinancialReportLightDto[] = useMemo(
    () => (financialReportsStore.length > 0 ? financialReportsStore : orgWithFinancialData?.financialReports ?? []),
    [financialReportsStore, orgWithFinancialData]
  );

  const mappedReportActions: ActionTrackerCardRowProps[] = useMemo(
    () =>
      financialReports.map((report: FinancialReportLightDto) => ({
        title: organization?.name || report.organisationName || `Financial Report ${report.yearOfReport || ""}`,
        subtitle: `Year: ${report.yearOfReport ?? ""}`,
        status: Object.values(StatusEnum).includes(report.status as StatusEnum)
          ? (report.status as StatusEnum)
          : StatusEnum.DRAFT,
        ctaLink: `/reports/financial-report/${report.uuid}`,
        ctaText: t("View Report"),
        onClick: (): {} => ({}),
        statusText: report.status,
        updatedAt: report.dueAt ? `Due: ${new Date(report.dueAt).toLocaleDateString()}` : "",
        updatedBy: ""
      })),
    [financialReports, organization, t]
  );

  const fundingTypes: V2FundingTypeRead[] =
    fundingTypesStore.length > 0
      ? (fundingTypesStore as unknown as V2FundingTypeRead[])
      : orgWithFinancialData?.fundingTypes
      ? (orgWithFinancialData.fundingTypes as unknown as V2FundingTypeRead[])
      : [];

  const chartData = useMemo(() => convertToChartData(financialData), [convertToChartData, financialData]);
  const financialRatioStats = calculateFinancialRatioStats(chartData);
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
                {organization?.finStartMonth
                  ? getMonthOptions(t).find(opt => opt.value == organization?.finStartMonth)?.title
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
              <FinancialStackedBarChart data={chartData} currency={organization?.currency} />
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {financialData
                .filter((item: FinancialIndicatorDto) => item.collection === "profit")
                .map((item: FinancialIndicatorDto) => (
                  <CardFinancial
                    key={item.entityUuid}
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
              <FinancialCurrentRatioChart data={chartData} currency={organization?.currency} />
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
              <FinancialBudgetStackedBarChart data={chartData} currency={organization?.currency} />
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {financialData
                .filter((item: FinancialIndicatorDto) => item.collection === "budget")
                .map((item: FinancialIndicatorDto) => (
                  <CardFinancial
                    key={item.entityUuid}
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
          <FinancialDocumentsSection files={formatDocumentData(chartData)} />
        </div>
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Descriptions of Financials per Year")}
          </Text>
          <FinancialDescriptionsSection items={formatDescriptionData(chartData)} />
        </div>
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Exchange Rate by Year")}
          </Text>
          <FinancialExchangeSection items={formatExchangeData(chartData)} />
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
