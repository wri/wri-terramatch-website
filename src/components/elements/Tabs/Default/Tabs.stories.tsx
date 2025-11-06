import { Meta, StoryObj } from "@storybook/react";

import Component from "./Tabs";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Tabs",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Horizontal: Story = {
  args: {
    itemOption: {
      width: 240
    },
    tabItems: [
      {
        title: "Organization Details",
        renderBody: () => <div>step 1 body</div>
      },
      {
        title: "Social Media Presence",
        renderBody: () => <div>step 2 body</div>
      },
      {
        title: "This is a very long tab title too long to fit into one line",
        renderBody: () => <div>step 3 body</div>
      },
      {
        title: "Additional Information",
        renderBody: () => <div>step 4 body</div>
      }
    ]
  }
};
