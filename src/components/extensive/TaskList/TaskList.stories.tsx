import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "../Icon/Icon";
import Component from "./TaskList";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/TaskList",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Get Ready for Funding Opportunities",
    subtitle: "Keep your information updated to have more chances of having a successful application.",
    items: [
      {
        title: "Organizational Information",
        subtitle: "Keep your profile updated to have more chances of having a successful application. ",
        actionText: "View",
        actionUrl: "/",
        iconProps: {
          name: IconNames.BRANCH_CIRCLE,
          className: "fill-success"
        }
      },
      {
        title: "Pitches",
        subtitle:
          'Start a pitch or edit your pitches to apply for funding opportunities. To go to create a pitch, manage your pitches/funding applications, tap on "view".',
        actionText: "View",
        actionUrl: "/",
        iconProps: {
          name: IconNames.BRANCH_CIRCLE,
          className: "fill-success"
        }
      }
    ]
  }
};
