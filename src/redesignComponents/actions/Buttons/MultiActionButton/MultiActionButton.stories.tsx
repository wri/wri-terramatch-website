import { Meta, StoryObj } from "@storybook/react";

import MultiActionButton from "./MultiActionButton";

const meta: Meta<typeof MultiActionButton> = {
  title: "Redesign Components/Actions/Buttons/MultiActionButton",
  component: MultiActionButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"]
    },
    size: {
      control: "select",
      options: ["default", "small"]
    },
    disabled: {
      control: "boolean"
    },
    mainActionOnClick: {
      action: "mainActionClicked"
    }
  }
};

export default meta;
type Story = StoryObj<typeof MultiActionButton>;

// Primary Variant Stories
export const Primary: Story = {
  args: {
    variant: "primary",
    mainActionLabel: "Save",
    mainActionOnClick: () => alert("Main action clicked!"),
    otherActions: [
      {
        label: "Save as Draft",
        value: "draft",
        onClick: () => alert("Save as Draft clicked!")
      },
      {
        label: "Save and Close",
        value: "save-close",
        onClick: () => alert("Save and Close clicked!")
      }
    ]
  }
};

export const PrimaryDisabled: Story = {
  args: {
    variant: "primary",
    mainActionLabel: "Save",
    mainActionOnClick: () => {},
    disabled: true,
    otherActions: [
      {
        label: "Save as Draft",
        value: "draft",
        onClick: () => {}
      }
    ]
  }
};

export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    mainActionLabel: "Save",
    mainActionOnClick: () => alert("Main action clicked!"),
    otherActions: [
      {
        label: "Save as Draft",
        value: "draft",
        onClick: () => alert("Save as Draft clicked!")
      },
      {
        label: "Save and Close",
        value: "save-close",
        onClick: () => alert("Save and Close clicked!")
      }
    ]
  }
};

// Secondary Variant Stories
export const Secondary: Story = {
  args: {
    variant: "secondary",
    mainActionLabel: "Export",
    mainActionOnClick: () => alert("Export clicked!"),
    otherActions: [
      {
        label: "Export as CSV",
        value: "csv",
        onClick: () => alert("Export as CSV clicked!")
      },
      {
        label: "Export as Excel",
        value: "excel",
        onClick: () => alert("Export as Excel clicked!")
      },
      {
        label: "Export as PDF",
        value: "pdf",
        onClick: () => alert("Export as PDF clicked!")
      }
    ]
  }
};

export const SecondaryDisabled: Story = {
  args: {
    variant: "secondary",
    mainActionLabel: "Export",
    mainActionOnClick: () => {},
    disabled: true,
    otherActions: [
      {
        label: "Export as CSV",
        value: "csv",
        onClick: () => {}
      }
    ]
  }
};

export const SecondarySmall: Story = {
  args: {
    variant: "secondary",
    size: "small",
    mainActionLabel: "Export",
    mainActionOnClick: () => alert("Export clicked!"),
    otherActions: [
      {
        label: "Export as CSV",
        value: "csv",
        onClick: () => alert("Export as CSV clicked!")
      },
      {
        label: "Export as Excel",
        value: "excel",
        onClick: () => alert("Export as Excel clicked!")
      }
    ]
  }
};

// Different Use Cases
export const PublishActions: Story = {
  args: {
    variant: "primary",
    mainActionLabel: "Publish",
    mainActionOnClick: () => alert("Publish clicked!"),
    otherActions: [
      {
        label: "Publish and Notify",
        value: "publish-notify",
        onClick: () => alert("Publish and Notify clicked!")
      },
      {
        label: "Schedule Publish",
        value: "schedule",
        onClick: () => alert("Schedule Publish clicked!")
      },
      {
        label: "Save as Draft",
        value: "draft",
        onClick: () => alert("Save as Draft clicked!")
      }
    ]
  }
};

export const DownloadActions: Story = {
  args: {
    variant: "secondary",
    mainActionLabel: "Download",
    mainActionOnClick: () => alert("Download clicked!"),
    otherActions: [
      {
        label: "Download Original",
        value: "original",
        onClick: () => alert("Download Original clicked!")
      },
      {
        label: "Download Compressed",
        value: "compressed",
        onClick: () => alert("Download Compressed clicked!")
      },
      {
        label: "Download All",
        value: "all",
        onClick: () => alert("Download All clicked!")
      }
    ]
  }
};

