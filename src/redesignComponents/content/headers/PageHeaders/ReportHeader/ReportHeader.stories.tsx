import type { Meta, StoryObj } from "@storybook/react";

import { SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import ReportHeader, { ReportHeaderProps } from "./ReportHeader";

const meta: Meta<typeof ReportHeader> = {
  title: "Redesign Components/Content/Headers/Report Header",
  component: ReportHeader,
  tags: ["autodocs"],
  argTypes: {
    report: {
      control: "object",
      description: "The report data object (any report DTO variant)"
    },
    title: {
      control: "text",
      description: "Page title displayed in the header"
    },
    dueAt: {
      control: "text",
      description: "Override due date (ISO string). Falls back to report.dueAt"
    },
    entityName: {
      control: "select",
      options: [
        "site-report",
        "nursery-report",
        "project-report",
        "disturbance-report",
        "financial-report",
        "srp-report"
      ],
      description: "Entity type that determines which fields are used"
    }
  }
};

export default meta;

type Story = StoryObj<ReportHeaderProps>;

const COMMON_FIELDS = {
  lightResource: false,
  uuid: "550e8400-e29b-41d4-a716-446655440001",
  status: "pending-approval" as const,
  updateRequestStatus: null,
  feedback: null,
  feedbackFields: null,
  dueAt: "2025-06-30T00:00:00.000Z",
  updatedAt: "2025-07-01T12:00:00.000Z",
  createdAt: "2025-01-15T08:00:00.000Z",
  organisationName: "Organization Name",
  organisationUuid: "00000000-0000-0000-0000-000000000010",
  createdByFirstName: "Jane",
  createdByLastName: "Doe"
};

const baseSiteReport: SiteReportFullDto = {
  ...COMMON_FIELDS,
  siteName: "Kakamega Forest Site",
  siteUuid: "00000000-0000-0000-0000-000000000020",
  projectName: "Project Name",
  projectUuid: "00000000-0000-0000-0000-000000000030",
  projectReportUuid: "00000000-0000-0000-0000-000000000031",
  frameworkKey: "terrafund",
  completion: 72,
  reportTitle: "Site Report Q2 2025",
  nothingToReport: false,
  projectReportTitle: "Q2 2025 Project Report"
} as unknown as SiteReportFullDto;

export const Default: Story = {
  args: {
    report: baseSiteReport,
    title: "Report Name",
    entityName: "site-report"
  }
};

export const NoData: Story = {
  args: {
    report: {
      ...baseSiteReport,
      createdByFirstName: null,
      createdByLastName: null
    },
    title: "Report Name",
    entityName: "site-report"
  }
};
