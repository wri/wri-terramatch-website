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
    selectedCount: {
      description: "Number of items selected"
    },
    cancelAction: {
      description: "Configuration for the cancel button on the left"
    },
    deleteAction: {
      description: "Configuration for the delete button"
    },
    actions: {
      description:
        "Ordered secondary actions rendered between delete and the primary action. Optional `tooltip` is shown only when the action is disabled."
    },
    primaryAction: {
      description: "Filled primary action (e.g. submit)"
    },
    infoTooltip: {
      description: "Optional tooltip beside the primary action"
    }
  }
};

export default meta;
type Story = StoryObj<typeof BulkActionToolbar>;

export const Default: Story = {
  args: {
    selectedCount: 3,
    cancelAction: {
      children: "Cancel",
      onClick: () => console.log("Cancel clicked")
    },
    deleteAction: {
      id: "delete",
      tone: "danger",
      children: "Delete",
      onClick: () => console.log("Delete clicked")
    },
    actions: [
      {
        id: "download",
        children: "Download",
        onClick: () => console.log("Download clicked")
      },
      {
        id: "validate",
        children: "Run Validation",
        onClick: () => console.log("Validate clicked")
      },
      {
        id: "edit",
        children: "Edit",
        onClick: () => console.log("Edit clicked")
      }
    ],
    primaryAction: {
      children: "Submit",
      onClick: () => console.log("Submit clicked")
    }
  }
};

export const DisabledActionTooltip: Story = {
  args: {
    ...Default.args,
    deleteAction: {
      id: "delete",
      tone: "danger",
      children: "Delete",
      disabled: true,
      tooltip: "This profile can't be deleted because it's already submitted or approved",
      onClick: () => console.log("Delete clicked")
    }
  }
};
