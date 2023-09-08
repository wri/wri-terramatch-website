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
        body: <div>step 1 body</div>
      },
      {
        title: "Social Media Presence",
        body: <div>step 2 body</div>
      },
      {
        title: "This is a very long tab title too long to fit into one line",
        body: <div>step 3 body</div>
      },
      {
        title: "Additional Information",
        body: <div>step 4 body</div>
      }
    ]
  }
};

export const Vertical: Story = {
  args: {
    ...Horizontal.args,
    vertical: true
  }
};
