import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import FormNavigation from "./FormNavigation";

const meta = {
  title: "Redesign Components/Navigation/FormNavigation",
  component: FormNavigation,
  parameters: {
    layout: "padded"
  },
  tags: ["autodocs"],
  argTypes: {
    onTabClick: { action: "tab clicked" }
  }
} satisfies Meta<typeof FormNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "label-1",
    tabs: [
      {
        label: "Label 1",
        value: "label-1",
        type: "available"
      },
      {
        label: "Label 2",
        value: "label-2",
        type: "available"
      },
      {
        label: "Label 3",
        value: "label-3",
        type: "available"
      }
    ]
  }
};

// Show all type variants
export const AllTypes: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState("type-2");

    return (
      <FormNavigation
        defaultValue={activeTab}
        onTabClick={setActiveTab}
        tabs={[
          {
            label: "Complete Step",
            value: "type-1",
            type: "complete"
          },
          {
            label: "Active Step",
            value: "type-2",
            type: "available"
          },
          {
            label: "Available Step",
            value: "type-3",
            type: "available"
          },
          {
            label: "Disabled Step",
            value: "type-4",
            type: "disabled",
            disabled: true
          },
          {
            label: "Error Step",
            value: "type-5",
            type: "error"
          }
        ]}
      />
    );
  }
};

// Interactive story with state management
export const Interactive: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState("label-1");

    return (
      <FormNavigation
        defaultValue={activeTab}
        onTabClick={value => {
          console.log("Tab clicked:", value);
          setActiveTab(value);
        }}
        tabs={[
          {
            label: "Label 1",
            value: "label-1",
            type: "available"
          },
          {
            label: "Label 2",
            value: "label-2",
            type: "available"
          },
          {
            label: "Label 3",
            value: "label-3",
            type: "available"
          }
        ]}
      />
    );
  }
};

// Multi-step form simulation with children
export const MultiStepForm: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState("step-2");

    return (
      <div style={{ display: "flex", gap: "2rem" }}>
        <FormNavigation
          defaultValue={activeTab}
          onTabClick={setActiveTab}
          tabs={[
            {
              label: "Basic Information",
              value: "step-1",
              type: "complete"
            },
            {
              label: "Project Details",
              value: "step-2",
              type: "available"
            },
            {
              label: "Location",
              value: "step-3",
              type: "available"
            },
            {
              label: "Review",
              value: "step-4",
              type: "available"
            }
          ]}
        />
        <div style={{ padding: "1rem" }}>
          <h3>Current Step: {activeTab}</h3>
          <p>Content for {activeTab} goes here...</p>
        </div>
      </div>
    );
  }
};

// With disabled tabs
export const WithDisabledTabs: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState("tab-1");

    return (
      <FormNavigation
        defaultValue={activeTab}
        onTabClick={setActiveTab}
        tabs={[
          {
            label: "Enabled Tab",
            value: "tab-1",
            type: "available",
            disabled: false
          },
          {
            label: "Disabled Tab",
            value: "tab-2",
            type: "disabled",
            disabled: true
          },
          {
            label: "Another Enabled",
            value: "tab-3",
            type: "available",
            disabled: false
          }
        ]}
      />
    );
  }
};

// Form wizard with error state
export const FormWizardWithError: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState("step-3");

    return (
      <FormNavigation
        defaultValue={activeTab}
        onTabClick={setActiveTab}
        tabs={[
          {
            label: "Personal Info",
            value: "step-1",
            type: "complete"
          },
          {
            label: "Contact Details",
            value: "step-2",
            type: "complete"
          },
          {
            label: "Payment Info",
            value: "step-3",
            type: "error"
          },
          {
            label: "Confirmation",
            value: "step-4",
            type: "available"
          }
        ]}
      />
    );
  }
};

// Longer navigation list
export const ExtendedNavigation: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState("tab-3");

    const tabs = Array.from({ length: 8 }, (_, i) => ({
      label: `Section ${i + 1}`,
      value: `tab-${i + 1}`,
      type: (i < 2 ? "complete" : i === 2 ? "active" : "available") as "complete" | "available" | "disabled" | "error"
    }));

    return <FormNavigation defaultValue={activeTab} onTabClick={setActiveTab} tabs={tabs} />;
  }
};

// Minimal (2 tabs)
export const MinimalNavigation: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState("tab-1");

    return (
      <FormNavigation
        defaultValue={activeTab}
        onTabClick={setActiveTab}
        tabs={[
          {
            label: "First Step",
            value: "tab-1",
            type: "available"
          },
          {
            label: "Second Step",
            value: "tab-2",
            type: "available"
          }
        ]}
      />
    );
  }
};

// Complete form progress
export const CompleteFormProgress: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState("step-5");

    return (
      <FormNavigation
        defaultValue={activeTab}
        onTabClick={setActiveTab}
        tabs={[
          {
            label: "Account Setup",
            value: "step-1",
            type: "complete"
          },
          {
            label: "Profile Info",
            value: "step-2",
            type: "complete"
          },
          {
            label: "Preferences",
            value: "step-3",
            type: "complete"
          },
          {
            label: "Verification",
            value: "step-4",
            type: "complete"
          },
          {
            label: "Summary",
            value: "step-5",
            type: "available"
          }
        ]}
      />
    );
  }
};
