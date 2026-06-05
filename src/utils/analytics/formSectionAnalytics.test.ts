import { FieldErrors } from "react-hook-form";

import { extractErrorType, resolveFormSectionEntityType, trackFormSectionAnalyticsEvent } from "./formSectionAnalytics";

describe("formSectionAnalytics", () => {
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

  describe("resolveFormSectionEntityType", () => {
    it("maps establishment and report models to singular entity types", () => {
      expect(resolveFormSectionEntityType("projects")).toBe("project");
      expect(resolveFormSectionEntityType("sites")).toBe("site");
      expect(resolveFormSectionEntityType("nurseries")).toBe("nursery");
      expect(resolveFormSectionEntityType("projectReports")).toBe("project");
      expect(resolveFormSectionEntityType("siteReports")).toBe("site");
      expect(resolveFormSectionEntityType("nurseryReports")).toBe("nursery");
    });

    it("returns null for untracked models", () => {
      expect(resolveFormSectionEntityType("organisations")).toBeNull();
      expect(resolveFormSectionEntityType("projectPitches")).toBeNull();
      expect(resolveFormSectionEntityType(null)).toBeNull();
    });
  });

  describe("extractErrorType", () => {
    it("prefers the react-hook-form error type", () => {
      const errors: FieldErrors = {
        projectName: { type: "required", message: "Project name is required" }
      };

      expect(extractErrorType(errors)).toBe("required");
    });

    it("falls back to the field name when no error metadata exists", () => {
      expect(extractErrorType({})).toBeUndefined();
      expect(extractErrorType({ siteName: {} })).toBe("siteName");
    });
  });

  describe("trackFormSectionAnalyticsEvent", () => {
    it("sends GA4 events through gtag and dataLayer aligned with ga4.ts", () => {
      trackFormSectionAnalyticsEvent("section_started", {
        entityType: "project",
        entityId: "project-uuid",
        sectionName: "Project Overview",
        formStepId: "step-123"
      });

      expect(gtag).toHaveBeenCalledWith("event", "section_started", {
        entity_type: "project",
        entity_id: "project-uuid",
        section_name: "Project Overview",
        form_step_id: "step-123"
      });
      expect(dataLayer).toContainEqual({
        event: "section_started",
        entity_type: "project",
        entity_id: "project-uuid",
        section_name: "Project Overview",
        form_step_id: "step-123"
      });
    });

    it("includes optional error_type for validation events", () => {
      trackFormSectionAnalyticsEvent("section_error_triggered", {
        entityType: "site",
        entityId: "site-uuid",
        sectionName: "Site Overview",
        formStepId: "step-456",
        errorType: "required"
      });

      expect(gtag).toHaveBeenCalledWith("event", "section_error_triggered", {
        entity_type: "site",
        entity_id: "site-uuid",
        section_name: "Site Overview",
        form_step_id: "step-456",
        error_type: "required"
      });
    });

    it("no-ops gtag when unavailable but still pushes to dataLayer", () => {
      delete window.gtag;

      trackFormSectionAnalyticsEvent("section_completed", {
        entityType: "nursery",
        entityId: "nursery-uuid",
        sectionName: "Nursery Details",
        formStepId: "step-789"
      });

      expect(gtag).not.toHaveBeenCalled();
      expect(dataLayer).toContainEqual({
        event: "section_completed",
        entity_type: "nursery",
        entity_id: "nursery-uuid",
        section_name: "Nursery Details",
        form_step_id: "step-789"
      });
    });
  });
});
