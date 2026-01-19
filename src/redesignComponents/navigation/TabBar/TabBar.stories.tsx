import { Meta, StoryObj } from "@storybook/react";
import { TabBar as TabBarWri } from "@worldresources/wri-design-systems";
import { useState } from "react";

const meta: Meta<typeof TabBarWri> = {
  title: "Redesign Components/Navigation/TabBar",
  component: TabBarWri,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["panel", "underlined"],
      description: "Visual style of the tab bar"
    },
    tabs: {
      description: "Array of tab objects with label and value"
    },
    selectedValue: {
      control: "text",
      description: "Currently selected tab value"
    },
    onChangeTab: {
      action: "tab changed",
      description: "Callback fired when tab is changed"
    }
  }
};

export default meta;
type Story = StoryObj<typeof TabBarWri>;

const defaultTabs = [
  { label: "One", value: "one" },
  { label: "Two", value: "two" },
  { label: "Three", value: "three" }
];

/**
 * Default TabBar with panel variant
 */
export const Default: Story = {
  args: {
    tabs: defaultTabs,
    variant: "panel"
  }
};

/**
 * TabBar with panel variant (default style)
 */
export const PanelVariant: Story = {
  args: {
    tabs: defaultTabs,
    variant: "panel",
    selectedValue: "one"
  }
};

/**
 * TabBar with underlined variant
 */
export const UnderlinedVariant: Story = {
  args: {
    tabs: defaultTabs,
    variant: "underlined",
    selectedValue: "one"
  }
};

/**
 * TabBar with many tabs
 */
export const ManyTabs: Story = {
  args: {
    tabs: [
      { label: "Dashboard", value: "dashboard" },
      { label: "Analytics", value: "analytics" },
      { label: "Reports", value: "reports" },
      { label: "Settings", value: "settings" },
      { label: "Users", value: "users" },
      { label: "Projects", value: "projects" }
    ],
    variant: "panel",
    selectedValue: "dashboard"
  }
};

/**
 * TabBar with long labels
 */
export const LongLabels: Story = {
  args: {
    tabs: [
      { label: "Project Management", value: "project" },
      { label: "User Administration", value: "users" },
      { label: "System Configuration", value: "config" }
    ],
    variant: "panel",
    selectedValue: "project"
  }
};

/**
 * TabBar with two tabs only
 */
export const TwoTabs: Story = {
  args: {
    tabs: [
      { label: "Overview", value: "overview" },
      { label: "Details", value: "details" }
    ],
    variant: "panel",
    selectedValue: "overview"
  }
};

/**
 * TabBar with custom content labels
 */
export const CustomLabels: Story = {
  args: {
    tabs: [
      { label: "📊 Dashboard", value: "dashboard" },
      { label: "📈 Analytics", value: "analytics" },
      { label: "⚙️ Settings", value: "settings" }
    ],
    variant: "panel",
    selectedValue: "dashboard"
  }
};

/**
 * Interactive TabBar with state management
 */
export const Interactive: Story = {
  render: () => {
    const [selectedTab, setSelectedTab] = useState("one");

    return (
      <div style={{ padding: "20px" }}>
        <TabBarWri
          tabs={defaultTabs}
          variant="panel"
          selectedValue={selectedTab}
          onChangeTab={value => {
            setSelectedTab(value);
            console.log("Selected tab:", value);
          }}
        />
        <div style={{ marginTop: "20px", padding: "16px", background: "#f5f5f5", borderRadius: "8px" }}>
          <p style={{ margin: 0, fontWeight: "600" }}>Current tab: {selectedTab}</p>
        </div>
      </div>
    );
  }
};

/**
 * Interactive TabBar with underlined variant
 */
export const InteractiveUnderlined: Story = {
  render: () => {
    const [selectedTab, setSelectedTab] = useState("dashboard");

    return (
      <div style={{ padding: "20px" }}>
        <TabBarWri
          tabs={[
            { label: "Dashboard", value: "dashboard" },
            { label: "Analytics", value: "analytics" },
            { label: "Reports", value: "reports" },
            { label: "Settings", value: "settings" }
          ]}
          variant="underlined"
          selectedValue={selectedTab}
          onChangeTab={value => {
            setSelectedTab(value);
            console.log("Selected tab:", value);
          }}
        />
        <div style={{ marginTop: "20px", padding: "16px", background: "#f5f5f5", borderRadius: "8px" }}>
          <p style={{ margin: 0, fontWeight: "600" }}>Current tab: {selectedTab}</p>
        </div>
      </div>
    );
  }
};

/**
 * Comparison of both variants
 */
export const VariantComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "20px" }}>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Panel Variant</p>
        <TabBarWri tabs={defaultTabs} variant="panel" selectedValue="one" />
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Underlined Variant</p>
        <TabBarWri tabs={defaultTabs} variant="underlined" selectedValue="one" />
      </div>
    </div>
  )
};

/**
 * Different tab states demonstration
 */
export const TabStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "20px" }}>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>First tab selected</p>
        <TabBarWri tabs={defaultTabs} variant="panel" selectedValue="one" />
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Middle tab selected</p>
        <TabBarWri tabs={defaultTabs} variant="panel" selectedValue="two" />
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Last tab selected</p>
        <TabBarWri tabs={defaultTabs} variant="panel" selectedValue="three" />
      </div>
    </div>
  )
};

/**
 * Real-world example with content sections
 */
export const WithContent: Story = {
  render: () => {
    const [selectedTab, setSelectedTab] = useState("profile");

    const contentMap: Record<string, string> = {
      profile: "User profile information and settings",
      security: "Security settings, password management, and 2FA",
      notifications: "Notification preferences and email settings"
    };

    return (
      <div style={{ padding: "20px", maxWidth: "800px" }}>
        <TabBarWri
          tabs={[
            { label: "Profile", value: "profile" },
            { label: "Security", value: "security" },
            { label: "Notifications", value: "notifications" }
          ]}
          variant="panel"
          selectedValue={selectedTab}
          onChangeTab={setSelectedTab}
        />
        <div
          style={{
            marginTop: "24px",
            padding: "24px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px"
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "18px", fontWeight: "600" }}>
            {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
          </h3>
          <p style={{ margin: 0, color: "#6b7280" }}>{contentMap[selectedTab]}</p>
        </div>
      </div>
    );
  }
};
