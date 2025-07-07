import { useT } from "@transifex/react";
import _ from "lodash";
import { useMemo } from "react";
import { When } from "react-if";

import FinancialDescriptionsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDescriptionsSection";
import FinancialDocumentsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDocumentsSection";
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
import { calculateFinancialRatioStats, formatDescriptionData, formatDocumentData } from "@/utils/financialReport";

import BuildStrongerProfile from "../BuildStrongerProfile";
import OrganizationEditModal from "../edit/OrganizationEditModal";
import Files from "../Files";
import CardFinancial from "./components/cardFinancial";
import FinancialInformation from "./FinancialInformation";

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

const financialData: FinancialStackedBarChartProps[] = [
  {
    uuid: "ed5c3ee4-1061-4704-a5b2-ad6c90bb88a5",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "revenue",
    amount: 112,
    year: 2020,
    description: null,
    documentation: []
  },
  {
    uuid: "9a093a44-de44-4038-ac84-d782954bc3c7",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "expenses",
    amount: 15,
    year: 2020,
    description: null,
    documentation: []
  },
  {
    uuid: "959cdc0d-7f66-401d-831f-26dc0270bfb4",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "profit",
    amount: 97,
    year: 2020,
    description: null,
    documentation: []
  },
  {
    uuid: "9155d292-0877-408a-bd13-c374c0334938",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "revenue",
    amount: 20,
    year: 2021,
    description: null,
    documentation: []
  },
  {
    uuid: "c5883e3a-1e06-46a9-bd84-fc5d9563a328",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "expenses",
    amount: 15,
    year: 2021,
    description: null,
    documentation: []
  },
  {
    uuid: "b6db4324-8b96-422d-8fb4-66a74f7bdb35",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "profit",
    amount: 5,
    year: 2021,
    description: null,
    documentation: []
  },
  {
    uuid: "d72f7980-d53f-42f7-ae42-87a13f59d3f6",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "revenue",
    amount: 50,
    year: 2022,
    description: null,
    documentation: []
  },
  {
    uuid: "ea0c9136-72af-4576-b242-c8f62d8c06f8",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "expenses",
    amount: 10,
    year: 2022,
    description: null,
    documentation: []
  },
  {
    uuid: "a69e814e-6441-4552-832d-d63d2441a080",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "profit",
    amount: 40,
    year: 2022,
    description: null,
    documentation: []
  },
  {
    uuid: "fd4b73e6-cec2-42c0-917a-b96edb3fdf5b",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "budget",
    amount: 10,
    year: 2020,
    description: null,
    documentation: []
  },
  {
    uuid: "8d2b4939-ed19-4695-b4c3-c3e97e72b635",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "budget",
    amount: 13,
    year: 2021,
    description: null,
    documentation: []
  },
  {
    uuid: "a1c225a0-030d-447a-bc76-3e7baee729b8",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "budget",
    amount: 14,
    year: 2022,
    description: null,
    documentation: []
  },
  {
    uuid: "e6c46642-f91f-4ce2-9598-152cefbb5e67",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "current-assets",
    amount: 20,
    year: 2020,
    description: null,
    documentation: []
  },
  {
    uuid: "4f670d6e-a512-453e-9e8c-c8e28eb57136",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "current-liabilities",
    amount: 10,
    year: 2020,
    description: null,
    documentation: []
  },
  {
    uuid: "ee8b2121-8320-4b26-af59-388df97eaa8e",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "current-ratio",
    amount: 2,
    year: 2020,
    description: null,
    documentation: []
  },
  {
    uuid: "e2087917-5e19-422c-978e-9a7f7d4c571b",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "current-assets",
    amount: 50,
    year: 2021,
    description: null,
    documentation: []
  },
  {
    uuid: "18995f43-ebaf-41ea-89c4-8fc2623de87c",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "current-liabilities",
    amount: 2,
    year: 2021,
    description: null,
    documentation: []
  },
  {
    uuid: "e6908512-fc62-4ca0-9440-6b005414e082",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "current-ratio",
    amount: 25,
    year: 2021,
    description: null,
    documentation: []
  },
  {
    uuid: "69de29e4-f81d-47bc-8f75-4b9d0e6043d0",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "current-assets",
    amount: 1000,
    year: 2022,
    description: null,
    documentation: []
  },
  {
    uuid: "a4b32236-4cfa-4285-b631-e846b8c7f4f0",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "current-liabilities",
    amount: 3,
    year: 2022,
    description: null,
    documentation: []
  },
  {
    uuid: "b86f06e7-db8f-4e20-a098-60238c3e261e",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "current-ratio",
    amount: 33.3333333333333,
    year: 2022,
    description: null,
    documentation: []
  },
  {
    uuid: "553596ad-ed20-4da5-ac5c-59a2b5cd7181",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "description-documents",
    amount: null,
    year: 2020,
    description: null,
    documentation: []
  },
  {
    uuid: "e3c3606e-e7d0-402f-8d24-bf40f54d5b5b",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "description-documents",
    amount: null,
    year: 2021,
    description: null,
    documentation: []
  },
  {
    uuid: "b94c6bb7-f3ef-434a-8b20-08df3e7d7fa9",
    organisation_id: 3439,
    financial_report_id: 1,
    collection: "description-documents",
    amount: null,
    year: 2022,
    description: null,
    documentation: []
  }
];

