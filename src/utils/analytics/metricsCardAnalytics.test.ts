import {
  createMetricsCardCtaHandler,
  resolveMetricsCardEntityType,
  toMetricLabel,
  trackMetricsCardAnalyticsEvent
} from "./metricsCardAnalytics";

export { createMetricsCardCtaHandler, resolveMetricsCardEntityType, toMetricLabel, trackMetricsCardAnalyticsEvent };

describe("metricsCardAnalytics", () => {
  const gtag = jest.fn();
  const dataLayer: Record<string, unknown>[] = [];

  beforeEach(() => {
    gtag.mockClear();
    dataLayer.length = 0;
    window.gtag = gtag;
    window.dataLayer = dataLayer;
  });

  afterEach(() => {
    delete window.gtag;
    delete window.dataLayer;
  });

  describe("resolveMetricsCardEntityType", () => {
    it("maps report entity names and form models to metrics card entity types", () => {
      expect(resolveMetricsCardEntityType("project-reports")).toBe("project-report");
      expect(resolveMetricsCardEntityType("site-reports")).toBe("site-report");
      expect(resolveMetricsCardEntityType("nursery-reports")).toBe("nursery-report");
      expect(resolveMetricsCardEntityType("financial-reports")).toBe("financial-report");
      expect(resolveMetricsCardEntityType("projectReports")).toBe("project-report");
    });

    it("returns null for untracked entities", () => {
      expect(resolveMetricsCardEntityType("projects")).toBeNull();
      expect(resolveMetricsCardEntityType(null)).toBeNull();
    });
  });

  describe("toMetricLabel", () => {
    it("prefers an explicit metric label", () => {
      expect(toMetricLabel("trees_planted", "treesPlanted")).toBe("trees_planted");
    });

    it("derives snake_case labels from metric card type", () => {
      expect(toMetricLabel(undefined, "hectaresRestored")).toBe("hectares_restored");
    });
  });

  describe("trackMetricsCardAnalyticsEvent", () => {
    it("sends GA4 events through gtag and dataLayer aligned with ga4.ts", () => {
      trackMetricsCardAnalyticsEvent("metrics_card_viewed", {
        entityType: "project-report",
        entityId: "report-uuid"
      });

      expect(gtag).toHaveBeenCalledWith("event", "metrics_card_viewed", {
        entity_type: "project-report",
        entity_id: "report-uuid"
      });
      expect(dataLayer).toContainEqual({
        event: "metrics_card_viewed",
        entity_type: "project-report",
        entity_id: "report-uuid"
      });
    });

    it("includes metric_label for tooltip engagement events", () => {
      trackMetricsCardAnalyticsEvent("metrics_card_tooltip_engaged", {
        entityType: "site-report",
        entityId: "site-report-uuid",
        metricLabel: "survival_rate"
      });

      expect(gtag).toHaveBeenCalledWith("event", "metrics_card_tooltip_engaged", {
        entity_type: "site-report",
        entity_id: "site-report-uuid",
        metric_label: "survival_rate"
      });
    });

    it("no-ops when entity_id is missing", () => {
      trackMetricsCardAnalyticsEvent("metrics_card_viewed", {
        entityType: "nursery-report",
        entityId: ""
      });

      expect(gtag).not.toHaveBeenCalled();
      expect(dataLayer).toHaveLength(0);
    });

    it("no-ops tooltip events when metric_label is empty", () => {
      trackMetricsCardAnalyticsEvent("metrics_card_tooltip_engaged", {
        entityType: "nursery-report",
        entityId: "nursery-report-uuid",
        metricLabel: ""
      });

      expect(gtag).not.toHaveBeenCalled();
      expect(dataLayer).toHaveLength(0);
    });
  });

  describe("createMetricsCardCtaHandler", () => {
    it("tracks CTA clicks before invoking the original handler", () => {
      const onClick = jest.fn();
      const handleClick = createMetricsCardCtaHandler(
        { entityType: "project-report", entityId: "report-uuid" },
        onClick
      );

      handleClick();

      expect(gtag).toHaveBeenCalledWith("event", "metrics_card_cta_clicked", {
        entity_type: "project-report",
        entity_id: "report-uuid"
      });
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
