import { Meta, StoryObj } from "@storybook/react";

import ToolbarForm from "./ToolbarForm";

const meta: Meta<typeof ToolbarForm> = {
  title: "Redesign Components/Navigation/Toolbar/Toolbar Form",
  component: ToolbarForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  decorators: [
    Story => (
      <div style={{ backgroundColor: "#F5F5F5", padding: "20px", borderRadius: "8px" }}>
        <Story />
      </div>
    )
  ],
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed on the left side of the toolbar"
    },
    ButtonPrimary: {
      description: "Configuration for the primary button (rendered with variant='primary')"
    },
    ButtonSecondary: {
      description: "Configuration for the secondary button (rendered with variant='secondary')"
    },
    ButtonTertiary: {
      description: "Configuration for the tertiary button (rendered with variant='borderless')"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ToolbarForm>;

/**
 * Default ToolbarForm with standard button labels
 */
export const Default: Story = {
  args: {
    label: "Form Title",
    ButtonPrimary: {
      children: "Save",
      onClick: () => console.log("Save clicked")
    },
    ButtonSecondary: {
      children: "Cancel",
      onClick: () => console.log("Cancel clicked")
    },
    ButtonTertiary: {
      children: "Delete",
      onClick: () => console.log("Delete clicked")
    }
  }
};
