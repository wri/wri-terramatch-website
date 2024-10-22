import { Meta, StoryObj } from "@storybook/react";

import Accordion from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Elements/Accordion",
  component: Accordion
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    title: "Accordion Title",
    children: (
      <div>
        <p>Expandable Body</p>
      </div>
    )
  }
};

export const Secondary: Story = {
  args: {
    ...Default.args,
    variant: "secondary"
  }
};

export const WithCTA: Story = {
  args: {
    ...Default.args,
    ctaButtonProps: {
      text: "Edit",
      onClick: console.log
    }
  }
};
