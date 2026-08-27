import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";

import {
  getReportKeyIndicatorFramework,
  ReportKeyIndicatorFramework
} from "@/components/reports/KeyIndicators/reportKeyIndicatorPrimitives";
import {
  loadFullNurseryReport,
  loadFullSiteReport,
  useLightNurseryReportList,
  useLightSiteReportList
} from "@/connections/Entity";
import {
  NurseryReportFullDto,
  NurseryReportLightDto,
  SiteReportFullDto,
  SiteReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";

import { ReportsIndexReport } from "./reportIndex.types";
import { useReportsSelectionState } from "./ReportsSelection.provider";

type PeriodMetricTotals = {
  treesGrowing: number;
  treesRegenerated: number;
  seedlingsGrown: number;
};

export type ReportingPeriodMetricCard = {
  key: "trees-growing" | "trees-regenerated" | "jobs" | "seedlings-grown";
  title: string;
  tooltip: string;
  progress: number;
  filtered?: number | null;
  selection?: number | null;
  color: string;
};

const isFullSiteReport = (report: SiteReportLightDto | undefined): report is SiteReportFullDto =>
  report != null && report.lightResource === false && "totalTreesPlantedCount" in report;

const isFullNurseryReport = (report: NurseryReportLightDto | undefined): report is NurseryReportFullDto =>
  report != null && report.lightResource === false && "seedlingsYoungTrees" in report;

const treesRegeneratingFromSite = (report: SiteReportFullDto) => {
  const speciesTotal = report.totalTreesRegeneratingSpeciesCount ?? 0;
  return speciesTotal > 0 ? speciesTotal : report.numTreesRegenerating ?? 0;
};

const treesGrowingFromSite = (report: SiteReportFullDto) =>
  (report.totalTreesPlantedCount ?? 0) + (report.totalSeedsPlantedCount ?? 0) + treesRegeneratingFromSite(report);

const totalsFromLoadedReports = (
  reports: ReportsIndexReport[],
  siteReports: Array<SiteReportLightDto | undefined> | undefined,
  nurseryReports: Array<NurseryReportLightDto | undefined> | undefined
): PeriodMetricTotals => {
  const sitesById = new Map((siteReports ?? []).filter(isFullSiteReport).map(report => [report.uuid, report] as const));
  const nurseriesById = new Map(
    (nurseryReports ?? []).filter(isFullNurseryReport).map(report => [report.uuid, report] as const)
  );

  return reports.reduce<PeriodMetricTotals>(
    (totals, report) => {
      if (report.type === "site-report") {
        const siteReport = sitesById.get(report.id);
        if (siteReport == null) return totals;
        return {
          ...totals,
          treesGrowing: totals.treesGrowing + treesGrowingFromSite(siteReport),
          treesRegenerated: totals.treesRegenerated + treesRegeneratingFromSite(siteReport)
        };
      }
      if (report.type === "nursery-report") {
        const nurseryReport = nurseriesById.get(report.id);
        if (nurseryReport == null) return totals;
        return {
          ...totals,
          seedlingsGrown: totals.seedlingsGrown + (nurseryReport.seedlingsYoungTrees ?? 0)
        };
      }
      return totals;
    },
    { treesGrowing: 0, treesRegenerated: 0, seedlingsGrown: 0 }
  );
};

const idsOfType = (reports: ReportsIndexReport[], type: ReportsIndexReport["type"]) =>
  reports.filter(report => report.type === type).map(report => report.id);

const includesProjectReport = (reports: ReportsIndexReport[]) =>
  reports.some(report => report.type === "project-report");

const useLoadedChildReports = (siteIds: string[], nurseryIds: string[], enabled: boolean) => {
  const [loadFinished, setLoadFinished] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setLoadFinished(true);
      return;
    }

    let cancelled = false;
    setLoadFinished(false);
    void Promise.allSettled([
      ...siteIds.map(id => loadFullSiteReport({ id })),
      ...nurseryIds.map(id => loadFullNurseryReport({ id }))
    ]).then(() => {
      if (!cancelled) setLoadFinished(true);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, nurseryIds, siteIds]);

  const [, { data: siteReports }] = useLightSiteReportList({ ids: enabled ? siteIds : [] });
  const [, { data: nurseryReports }] = useLightNurseryReportList({ ids: enabled ? nurseryIds : [] });

  return { siteReports, nurseryReports, ready: !enabled || loadFinished };
};

type MetricLayerTotals = {
  treesGrowing: number | null;
  treesRegenerated: number | null;
  seedlingsGrown: number | null;
  jobs: number | null;
};

const layerTotalsFromReports = (
  subset: ReportsIndexReport[],
  siteReports: Array<SiteReportLightDto | undefined> | undefined,
  nurseryReports: Array<NurseryReportLightDto | undefined> | undefined,
  jobsTotal: number | null | undefined
): MetricLayerTotals => {
  const totals = totalsFromLoadedReports(subset, siteReports, nurseryReports);
  return {
    treesGrowing: subset.some(report => report.type === "site-report") ? totals.treesGrowing : null,
    treesRegenerated: subset.some(report => report.type === "site-report") ? totals.treesRegenerated : null,
    seedlingsGrown: subset.some(report => report.type === "nursery-report") ? totals.seedlingsGrown : null,
    jobs: includesProjectReport(subset) ? jobsTotal ?? 0 : null
  };
};

type UseReportingPeriodMetricsArgs = {
  open: boolean;
  reports: ReportsIndexReport[];
  allReports: ReportsIndexReport[];
  hasReportSubset: boolean;
  jobsTotal: number | null | undefined;
};

