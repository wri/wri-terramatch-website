import { Meta, StoryObj } from "@storybook/react";

import Button from "@/components/elements/Button/Button";

import Component from "./StatusBar";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/StatusBar",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <div className="flex items-start justify-start">
        <Story />
      </div>
    )
  ],
  args: {
    status: "success",
    children: (
      <div className="flex gap-3">
        <Button variant="secondary">View Feedback</Button>
        <Button variant="secondary">Learn More</Button>
        <Button>Setup Project</Button>
      </div>
    ),
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  }
};

export const Error: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "error"
  }
};

export const Draft: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "edit"
  }
};

export const Awaiting: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "awaiting"
  }
};

export const Warning: Story = {
  ...Default,
  args: {
    ...Default.args,
    status: "warning"
  }
};
