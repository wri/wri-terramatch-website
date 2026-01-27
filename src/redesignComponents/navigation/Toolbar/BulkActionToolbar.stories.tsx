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
      <div style={{ backgroundColor: "#F5F5F5", padding: "20px", borderRadius: "8px" }}>
        <Story />
      </div>
    )
  ],
  argTypes: {
    ButtonPrimary: {
      description: "Configuration for the primary button (rendered with variant='primary')"
    },
    ButtonSecondary: {
      description: "Configuration for the secondary button (rendered with variant='secondary')"
    },
    ButtonTertiary: {
      description: "Configuration for the tertiary button (rendered with variant='secondary')"
    },
    ButtonCancel: {
      description: "Configuration for the cancel button (rendered with variant='borderless')"
    },
    ButtonDelete: {
      description: "Configuration for the delete button (rendered with variant='secondary')"
    },
    ButtonMenu: {
      description: "Configuration for the multi-action button menu (rendered with variant='secondary')"
    }
  }
};

export default meta;
type Story = StoryObj<typeof BulkActionToolbar>;

/**
 * Default BulkActionToolbar with standard button labels
 */
export const Default: Story = {
  args: {
    ButtonCancel: {
      children: "Cancel",
      onClick: () => console.log("Cancel clicked")
    },
    ButtonPrimary: {
      children: "Apply",
      onClick: () => console.log("Apply clicked")
    },
    ButtonSecondary: {
      children: "Archive",
      onClick: () => console.log("Archive clicked")
    },
    ButtonTertiary: {
      children: "Export",
      onClick: () => console.log("Export clicked")
    },
    ButtonMenu: {
      mainActionLabel: "More Actions",
      mainActionOnClick: () => console.log("More Actions clicked"),
      otherActions: [
        {
          label: "Duplicate",
          value: "duplicate",
          onClick: () => console.log("Duplicate clicked")
        },
        {
          label: "Share",
          value: "share",
          onClick: () => console.log("Share clicked")
        }
      ]
    },
    ButtonDelete: {
      children: "Delete",
      onClick: () => console.log("Delete clicked")
    }
  }
};

/**
 * BulkActionToolbar with different actions
 */
export const MultipleActions: Story = {
  args: {
    ButtonCancel: {
      children: "Cancel Selection",
      onClick: () => console.log("Cancel Selection clicked")
    },
    ButtonPrimary: {
      children: "Process All",
      onClick: () => console.log("Process All clicked")
    },
    ButtonSecondary: {
      children: "Archive All",
      onClick: () => console.log("Archive All clicked")
    },
    ButtonTertiary: {
      children: "Export All",
      onClick: () => console.log("Export All clicked")
    },
    ButtonMenu: {
      mainActionLabel: "More",
      mainActionOnClick: () => console.log("More clicked"),
      otherActions: [
        {
          label: "Mark as Read",
          value: "mark-read",
          onClick: () => console.log("Mark as Read clicked")
        },
        {
          label: "Mark as Unread",
          value: "mark-unread",
          onClick: () => console.log("Mark as Unread clicked")
        },
        {
          label: "Move to Folder",
          value: "move",
          onClick: () => console.log("Move to Folder clicked")
        }
      ]
    },
    ButtonDelete: {
      children: "Delete All",
      onClick: () => console.log("Delete All clicked")
    }
  }
};

/**
 * BulkActionToolbar with loading state
 */
export const WithLoading: Story = {
  args: {
    ButtonCancel: {
      children: "Cancel",
      onClick: () => console.log("Cancel clicked")
    },
    ButtonPrimary: {
      children: "Process",
      onClick: () => console.log("Process clicked"),
      loading: true
    },
    ButtonSecondary: {
      children: "Archive",
      onClick: () => console.log("Archive clicked")
    },
    ButtonTertiary: {
      children: "Export",
      onClick: () => console.log("Export clicked")
    },
    ButtonMenu: {
      mainActionLabel: "More Actions",
      mainActionOnClick: () => console.log("More Actions clicked"),
      otherActions: [
        {
          label: "Duplicate",
          value: "duplicate",
          onClick: () => console.log("Duplicate clicked")
        }
      ]
    },
    ButtonDelete: {
      children: "Delete",
      onClick: () => console.log("Delete clicked")
    }
  }
};
