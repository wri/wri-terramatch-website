import { Meta, StoryObj } from "@storybook/react";

import ToolbarForm from "./ToolbarForm";

const meta: Meta<typeof ToolbarForm> = {
  title: "Redesign Components/Navigation/Toolbar/Form Action Toolbar",
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
    ButtonLeft: {
      description: "Configuration for the left button (rendered with variant='borderless')"
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

export const Default: Story = {
  args: {
    ButtonLeft: {
      children: "Label",
      onClick: () => console.log("Back clicked")
    },
    ButtonPrimary: {
      children: "Label",
      onClick: () => console.log("Save clicked")
    },
    ButtonSecondary: {
      children: "Label",
      onClick: () => console.log("Cancel clicked")
    },
    ButtonTertiary: {
      children: "Label",
      onClick: () => console.log("Delete clicked")
    }
  }
};
