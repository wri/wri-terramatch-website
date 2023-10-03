import { Meta, StoryObj } from "@storybook/react";

import Component from "./BuildStrongerProfile";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/BuildStrongerProfile",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const White: Story = {
  args: {
    title: "Build a Stronger Pitch",
    subtitle: "Pitches with strong profiles are more likely to be successful in funding applications.",
    listTitle: "Adding these items would make your profile stronger:",
    className: "border border-neutral-400 shadow",
    ctaProps: {
      children: "Edit Profile"
    },
    steps: [
      {
        visible: true,
        title: "Add Organizational Budget",
        subtitle:
          "Note that the budget denotes the amount of money managed by your organization in the given year, converted into USD."
      },
      {
        visible: true,
        title: "Add Financial Documents",
        subtitle:
          "Note that your organisation's financial documents denotes the amount of money managed by your organization in the given year, converted into USD."
      }
    ]
  }
};

export const Neutral150: Story = {
  args: {
    ...White.args,
    backgroundColor: "bg-neutral-150"
  }
};
