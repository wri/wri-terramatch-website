import { ActionDto } from "@/generated/v3/userService/userServiceSchemas";

import {
  filterDisplayableReportActions,
  getProjectName,
  getProjectUuid,
  getTaskUuid,
  groupSiteAndNurseryReportsByTask,
  isDisplayableStatus
} from "./ReportsCard.utils";

describe("ReportsCard.utils (TM-2947)", () => {
  describe("isDisplayableStatus", () => {
    it("returns true for due status", () => {
      expect(isDisplayableStatus("due")).toBe(true);
    });
    it("returns true for started status", () => {
      expect(isDisplayableStatus("started")).toBe(true);
    });
    it("returns true for needs-more-information status", () => {
      expect(isDisplayableStatus("needs-more-information")).toBe(true);
    });
    it("returns true for requires-more-information status", () => {
      expect(isDisplayableStatus("requires-more-information")).toBe(true);
    });
    it("returns false for approved status", () => {
      expect(isDisplayableStatus("approved")).toBe(false);
    });
    it("returns false for null/undefined", () => {
      expect(isDisplayableStatus(null)).toBe(false);
      expect(isDisplayableStatus(undefined)).toBe(false);
    });
  });

  describe("getProjectUuid", () => {
    it("returns project.uuid when present", () => {
      expect(getProjectUuid({ project: { uuid: "proj-1" } })).toBe("proj-1");
    });
    it("returns projectUuid when project.uuid is missing", () => {
      expect(getProjectUuid({ projectUuid: "proj-2" })).toBe("proj-2");
    });
    it("returns site.project.uuid when others are missing", () => {
      expect(getProjectUuid({ site: { project: { uuid: "proj-3" } } })).toBe("proj-3");
    });
  });

  describe("getTaskUuid", () => {
    it("returns task.uuid when present", () => {
      expect(getTaskUuid({ task: { uuid: "task-1" } })).toBe("task-1");
    });
    it("returns taskUuid when task.uuid is missing", () => {
      expect(getTaskUuid({ taskUuid: "task-2" })).toBe("task-2");
    });
  });

  describe("getProjectName", () => {
    it("returns project.name when present", () => {
      expect(getProjectName({ project: { name: "Project A" } })).toBe("Project A");
    });
    it("returns projectName when project.name is missing", () => {
      expect(getProjectName({ projectName: "Project B" })).toBe("Project B");
    });
  });

  describe("filterDisplayableReportActions", () => {
    it("filters out actions with no target", () => {
      const actions = [{ target: null }] as unknown as ActionDto[];
      expect(filterDisplayableReportActions(actions)).toHaveLength(0);
    });
    it("keeps actions with due status", () => {
      const actions = [{ target: { status: "due" } }] as unknown as ActionDto[];
      expect(filterDisplayableReportActions(actions)).toHaveLength(1);
    });
    it("filters out actions with approved status", () => {
      const actions = [{ target: { status: "approved" } }] as unknown as ActionDto[];
      expect(filterDisplayableReportActions(actions)).toHaveLength(0);
    });
  });

  describe("groupSiteAndNurseryReportsByTask", () => {
    it("groups site reports by taskUuid", () => {
      const actions = [
        { targetableType: "siteReports", target: { taskUuid: "task-1", projectUuid: "proj-1" } },
        { targetableType: "siteReports", target: { taskUuid: "task-1", projectUuid: "proj-1" } }
      ] as unknown as ActionDto[];
      const map = groupSiteAndNurseryReportsByTask(actions);
      expect(map.get("task-1")?.siteReports).toHaveLength(2);
      expect(map.get("task-1")?.nurseryReports).toHaveLength(0);
    });
    it("groups site and nursery reports by task", () => {
      const actions = [
        { targetableType: "siteReports", target: { taskUuid: "task-1", projectUuid: "proj-1" } },
        { targetableType: "nurseryReports", target: { taskUuid: "task-1", projectUuid: "proj-1" } }
      ] as unknown as ActionDto[];
      const map = groupSiteAndNurseryReportsByTask(actions);
      expect(map.get("task-1")?.siteReports).toHaveLength(1);
      expect(map.get("task-1")?.nurseryReports).toHaveLength(1);
    });
    it("ignores site reports without taskUuid", () => {
      const actions = [{ targetableType: "siteReports", target: { projectUuid: "proj-1" } }] as unknown as ActionDto[];
      const map = groupSiteAndNurseryReportsByTask(actions);
      expect(map.size).toBe(0);
    });
  });
});
