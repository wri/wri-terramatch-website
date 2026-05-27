import { Meta, StoryObj } from "@storybook/react";

import BulkActionToolbar from "./BulkActionToolbar";

const meta: Meta<typeof BulkActionToolbar> = {
  title: "Redesign Components/Navigation/Toolbar/Bulk Action Toolbar",
  component: BulkActionToolbar,
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
    primaryButtonProps: {
      description: "Configuration for the primary button"
    },
    secondaryButtonProps: {
      description: "Configuration for the secondary button"
    },
    tertiaryButtonProps: {
      description: "Configuration for the tertiary button"
    },
    ButtonCancel: {
      description: "Configuration for the cancel button on the left"
    },
    ButtonDelete: {
      description: "Configuration for the delete button, styled in error colors by default"
    },
    items: {
      description: "Number of items selected"
    }
  }
};

export default meta;
type Story = StoryObj<typeof BulkActionToolbar>;

export const Default: Story = {
  args: {
    ButtonCancel: {
      children: "Cancel",
      onClick: () => console.log("Cancel clicked")
    },
    primaryButtonProps: {
      children: "Label",
      onClick: () => console.log("Primary action clicked")
    },
    secondaryButtonProps: {
      children: "Label",
      onClick: () => console.log("Secondary action clicked")
    },
    tertiaryButtonProps: {
      children: "Label",
      onClick: () => console.log("Tertiary action clicked")
    },
    quantityButtonProps: {
      children: "Label",
      onClick: () => console.log("Quantity action clicked")
    },
    items: "XXX",
    ButtonDelete: {
      children: "Delete",
      onClick: () => console.log("Delete clicked")
    }
  }
};
