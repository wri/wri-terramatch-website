import { Meta, StoryObj } from "@storybook/react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Menu from "./Menu";

const meta: Meta<typeof Menu> = {
  title: "Redesign/Forms/Actions/Menu",
  component: Menu,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text"
    },
    onSelect: {
      action: "selected"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Menu>;

// Basic Menu Stories
export const BasicMenu: Story = {
  args: {
    label: "Menu",
    items: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" }
    ]
  }
};

export const MenuWithIcons: Story = {
  args: {
    label: "Menu with Icons",
    items: [
      {
        label: "Edit",
        value: "edit",
        startIcon: <Icon name={IconNames.EDIT} width={16} />
      },
      {
        label: "Delete",
        value: "delete",
        startIcon: <Icon name={IconNames.TRASH} width={16} />
      },
      {
        label: "Share",
        value: "share",
        startIcon: <Icon name={IconNames.ARROW} width={16} />
      }
    ]
  }
};

export const MenuWithCaptions: Story = {
  args: {
    label: "Menu with Captions",
    items: [
      {
        label: "Settings",
        caption: "Configure your preferences",
        value: "settings"
      },
      {
        label: "Profile",
        caption: "Edit your profile information",
        value: "profile"
      },
      {
        label: "Notifications",
        caption: "Manage notification settings",
        value: "notifications"
      }
    ]
  }
};

export const MenuWithDisabledItems: Story = {
  args: {
    label: "Menu with Disabled",
    items: [
      { label: "Available Option", value: "1" },
      { label: "Disabled Option", value: "2", disabled: true },
      { label: "Another Available", value: "3" }
    ]
  }
};

export const MenuWithGroups: Story = {
  args: {
    label: "Grouped Menu",
    groups: [
      {
        title: "Actions",
        items: [
          {
            label: "Edit",
            value: "edit",
            startIcon: <Icon name={IconNames.EDIT} width={16} />
          },
          {
            label: "Duplicate",
            value: "duplicate",
            startIcon: <Icon name={IconNames.LINK} width={16} />
          }
        ]
      },
      {
        title: "Danger Zone",
        items: [
          {
            label: "Delete",
            value: "delete",
            startIcon: <Icon name={IconNames.TRASH} width={16} />
          }
        ]
      }
    ]
  }
};

export const MenuWithSubmenu: Story = {
  args: {
    label: "Menu with Submenu",
    items: [
      { label: "Home", value: "home" },
      {
        label: "Settings",
        value: "settings",
        submenu: [
          { label: "General", value: "general" },
          { label: "Privacy", value: "privacy" },
          { label: "Security", value: "security" }
        ]
      },
      { label: "About", value: "about" }
    ]
  }
};

export const MenuWithEndIcons: Story = {
  args: {
    label: "Menu with End Icons",
    items: [
      {
        label: "External Link",
        value: "external",
        endIcon: <Icon name={IconNames.LINK} width={16} />
      },
      {
        label: "With Command",
        value: "command",
        command: "⌘K"
      },
      {
        label: "Another Action",
        value: "action",
        endIcon: <Icon name={IconNames.CHEVRON_RIGHT} width={16} />
      }
    ]
  }
};

export const MenuWithCustomTrigger: Story = {
  args: {
    label: "Custom Trigger",
    customTrigger: (
      <button
        style={{ padding: "8px 16px", background: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}
      >
        Custom Button
      </button>
    ),
    items: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" }
    ]
  }
};

// Complex Example
export const ComplexMenu: Story = {
  args: {
    label: "Complex Menu",
    groups: [
      {
        title: "File Operations",
        items: [
          {
            label: "New File",
            caption: "Create a new file",
            value: "new",
            startIcon: <Icon name={IconNames.PLUS} width={16} />,
            command: "⌘N"
          },
          {
            label: "Open",
            caption: "Open existing file",
            value: "open",
            startIcon: <Icon name={IconNames.DOCUMENT} width={16} />,
            command: "⌘O"
          }
        ]
      },
      {
        title: "Edit",
        items: [
          {
            label: "Cut",
            value: "cut",
            startIcon: <Icon name={IconNames.ARROW} width={16} />,
            command: "⌘X"
          },
          {
            label: "Copy",
            value: "copy",
            startIcon: <Icon name={IconNames.LINK} width={16} />,
            command: "⌘C"
          },
          {
            label: "Paste",
            value: "paste",
            startIcon: <Icon name={IconNames.ARROW} width={16} />,
            command: "⌘V",
            disabled: true
          }
        ]
      }
    ]
  }
};

// Showcase all variants
export const AllMenuTypes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
      <Menu
        label="Basic"
        items={[
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" }
        ]}
      />
      <Menu
        label="With Icons"
        items={[
          {
            label: "Edit",
            value: "edit",
            startIcon: <Icon name={IconNames.EDIT} width={16} />
          },
          {
            label: "Delete",
            value: "delete",
            startIcon: <Icon name={IconNames.TRASH} width={16} />
          }
        ]}
      />
      <Menu
        label="Grouped"
        groups={[
          {
            title: "Actions",
            items: [
              { label: "Action 1", value: "1" },
              { label: "Action 2", value: "2" }
            ]
          }
        ]}
      />
    </div>
  )
};
