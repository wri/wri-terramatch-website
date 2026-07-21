import { Meta, StoryObj } from "@storybook/react";

import MultiActionButton from "./MultiActionButton";

const meta: Meta<typeof MultiActionButton> = {
  title: "Redesign Components/Actions/Buttons/MultiActionButton",
  component: MultiActionButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "borderless", "outline", "negative"]
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

const stateLabel = (text: string) => (
  <p
    style={{
      marginTop: "0.5rem",
      marginBottom: "1.5rem",
      fontSize: "0.7rem",
      color: "#999",
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    }}
  >
    {text}
  </p>
);

const groupWrapper = (children: React.ReactNode) => (
  <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>{children}</div>
);

const stateBlock = (label: string, node: React.ReactNode) => (
  <div style={{ textAlign: "center" }}>
    {node}
    {stateLabel(label)}
  </div>
);

// Primary Variant
export const Primary: Story = {
  render: () =>
    groupWrapper(
      <>
        {stateBlock(
          "Default",
          <MultiActionButton
            variant="primary"
            mainActionLabel="Save"
            mainActionOnClick={() => alert("Save clicked!")}
            otherActions={[
              { label: "Save as Draft", value: "draft", onClick: () => alert("Save as Draft clicked!") },
              { label: "Save and Close", value: "save-close", onClick: () => alert("Save and Close clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Disabled",
          <MultiActionButton
            variant="primary"
            mainActionLabel="Save"
            mainActionOnClick={() => {}}
            disabled
            otherActions={[{ label: "Save as Draft", value: "draft", onClick: () => {} }]}
          />
        )}
        {stateBlock(
          "Small",
          <MultiActionButton
            variant="primary"
            size="small"
            mainActionLabel="Save"
            mainActionOnClick={() => alert("Save clicked!")}
            otherActions={[
              { label: "Save as Draft", value: "draft", onClick: () => alert("Save as Draft clicked!") },
              { label: "Save and Close", value: "save-close", onClick: () => alert("Save and Close clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Item Disabled",
          <MultiActionButton
            variant="primary"
            mainActionLabel="Save"
            mainActionOnClick={() => alert("Save clicked!")}
            otherActions={[
              { label: "Save as Draft", value: "draft", onClick: () => alert("Save as Draft clicked!") },
              { label: "Save and Close", value: "save-close", onClick: () => {}, disabled: true }
            ]}
          />
        )}
      </>
    )
};

// Secondary Variant
export const Secondary: Story = {
  render: () =>
    groupWrapper(
      <>
        {stateBlock(
          "Default",
          <MultiActionButton
            variant="secondary"
            mainActionLabel="Export"
            mainActionOnClick={() => alert("Export clicked!")}
            otherActions={[
              { label: "Export as CSV", value: "csv", onClick: () => alert("Export as CSV clicked!") },
              { label: "Export as Excel", value: "excel", onClick: () => alert("Export as Excel clicked!") },
              { label: "Export as PDF", value: "pdf", onClick: () => alert("Export as PDF clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Disabled",
          <MultiActionButton
            variant="secondary"
            mainActionLabel="Export"
            mainActionOnClick={() => {}}
            disabled
            otherActions={[{ label: "Export as CSV", value: "csv", onClick: () => {} }]}
          />
        )}
        {stateBlock(
          "Small",
          <MultiActionButton
            variant="secondary"
            size="small"
            mainActionLabel="Export"
            mainActionOnClick={() => alert("Export clicked!")}
            otherActions={[
              { label: "Export as CSV", value: "csv", onClick: () => alert("Export as CSV clicked!") },
              { label: "Export as Excel", value: "excel", onClick: () => alert("Export as Excel clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Item Disabled",
          <MultiActionButton
            variant="secondary"
            mainActionLabel="Export"
            mainActionOnClick={() => alert("Export clicked!")}
            otherActions={[
              { label: "Export as CSV", value: "csv", onClick: () => alert("Export as CSV clicked!") },
              { label: "Export as Excel", value: "excel", onClick: () => {}, disabled: true },
              { label: "Export as PDF", value: "pdf", onClick: () => alert("Export as PDF clicked!") }
            ]}
          />
        )}
      </>
    )
};

// Borderless Variant
export const Borderless: Story = {
  render: () =>
    groupWrapper(
      <>
        {stateBlock(
          "Default",
          <MultiActionButton
            variant="borderless"
            mainActionLabel="More Options"
            mainActionOnClick={() => alert("More Options clicked!")}
            otherActions={[
              { label: "Option A", value: "a", onClick: () => alert("Option A clicked!") },
              { label: "Option B", value: "b", onClick: () => alert("Option B clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Disabled",
          <MultiActionButton
            variant="borderless"
            mainActionLabel="More Options"
            mainActionOnClick={() => {}}
            disabled
            otherActions={[{ label: "Option A", value: "a", onClick: () => {} }]}
          />
        )}
        {stateBlock(
          "Small",
          <MultiActionButton
            variant="borderless"
            size="small"
            mainActionLabel="More Options"
            mainActionOnClick={() => alert("More Options clicked!")}
            otherActions={[
              { label: "Option A", value: "a", onClick: () => alert("Option A clicked!") },
              { label: "Option B", value: "b", onClick: () => alert("Option B clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Item Disabled",
          <MultiActionButton
            variant="borderless"
            mainActionLabel="More Options"
            mainActionOnClick={() => alert("More Options clicked!")}
            otherActions={[
              { label: "Option A", value: "a", onClick: () => alert("Option A clicked!") },
              { label: "Option B", value: "b", onClick: () => {}, disabled: true }
            ]}
          />
        )}
      </>
    )
};

// Outline Variant
export const Outline: Story = {
  render: () =>
    groupWrapper(
      <>
        {stateBlock(
          "Default",
          <MultiActionButton
            variant="outline"
            mainActionLabel="Actions"
            mainActionOnClick={() => alert("Actions clicked!")}
            otherActions={[
              { label: "Action A", value: "a", onClick: () => alert("Action A clicked!") },
              { label: "Action B", value: "b", onClick: () => alert("Action B clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Disabled",
          <MultiActionButton
            variant="outline"
            mainActionLabel="Actions"
            mainActionOnClick={() => {}}
            disabled
            otherActions={[{ label: "Action A", value: "a", onClick: () => {} }]}
          />
        )}
        {stateBlock(
          "Small",
          <MultiActionButton
            variant="outline"
            size="small"
            mainActionLabel="Actions"
            mainActionOnClick={() => alert("Actions clicked!")}
            otherActions={[
              { label: "Action A", value: "a", onClick: () => alert("Action A clicked!") },
              { label: "Action B", value: "b", onClick: () => alert("Action B clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Item Disabled",
          <MultiActionButton
            variant="outline"
            mainActionLabel="Actions"
            mainActionOnClick={() => alert("Actions clicked!")}
            otherActions={[
              { label: "Action A", value: "a", onClick: () => alert("Action A clicked!") },
              { label: "Action B", value: "b", onClick: () => {}, disabled: true }
            ]}
          />
        )}
      </>
    )
};

// Negative Variant
export const Negative: Story = {
  render: () =>
    groupWrapper(
      <>
        {stateBlock(
          "Default",
          <MultiActionButton
            variant="negative"
            mainActionLabel="Delete"
            mainActionOnClick={() => alert("Delete clicked!")}
            otherActions={[
              { label: "Delete Permanently", value: "permanent", onClick: () => alert("Delete Permanently clicked!") },
              { label: "Archive Instead", value: "archive", onClick: () => alert("Archive Instead clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Disabled",
          <MultiActionButton
            variant="negative"
            mainActionLabel="Delete"
            mainActionOnClick={() => {}}
            disabled
            otherActions={[{ label: "Delete Permanently", value: "permanent", onClick: () => {} }]}
          />
        )}
        {stateBlock(
          "Small",
          <MultiActionButton
            variant="negative"
            size="small"
            mainActionLabel="Delete"
            mainActionOnClick={() => alert("Delete clicked!")}
            otherActions={[
              { label: "Delete Permanently", value: "permanent", onClick: () => alert("Delete Permanently clicked!") },
              { label: "Archive Instead", value: "archive", onClick: () => alert("Archive Instead clicked!") }
            ]}
          />
        )}
        {stateBlock(
          "Item Disabled",
          <MultiActionButton
            variant="negative"
            mainActionLabel="Delete"
            mainActionOnClick={() => alert("Delete clicked!")}
            otherActions={[
              { label: "Delete Permanently", value: "permanent", onClick: () => alert("Delete Permanently clicked!") },
              { label: "Archive Instead", value: "archive", onClick: () => {}, disabled: true }
            ]}
          />
        )}
      </>
    )
};

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

export const FewActions: Story = {
  args: {
    variant: "primary",
    mainActionLabel: "Continue",
    mainActionOnClick: () => alert("Continue clicked!"),
    otherActions: [{ label: "Go Back", value: "back", onClick: () => alert("Go Back clicked!") }]
  }
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
      {(["primary", "secondary", "borderless", "outline", "negative"] as const).map(variant =>
        stateBlock(
          variant,
          <MultiActionButton
            key={variant}
            variant={variant}
            mainActionLabel={variant.charAt(0).toUpperCase() + variant.slice(1)}
            mainActionOnClick={() => alert(`${variant} clicked!`)}
            otherActions={[
              { label: "Option 1", value: "1", onClick: () => {} },
              { label: "Option 2", value: "2", onClick: () => {} }
            ]}
          />
        )
      )}
    </div>
  )
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
      {stateBlock(
        "Default",
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
      )}
      {stateBlock(
        "Small",
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
      )}
    </div>
  )
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
      {stateBlock(
        "Default",
        <MultiActionButton
          variant="primary"
          mainActionLabel="Enabled"
          mainActionOnClick={() => alert("Clicked!")}
          otherActions={[
            { label: "Option 1", value: "1", onClick: () => {} },
            { label: "Option 2", value: "2", onClick: () => {} }
          ]}
        />
      )}
      {stateBlock(
        "Disabled",
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
      )}
      {stateBlock(
        "Small",
        <MultiActionButton
          variant="primary"
          size="small"
          mainActionLabel="Small"
          mainActionOnClick={() => alert("Clicked!")}
          otherActions={[
            { label: "Option 1", value: "1", onClick: () => {} },
            { label: "Option 2", value: "2", onClick: () => {} }
          ]}
        />
      )}
    </div>
  )
};