export const SubmitActions: Story = {
  args: {
    variant: "primary",
    mainActionLabel: "Submit",
    mainActionOnClick: () => alert("Submit clicked!"),
    otherActions: [
      {
        label: "Submit for Review",
        value: "review",
        onClick: () => alert("Submit for Review clicked!")
      },
      {
        label: "Submit and Continue",
        value: "continue",
        onClick: () => alert("Submit and Continue clicked!")
      }
    ]
  }
};

export const CreateActions: Story = {
  args: {
    variant: "primary",
    mainActionLabel: "Create",
    mainActionOnClick: () => alert("Create clicked!"),
    otherActions: [
      {
        label: "Create and Add Another",
        value: "add-another",
        onClick: () => alert("Create and Add Another clicked!")
      },
      {
        label: "Create Template",
        value: "template",
        onClick: () => alert("Create Template clicked!")
      },
      {
        label: "Create Draft",
        value: "draft",
        onClick: () => alert("Create Draft clicked!")
      }
    ]
  }
};

export const ShareActions: Story = {
  args: {
    variant: "secondary",
    mainActionLabel: "Share",
    mainActionOnClick: () => alert("Share clicked!"),
    otherActions: [
      {
        label: "Share via Email",
        value: "email",
        onClick: () => alert("Share via Email clicked!")
      },
      {
        label: "Copy Link",
        value: "copy",
        onClick: () => alert("Copy Link clicked!")
      },
      {
        label: "Generate QR Code",
        value: "qr",
        onClick: () => alert("Generate QR Code clicked!")
      }
    ]
  }
};

// With Many Actions
export const ManyActions: Story = {
  args: {
    variant: "primary",
    mainActionLabel: "Process",
    mainActionOnClick: () => alert("Process clicked!"),
    otherActions: [
      { label: "Action 1", value: "1", onClick: () => alert("Action 1") },
      { label: "Action 2", value: "2", onClick: () => alert("Action 2") },
      { label: "Action 3", value: "3", onClick: () => alert("Action 3") },
      { label: "Action 4", value: "4", onClick: () => alert("Action 4") },
      { label: "Action 5", value: "5", onClick: () => alert("Action 5") },
      { label: "Action 6", value: "6", onClick: () => alert("Action 6") }
    ]
  }
};

// With Few Actions
export const FewActions: Story = {
  args: {
    variant: "primary",
    mainActionLabel: "Continue",
    mainActionOnClick: () => alert("Continue clicked!"),
    otherActions: [
      {
        label: "Go Back",
        value: "back",
        onClick: () => alert("Go Back clicked!")
      }
    ]
  }
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
      <MultiActionButton
        variant="primary"
        mainActionLabel="Primary"
        mainActionOnClick={() => alert("Primary clicked!")}
        otherActions={[
          { label: "Option 1", value: "1", onClick: () => {} },
          { label: "Option 2", value: "2", onClick: () => {} }
        ]}
      />
      <MultiActionButton
        variant="secondary"
        mainActionLabel="Secondary"
        mainActionOnClick={() => alert("Secondary clicked!")}
        otherActions={[
          { label: "Option 1", value: "1", onClick: () => {} },
          { label: "Option 2", value: "2", onClick: () => {} }
        ]}
      />
    </div>
  )
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
      <MultiActionButton
        variant="primary"
        size="default"
        mainActionLabel="Default Size"
        mainActionOnClick={() => alert("Clicked!")}
        otherActions={[
          { label: "Option 1", value: "1", onClick: () => {} },
          { label: "Option 2", value: "2", onClick: () => {} }
        ]}
      />
      <MultiActionButton
        variant="primary"
        size="small"
        mainActionLabel="Small Size"
        mainActionOnClick={() => alert("Clicked!")}
        otherActions={[
          { label: "Option 1", value: "1", onClick: () => {} },
          { label: "Option 2", value: "2", onClick: () => {} }
        ]}
      />
    </div>
  )
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <MultiActionButton
          variant="primary"
          mainActionLabel="Enabled"
          mainActionOnClick={() => alert("Clicked!")}
          otherActions={[
            { label: "Option 1", value: "1", onClick: () => {} },
            { label: "Option 2", value: "2", onClick: () => {} }
          ]}
        />
        <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#666" }}>Default</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <MultiActionButton
          variant="primary"
          mainActionLabel="Disabled"
          mainActionOnClick={() => {}}
          disabled
          otherActions={[
            { label: "Option 1", value: "1", onClick: () => {} },
            { label: "Option 2", value: "2", onClick: () => {} }
          ]}
        />
        <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#666" }}>Disabled</p>
      </div>
    </div>
  )
};
