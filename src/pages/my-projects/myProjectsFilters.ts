import { useT } from "@transifex/react";

export type MyProjectsFilterOption = { value: string; title: string };

type Translate = ReturnType<typeof useT>;

export const getProjectStatusOptions = (t: Translate): MyProjectsFilterOption[] => [
  { value: "draft", title: t("Draft") },
  { value: "pending-approval", title: t("Pending Approval") },
  { value: "information-required", title: t("Information Required") },
  { value: "approved", title: t("Approved") }
];

export const getPlantingStatusOptions = (t: Translate): MyProjectsFilterOption[] => [
  { value: "not-started", title: t("Not Started") },
  { value: "in-progress", title: t("In Progress") },
  { value: "completed", title: t("Complete") },
  { value: "not-available", title: t("Not Available") }
];
