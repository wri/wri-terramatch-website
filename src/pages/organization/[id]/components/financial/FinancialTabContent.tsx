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
import { V2FileRead, V2OrganisationRead } from "@/generated/apiSchemas";
import { formatDescriptionData, formatDocumentData } from "@/utils/financialReport";

import BuildStrongerProfile from "../BuildStrongerProfile";
import OrganizationEditModal from "../edit/OrganizationEditModal";
import Files from "../Files";
import CardFinancial from "./components/cardFinancial";
import FinancialInformation from "./FinancialInformation";

type FinancialTabContentProps = {
  organization?: V2OrganisationRead;
};

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

  const fundingSourcesItems = [
    { key: "2020", render: 2020 },
    { key: "2021", render: 2021 },
    { key: "2022", render: 2022 },
    { key: "2023", render: 2023 },
    { key: "2024", render: 2024 }
  ];

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
        <FundingSourcesSection items={fundingSourcesItems} />
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
