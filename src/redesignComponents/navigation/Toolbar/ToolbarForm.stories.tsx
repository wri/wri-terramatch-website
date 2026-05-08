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
      <div style={{ backgroundColor: "#F5F5F5", padding: "1.25rem", borderRadius: "0.5rem" }}>
        <Story />
      </div>
    )
  ],
  argTypes: {
    cancelButtonProps: {
      description: "Configuration for the left button (rendered with variant='borderless')"
    },
    primaryButtonProps: {
      description: "Configuration for the primary button (rendered with variant='primary')"
    },
    secondaryButtonProps: {
      description: "Configuration for the secondary button (rendered with variant='secondary')"
    },
    tertiaryButtonProps: {
      description: "Configuration for the tertiary button (rendered with variant='borderless')"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ToolbarForm>;

export const Default: Story = {
  args: {
    cancelButtonProps: {
      children: "Label",
      onClick: () => console.log("Back clicked")
    },
    primaryButtonProps: {
      children: "Label",
      onClick: () => console.log("Save clicked")
    },
    secondaryButtonProps: {
      children: "Label",
      onClick: () => console.log("Cancel clicked")
    },
    tertiaryButtonProps: {
      children: "Label",
      onClick: () => console.log("Delete clicked")
    }
  }
};