const FinancialTabContent = ({ organization }: FinancialTabContentProps) => {
  const t = useT();
  const { openModal } = useModalContext();

  /**
   * Checks if there are incomplete steps (Build a Stronger Profile section).
   * @returns boolean
   */
  const incompleteSteps = useMemo(() => {
    const financial = _.pick<any, keyof V2OrganisationRead>(organization, [
      "fin_budget_current_year",
      "fin_budget_3year",
      "fin_budget_2year",
      "fin_budget_1year"
    ]);

    const statementFiles = _.pick<any, keyof V2OrganisationRead>(
      organization,
      // @ts-ignore
      ["op_budget_3year", "op_budget_2year", "op_budget_1year"]
    );

    return {
      financial: _.some(financial, _.isNull || _.isNaN),
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
    updatedAt: report.updated_at ? new Date(report.updated_at).toLocaleDateString() : "",
    updatedBy: report.updated_by || ""
  }));

  const fundingTypes: V2FundingTypeRead[] =
    organization && (organization as any)?.funding_types ? (organization as any)?.funding_types : [];

  const financialRatioStats = calculateFinancialRatioStats(financialData);

  return (
    <Container className="mx-0 flex max-w-full flex-col gap-14 px-0 pb-15">
      <Container className="max-w-full bg-neutral-50 px-0 py-16">
        <Container className="mx-auto grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-4 rounded-lg bg-white p-8 text-center shadow-all">
            <Text variant="text-24-bold" className="mb-2">
              {t("Basic Info")}
            </Text>
            <div className="flex flex-col gap-1">
              <Text variant="text-16-light">{t("Local Currency")}</Text>
              <Text variant="text-20-bold">
                {organization?.currency
                  ? getCurrencyOptions(t).find(opt => opt.value == organization?.currency)?.title
                  : "Not Provided"}
              </Text>
            </div>
            <div className="flex flex-col gap-1">
              <Text variant="text-16-light">{t("Financial Year Start Month")}</Text>
              <Text variant="text-20-bold">
                {organization?.fin_start_month
                  ? getMonthOptions(t).find(opt => opt.value == organization?.fin_start_month)?.title
                  : "Not Provided"}
              </Text>
            </div>
          </div>
          <div className="flex h-72 flex-col gap-4 rounded-lg bg-white p-8 text-center shadow-all">
            <Text variant="text-24-bold">{t("Financial Information")}</Text>
            <List
              className="flex h-full w-full flex-1 flex-col gap-3 overflow-y-auto p-3 text-left"
              items={mappedReportActions}
              render={row => <ActionTrackerCardRow {...row} />}
            />
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
            {/* <img src="/images/graphic-2.png" alt="Financial Documents" /> */}
            <FinancialStackedBarChart data={financialData} />
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
            {financialData
              .filter(item => item.collection === "profit")
              .map(item => (
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

      {/* graphic */}
      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6 ">
            <Text variant="text-24-bold" className="mb-2">
              {t("Current Ratio by Year")}
            </Text>
            <FinancialCurrentRatioChart data={financialData} />
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
          <FinancialDocumentsSection files={formatDocumentData((organization as any)?.financialCollection)} />
        </div>
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-all">
          <Text variant="text-24-bold" className="mb-2">
            {t("Descriptions of Financials per Year")}
          </Text>
          <FinancialDescriptionsSection items={formatDescriptionData((organization as any)?.financialCollection)} />
        </div>
      </Container>
      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        <Text variant="text-24-bold" className="mb-2">
          {t("Major Funding Sources by Year")}
        </Text>
        <FundingSourcesSection data={fundingTypes} currency={organization?.currency} />
      </Container>
      {/* {previous design} */}
      <Container className="hidden py-15">
        <Text variant="text-heading-2000">{t("Financial Information")}</Text>

        {/* Information */}
        <When condition={!incompleteSteps.financial}>
          <FinancialInformation organization={organization} />
        </When>
        {/* Files */}
        <When condition={!incompleteSteps.statementFiles}>
          <Files files={files} />
        </When>
        {/* Build a Stronger Profile */}
        <When condition={showIncompleteStepsSection}>
          <BuildStrongerProfile
            steps={[
              {
                showWhen: incompleteSteps.financial,
                title: t("Add Organizational Budget"),
                subtitle: t(
                  "Note that the budget denotes the amount of money managed by your organization in the given year, converted into USD."
                )
              },
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