export const useReportingPeriodMetrics = ({
  open,
  reports,
  allReports,
  hasReportSubset,
  jobsTotal
}: UseReportingPeriodMetricsArgs) => {
  const { selectedReports } = useReportsSelectionState();
  const periodSelectedReports = useMemo(() => {
    const visibleKeys = new Set(reports.map(report => `${report.type}:${report.id}`));
    return selectedReports.filter(
      (report): report is ReportsIndexReport =>
        (report.type === "project-report" || report.type === "site-report" || report.type === "nursery-report") &&
        visibleKeys.has(`${report.type}:${report.id}`)
    );
  }, [reports, selectedReports]);
  const hasSelection = periodSelectedReports.length > 0;

  const siteIds = useMemo(() => idsOfType(allReports, "site-report"), [allReports]);
  const nurseryIds = useMemo(() => idsOfType(allReports, "nursery-report"), [allReports]);

  const { siteReports, nurseryReports, ready } = useLoadedChildReports(siteIds, nurseryIds, open);

  const periodTotals = useMemo(
    () => totalsFromLoadedReports(allReports, siteReports, nurseryReports),
    [allReports, nurseryReports, siteReports]
  );

  const showFiltered = useMemo(() => {
    if (hasReportSubset) return true;
    if (reports.length !== allReports.length) return true;
    const visibleKeys = new Set(reports.map(report => `${report.type}:${report.id}`));
    return allReports.some(report => !visibleKeys.has(`${report.type}:${report.id}`));
  }, [allReports, hasReportSubset, reports]);

  const filteredTotals = useMemo(() => {
    if (!showFiltered) return null;
    return layerTotalsFromReports(reports, siteReports, nurseryReports, jobsTotal);
  }, [jobsTotal, nurseryReports, reports, showFiltered, siteReports]);

  const selectionTotals = useMemo(() => {
    if (!hasSelection) return null;
    return layerTotalsFromReports(periodSelectedReports, siteReports, nurseryReports, jobsTotal);
  }, [hasSelection, jobsTotal, nurseryReports, periodSelectedReports, siteReports]);

  const jobsProgress = jobsTotal ?? 0;

  return {
    loading: open && !ready,
    periodTotals,
    filteredTotals,
    selectionTotals,
    jobsProgress
  };
};

export const useReportingPeriodMetricCards = (
  frameworkKey: string | null,
  periodTotals: PeriodMetricTotals,
  jobsProgress: number,
  filteredTotals: MetricLayerTotals | null,
  selectionTotals: MetricLayerTotals | null
): ReportingPeriodMetricCard[] => {
  const t = useT();
  const framework: ReportKeyIndicatorFramework = getReportKeyIndicatorFramework(frameworkKey);

  return useMemo(() => {
    const layers = (
      progress: number,
      filteredValue: number | null | undefined,
      selectionValue: number | null | undefined
    ): Pick<ReportingPeriodMetricCard, "progress" | "filtered" | "selection"> => ({
      progress,
      filtered: filteredTotals == null ? undefined : filteredValue ?? null,
      selection: selectionTotals == null ? undefined : selectionValue ?? null
    });

    if (framework === "ppc") {
      return [
        {
          key: "trees-growing",
          title: t("Trees Growing"),
          tooltip: t(
            "Planted + direct seeded + regenerating this period, aggregated from site reports in this reporting period."
          ),
          ...layers(periodTotals.treesGrowing, filteredTotals?.treesGrowing, selectionTotals?.treesGrowing),
          color: "secondary.600"
        },
        {
          key: "jobs",
          title: t("Workdays Created"),
          tooltip: t("This is the total number of workdays created in this reporting period."),
          ...layers(jobsProgress, filteredTotals?.jobs, selectionTotals?.jobs),
          color: "primary.600"
        }
      ];
    }

    if (framework === "hbf") {
      return [
        {
          key: "trees-growing",
          title: t("Saplings Growing"),
          tooltip: t("Planted + direct seeded + regenerating, reported in this reporting period."),
          ...layers(periodTotals.treesGrowing, filteredTotals?.treesGrowing, selectionTotals?.treesGrowing),
          color: "secondary.600"
        },
        {
          key: "jobs",
          title: t("Workdays Created"),
          tooltip: t("This is the number of direct workdays reported in this reporting period."),
          ...layers(jobsProgress, filteredTotals?.jobs, selectionTotals?.jobs),
          color: "primary.600"
        }
      ];
    }

    return [
      {
        key: "trees-growing",
        title: t("Trees Growing"),
        tooltip: t(
          "Trees planted + direct seeded + naturally regenerating, summed across site reports in this reporting period."
        ),
        ...layers(periodTotals.treesGrowing, filteredTotals?.treesGrowing, selectionTotals?.treesGrowing),
        color: "secondary.600"
      },
      {
        key: "trees-regenerated",
        title: t("Trees Regenerated"),
        tooltip: t("This is the total number of trees naturally regenerating in this reporting period."),
        ...layers(periodTotals.treesRegenerated, filteredTotals?.treesRegenerated, selectionTotals?.treesRegenerated),
        color: "secondary.600"
      },
      {
        key: "jobs",
        title: t("Jobs Created"),
        tooltip: t("This is the number of jobs created in this reporting period."),
        ...layers(jobsProgress, filteredTotals?.jobs, selectionTotals?.jobs),
        color: "primary.600"
      },
      {
        key: "seedlings-grown",
        title: t("Seedlings Grown"),
        tooltip: t("This is the sum of seedlings grown across different nurseries in this reporting period."),
        ...layers(periodTotals.seedlingsGrown, filteredTotals?.seedlingsGrown, selectionTotals?.seedlingsGrown),
        color: "secondary.600"
      }
    ];
  }, [filteredTotals, framework, jobsProgress, periodTotals, selectionTotals, t]);
};
