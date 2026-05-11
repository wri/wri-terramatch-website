import type { Meta, StoryObj } from "@storybook/react";

import Avatar from "./Avatar";

const meta = {
  title: "Redesign Components/Navigation/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "User's full name for initials generation"
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description:
        "Predefined avatar sizes: small (1.5625rem/25px, font 12px), medium (2.375rem/38px, font 16px), large (3rem/48px, font 20px)"
    },
    customSize: {
      control: "text",
      description: "Custom size in CSS units (e.g., '3.75rem')"
    },
    src: {
      control: "text",
      description: "Image source URL"
    },
    srcSet: {
      control: "text",
      description: "Responsive image sources"
    },
    onClick: {
      action: "clicked",
      description: "Click handler function"
    },
    notificationCount: {
      control: "number",
      description: "Badge count for notifications"
    },
    disabled: {
      control: "boolean",
      description: "Disabled state"
    },
    customBackgroundColor: {
      control: "color",
      description: "Custom background color for initials avatar"
    },
    ariaLabel: {
      control: "text",
      description: "Accessibility label"
    },
    variant: {
      control: "select",
      options: ["default", "add"],
      description: "Avatar variant: default (initials/image) or add (UserAdd icon)"
    }
  }
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {
  args: {
    name: "Nathan Smith",
    ariaLabel: "Nathan Smith avatar"
  }
};

export const Image: Story = {
  args: {
    name: "Jane Doe",
    src: "https://i.pravatar.cc/150?img=1",
    ariaLabel: "Jane Doe avatar with profile picture"
  }
};

export const Add: Story = {
  args: {
    name: "Add User",
    ariaLabel: "Add new user",
    onClick: () => console.log("Add user clicked"),
    variant: "add"
  },
  render: args => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Avatar {...args} />
      <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Add member</span>
    </div>
  )
};

export const Small: Story = {
  args: {
    name: "Nathan Smith",
    size: "small",
    ariaLabel: "Small avatar"
  }
};

export const Medium: Story = {
  args: {
    name: "Nathan Smith",
    size: "medium",
    ariaLabel: "Medium avatar"
  }
};

export const WithNotification: Story = {
  args: {
    name: "Nathan Smith",
    src: "https://i.pravatar.cc/150?img=5",
    notificationCount: 3,
    ariaLabel: "Avatar with 3 notifications"
  }
};

export const SizeComparison: Story = {
  args: {
    name: "Nathan Smith"
  },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <Avatar name="Nathan Smith" size="small" />
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>Small (1.5625rem)</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Avatar name="Nathan Smith" size="medium" />
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>Medium (2.375rem)</p>
      </div>
    </div>
  )
};

export const VariantComparison: Story = {
  args: {
    name: "Nathan Smith"
  },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <Avatar name="Nathan Smith" />
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>Initials</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Avatar name="Jane Doe" src="https://i.pravatar.cc/150?img=1" />
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>Image</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Avatar
          name="Add User"
          customBackgroundColor="#E5E7EB"
          onClick={() => console.log("Add clicked")}
          variant="add"
        />
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>Add</p>
      </div>
    </div>
  )
};

export const AddSizes: Story = {
  args: {
    name: "Add User"
  },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <Avatar name="Add User" size="small" variant="add" onClick={() => console.log("Small add clicked")} />
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>Small</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Avatar name="Add User" size="medium" variant="add" onClick={() => console.log("Medium add clicked")} />
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>Medium</p>
      </div>
    </div>
  )
};
