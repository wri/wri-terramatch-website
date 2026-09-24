import type { ReportsIndexReport } from "./reportIndex.types";
import { isReportSubmittable } from "./reportIndex.utils";

const report: ReportsIndexReport = {
  id: "report-id",
  name: "Example",
  projectName: "Project",
  type: "site-report",
  status: "due",
  nothingToReport: false,
  updateRequestStatus: null,
  completion: null,
  updatedAt: "2026-09-14"
};

describe("report submission eligibility", () => {
  it("allows a due report marked Nothing to Report to be submitted", () => {
    expect(isReportSubmittable({ ...report, nothingToReport: true })).toBe(true);
    expect(isReportSubmittable(report)).toBe(false);
  });

  it("does not submit an already submitted or approved Nothing to Report report", () => {
    expect(isReportSubmittable({ ...report, status: "pending-approval", nothingToReport: true })).toBe(false);
    expect(isReportSubmittable({ ...report, status: "approved", nothingToReport: true })).toBe(false);
  });

  it("keeps an open change request draft from being submitted", () => {
    expect(isReportSubmittable({ ...report, nothingToReport: true, updateRequestStatus: "draft" })).toBe(false);
  });

  it("still requires completion for an ordinary draft report", () => {
    expect(isReportSubmittable({ ...report, status: "draft", completion: 80 })).toBe(false);
    expect(isReportSubmittable({ ...report, status: "draft", completion: 100 })).toBe(true);
  });
});
