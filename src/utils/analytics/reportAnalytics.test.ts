import { FormFieldsProvider } from "@/context/wizardForm.provider";

import {
  getAnalyticsUserRole,
  isReportReopenedStatus,
  ReportEntityType,
  resolveReportEntityType,
  resolveReportEntityTypeFromEntityName,
  resolveReportSectionName,
  trackReportAnalyticsEvent
} from "./reportAnalytics";

describe("reportAnalytics", () => {
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

  describe("resolveReportEntityType", () => {
    it("maps tracked report models to GA4 entity types", () => {
      expect(resolveReportEntityType("projectReports")).toBe("project-report");
      expect(resolveReportEntityType("siteReports")).toBe("site-report");
      expect(resolveReportEntityType("nurseryReports")).toBe("nursery-report");
      expect(resolveReportEntityType("financialReports")).toBe("financial-report");
    });

    it("returns null for non-report models", () => {
      expect(resolveReportEntityType("projects")).toBeNull();
      expect(resolveReportEntityType("srpReports")).toBeNull();
      expect(resolveReportEntityType("disturbanceReports")).toBeNull();
    });
  });

  describe("resolveReportEntityTypeFromEntityName", () => {
    it("maps kebab-case report entity names", () => {
      expect(resolveReportEntityTypeFromEntityName("project-reports")).toBe("project-report");
      expect(resolveReportEntityTypeFromEntityName("financial-reports")).toBe("financial-report");
    });
  });

  describe("getAnalyticsUserRole", () => {
    const originalHref = window.location.href;

    afterEach(() => {
      window.history.replaceState({}, "", originalHref);
    });

    it("derives admin role from admin URLs", () => {
      window.history.replaceState({}, "", "/admin#/projectReport/123");
      expect(getAnalyticsUserRole()).toBe("admin");
    });

    it("derives project-developer role outside admin URLs", () => {
      window.history.replaceState({}, "", "/entity/project-reports/edit/123");
      expect(getAnalyticsUserRole()).toBe("project-developer");
    });
  });

  describe("isReportReopenedStatus", () => {
    it("identifies in-progress report statuses", () => {
      expect(isReportReopenedStatus("started")).toBe(true);
      expect(isReportReopenedStatus("needs-more-information")).toBe(true);
      expect(isReportReopenedStatus("due")).toBe(false);
      expect(isReportReopenedStatus("awaiting-approval")).toBe(false);
    });
  });

  describe("resolveReportSectionName", () => {
    const fieldsProvider = {
      step: (stepId: string) => ({
        id: stepId,
        title: stepId === "step-uuid" ? null : "Project Overview"
      })
    } as FormFieldsProvider;

    it("returns canonical section titles and avoids raw UUIDs", () => {
      expect(resolveReportSectionName(fieldsProvider, "overview-step")).toBe("Project Overview");
      expect(resolveReportSectionName(fieldsProvider, "step-uuid")).toBe("");
    });
  });

  describe("trackReportAnalyticsEvent", () => {
    it("sends GA4 report events through gtag and dataLayer", () => {
      trackReportAnalyticsEvent("report_opened", {
        entityType: "project-report" as ReportEntityType,
        entityId: "report-uuid",
        userRole: "project-developer",
        page_context: "report_overview"
      });

      expect(gtag).toHaveBeenCalledWith("event", "report_opened", {
        entity_type: "project-report",
        entity_id: "report-uuid",
        user_role: "project-developer",
        page_context: "report_overview"
      });
      expect(dataLayer).toContainEqual({
        event: "report_opened",
        entity_type: "project-report",
        entity_id: "report-uuid",
        user_role: "project-developer",
        page_context: "report_overview"
      });
    });

    it("omits optional params when they are blank", () => {
      trackReportAnalyticsEvent("report_opened", {
        entityType: "project-report" as ReportEntityType,
        entityId: "report-uuid",
        userRole: "project-developer",
        page_context: "report_overview",
        entry_point: ""
      });

      expect(gtag).toHaveBeenCalledWith("event", "report_opened", {
        entity_type: "project-report",
        entity_id: "report-uuid",
        user_role: "project-developer",
        page_context: "report_overview"
      });
    });

    it("does not send events when entity context is missing", () => {
      trackReportAnalyticsEvent("report_opened", {
        entityType: "project-report" as ReportEntityType,
        entityId: "",
        userRole: "project-developer"
      });

      expect(gtag).not.toHaveBeenCalled();
      expect(dataLayer).toHaveLength(0);
    });

    it("includes section navigation parameters", () => {
      trackReportAnalyticsEvent("form_nav_clicked", {
        entityType: "site-report" as ReportEntityType,
        entityId: "report-uuid",
        userRole: "admin",
        target_section: "Site Overview",
        current_section: "Planting Progress"
      });

      expect(gtag).toHaveBeenCalledWith("event", "form_nav_clicked", {
        entity_type: "site-report",
        entity_id: "report-uuid",
        user_role: "admin",
        target_section: "Site Overview",
        current_section: "Planting Progress"
      });
    });
  });
});
