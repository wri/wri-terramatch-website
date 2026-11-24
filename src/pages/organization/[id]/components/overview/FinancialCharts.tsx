import { Box, Grid } from "@chakra-ui/react";
import { FC, useMemo } from "react";

import CurrentRatioChart from "@/pages/reports/financial-report/[uuid]/components/overview/CurrentRatioChart";
import ExternalFinanceChart from "@/pages/reports/financial-report/[uuid]/components/overview/ExternalFinanceChart";
import NetProfitChart from "@/pages/reports/financial-report/[uuid]/components/overview/NetProfitChart";
import OperatingBudgetChart from "@/pages/reports/financial-report/[uuid]/components/overview/OperatingBudgetChart";
import {
  getExternalFinanceByYear,
  getFinancialYearSummaries,
  NON_PROFIT_ORGANISATION_TYPE
} from "@/utils/financialReport";

import { OrganisationLatestFinancialReport } from "./types";

type FinancialChartsProps = {
  report: OrganisationLatestFinancialReport;
  organisationType?: string | null;
};

const FinancialCharts: FC<FinancialChartsProps> = ({ report, organisationType }) => {
  const isEnterprise = organisationType !== NON_PROFIT_ORGANISATION_TYPE;

  const { summaries, externalFinance } = useMemo(() => {
    const yearSummaries = getFinancialYearSummaries(report.financialCollection ?? [], report.currency);
    return {
      summaries: yearSummaries,
      externalFinance: getExternalFinanceByYear(
        report.fundingTypes ?? [],
        yearSummaries.map(({ year }) => year)
      )
    };
  }, [report]);

  return (
    <Grid templateColumns={{ base: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }} gap={4}>
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
  );
};

export default FinancialCharts;
