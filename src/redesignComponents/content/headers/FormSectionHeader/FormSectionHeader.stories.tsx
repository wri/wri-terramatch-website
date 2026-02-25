import { Meta, StoryObj } from "@storybook/react";

import FormSectionHeader from "./FormSectionHeader";

const meta: Meta<typeof FormSectionHeader> = {
  title: "Redesign Components/Content/Headers/FormSectionHeader",
  component: FormSectionHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "FormSectionHeader displays a section title with optional label, badge, and status indicator."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof FormSectionHeader>;

export const Default: Story = {
  args: {
    title: "Header Title"
  }
};

export const WithLabel: Story = {
  args: {
    title: "Header Title"
  }
};

export const WithStatusComplete: Story = {
  args: {
    title: "Header Title",
    status: "complete"
  }
};

export const WithStatusError: Story = {
  args: {
    title: "Header Title",
    badge: "label",
    status: "error"
  }
};

export const WithStatusLabel: Story = {
  args: {
    title: "Header Title",
    status: "error",
    badge: "label",
    statusLabel: "3 requires attention"
  }
};
