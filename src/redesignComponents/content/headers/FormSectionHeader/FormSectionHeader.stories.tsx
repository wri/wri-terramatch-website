import { Meta, StoryObj } from "@storybook/react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

import FormSectionHeader from "./FormSectionHeader";

const meta: Meta<typeof FormSectionHeader> = {
  title: "Redesign Components/Content/Headers/Form Section Header",
  component: FormSectionHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Form Section Header displays a section title with optional label, badge, and status indicator."
      }
    }
  },
  argTypes: {
    status: {
      control: {
        type: "select"
      },
      options: ["error", "complete"],
      description: "Status of the form section header"
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

export const WithStatusComplete: Story = {
  args: {
    title: "Header Title",
    status: "complete"
  }
};

export const WithStatusError: Story = {
  args: {
    title: "Header Title",
    badge: "Label",
    status: "error"
  }
};

export const Review: Story = {
  args: {
    title: "Header Title",
    showBorder: false,
    actions: (
      <Button variant="secondary" onClick={() => console.log("Edit clicked")}>
        Label
      </Button>
    )
  }
};
