import { Box, Flex, Grid } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";

import StatusTag from "@/components/elements/StatusTag/StatusTag";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { PENDING_APPROVAL } from "@/constants/statuses";
import { FinancialReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntitySetupButtonLabel } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import {
  getExternalFinanceByYear,
  getFinancialYearSummaries,
  NON_PROFIT_ORGANISATION_TYPE
} from "@/utils/financialReport";

import AboutFinancialReport from "../components/overview/AboutFinancialReport";
import CurrentRatioChart from "../components/overview/CurrentRatioChart";
import ExternalFinanceChart from "../components/overview/ExternalFinanceChart";
import FinancialInsightsEmptyState from "../components/overview/FinancialInsightsEmptyState";
import NetProfitChart from "../components/overview/NetProfitChart";
import OperatingBudgetChart from "../components/overview/OperatingBudgetChart";

type FinancialReportOverviewTabProps = {
  report: FinancialReportFullDto;
  onViewDetails: () => void;
};

const FinancialReportOverviewTab: FC<FinancialReportOverviewTabProps> = ({ report, onViewDetails }) => {
  const t = useT();
  const [isReportSetupComplete, setIsReportSetupComplete] = useState(false);
  const editButtonLabel = getEntitySetupButtonLabel(t, report.status, isReportSetupComplete);
  const isEnterprise = report.organisationType !== NON_PROFIT_ORGANISATION_TYPE;

  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "financial-reports",
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus,
    entityTitle: report.organisationName ?? "",
    reportTitle: report.reportTitle ?? "",
    feedback: report.feedback,
    useStatusModal: true,
    useInformationRequiredModal: true
  });

  const statusTag = useMemo(() => {
    if (report.updateRequestStatus === PENDING_APPROVAL) {
      return <TagSubmission size="small" state="pending-approval" />;
    }

    return <StatusTag size="small" status={report.status} />;
  }, [report.status, report.updateRequestStatus]);

  const { summaries, externalFinance, hasInsights } = useMemo(() => {
    const yearSummaries = getFinancialYearSummaries(report.financialCollection ?? [], report.currency);
    const externalFinanceByYear = getExternalFinanceByYear(
      report.fundingTypes ?? [],
      yearSummaries.map(({ year }) => year)
    );
    const hasIndicatorData = yearSummaries.some(summary =>
      isEnterprise
        ? summary.revenue != null ||
          summary.expenses != null ||
          summary.profit != null ||
          summary.currentRatio != null ||
          summary.currentAssets != null ||
          summary.currentLiabilities != null
        : summary.budget != null
    );

    return {
      summaries: yearSummaries,
      externalFinance: externalFinanceByYear,
      hasInsights: hasIndicatorData || externalFinanceByYear.some(({ amount }) => amount != null)
    };
  }, [isEnterprise, report.currency, report.financialCollection, report.fundingTypes]);

  // Enterprise reports have a taller insights column, so the About section moves into the sidebar.
  const showAboutInSidebar = hasInsights && isEnterprise;

  return (
    <PageContent>
      {EditModals}
      <Flex gap={7} direction="column" width="100%">
        <Flex gap={7} direction={{ base: "column", lg: "row" }} alignItems={{ lg: "flex-start" }}>
          <PageItem
            title={hasInsights ? t("Financial Insights") : t("Key Indicators & Insights")}
            flexProps={{ flex: 2, minWidth: 0, width: "100%" }}
            buttonProps={
              hasInsights
                ? {
                    variant: "secondary",
                    size: "small",
                    children: t("View Report Details"),
                    rightIcon: <ChevronRightIcon />,
                    onClick: onViewDetails
                  }
                : undefined
            }
          >
            {hasInsights ? (
              <Grid templateColumns={{ base: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }} gap={5}>
                {isEnterprise ? (
                  <>
                    <NetProfitChart summaries={summaries} />
                    <CurrentRatioChart summaries={summaries} />
                    <Box gridColumn="1 / -1" minWidth={0}>
                      <ExternalFinanceChart data={externalFinance} />
                    </Box>
                  </>
                ) : (
                  <>
                    <OperatingBudgetChart summaries={summaries} />
                    <ExternalFinanceChart data={externalFinance} />
                  </>
                )}
              </Grid>
            ) : (
              <FinancialInsightsEmptyState />
            )}
          </PageItem>
          <Flex direction="column" gap={7} flex={1} minWidth={0} width="100%">
            <PageItem
              title={t("Financial Report")}
              flexProps={{ minWidth: 0, width: "100%", flex: "none" }}
              buttonProps={{
                variant: "primary",
                size: "small",
                children: editButtonLabel,
                rightIcon: <ChevronRightIcon />,
                onClick: () => handleEdit()
              }}
              tag={statusTag}
            >
              <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
                <EntitySetUpSection
                  onStatusChange={setIsReportSetupComplete}
                  onEditStep={handleEdit}
                  entity={report}
                  type="financialReports"
                  entityTitle={report.organisationName ?? ""}
                  reportTitle={report.reportTitle ?? ""}
                />
              </Box>
            </PageItem>
            {showAboutInSidebar && (
              <PageItem title={t("About Financial Report")} flexProps={{ flex: "none", width: "100%" }}>
                <AboutFinancialReport layout="stacked" isEnterprise={isEnterprise} />
              </PageItem>
            )}
          </Flex>
        </Flex>
        {!showAboutInSidebar && (
          <PageItem title={t("About Financial Report")} flexProps={{ width: "100%" }}>
            <AboutFinancialReport layout="split" isEnterprise={isEnterprise} />
          </PageItem>
        )}
      </Flex>
    </PageContent>
  );
};

export default FinancialReportOverviewTab;
