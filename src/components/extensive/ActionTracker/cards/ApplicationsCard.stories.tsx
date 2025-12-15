import { Meta, StoryObj } from "@storybook/react";

import { ApplicationDto, EmbeddedSubmissionDto } from "@/generated/v3/entityService/entityServiceSchemas";

import Component from "./ApplicationsCard";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/ActionTracker/ApplicationsCard",
  component: Component
};
export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    applications: [
      {
        submissions: [{ status: "approved" } as EmbeddedSubmissionDto],
        fundingProgrammeName: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        organisationName: "Milad's organisation"
      } as ApplicationDto,
      {
        submissions: [{ status: "started" } as EmbeddedSubmissionDto],
        fundingProgrammeName: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        organisationName: "Milad's organisation"
      } as ApplicationDto,
      {
        submissions: [{ status: "started" } as EmbeddedSubmissionDto],
        fundingProgrammeName: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        organisationName: "Milad's organisation"
      } as ApplicationDto,
      {
        submissions: [{ status: "rejected" } as EmbeddedSubmissionDto],
        fundingProgrammeName: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        organisationName: "Milad's organisation"
      } as ApplicationDto,
      {
        submissions: [{ status: "requires-more-information" } as EmbeddedSubmissionDto],
        fundingProgrammeName: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        organisationName: "Milad's organisation"
      } as ApplicationDto,
      {
        submissions: [{ status: "awaiting-approval" } as EmbeddedSubmissionDto],
        fundingProgrammeName: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        organisationName: "Milad's organisation"
      } as ApplicationDto
    ]
  }
};
