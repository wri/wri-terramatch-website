import { Meta, StoryObj } from "@storybook/react";

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
        current_submission: {
          name: "Approved submission",
          status: "approved"
        },
        funding_programme_name: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        //@ts-expect-error
        funding_programme_status: "active",
        organisation_name: "Milad's organisation"
      },
      {
        current_submission: {
          name: "Started submission",
          status: "started"
        },
        funding_programme_name: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        //@ts-expect-error
        funding_programme_status: "active",
        organisation_name: "Milad's organisation"
      },
      {
        current_submission: {
          name: "Started submission",
          status: "started"
        },
        funding_programme_name: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        //@ts-expect-error
        funding_programme_status: "disabled",
        organisation_name: "Milad's organisation"
      },
      {
        current_submission: {
          name: "Rejected submission",
          status: "rejected"
        },
        funding_programme_name: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        //@ts-expect-error
        funding_programme_status: "active",
        organisation_name: "Milad's organisation"
      },
      {
        current_submission: {
          name: "More information requested",
          status: "requires-more-information"
        },
        funding_programme_name: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        //@ts-expect-error
        funding_programme_status: "active",
        organisation_name: "Milad's organisation"
      },
      {
        current_submission: {
          name: "Awaiting Approval",
          status: "awaiting-approval"
        },
        funding_programme_name: "TerraFund for AFR100: Landscapes - Expression of Interest (Enterprises)",
        //@ts-expect-error
        funding_programme_status: "active",
        organisation_name: "Milad's organisation"
      }
    ]
  }
};
