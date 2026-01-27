import { Meta, StoryObj } from "@storybook/react";

import CloseButton from "./CloseButton";

const meta: Meta<typeof CloseButton> = {
  title: "Redesign Components/Actions/Buttons/CloseButton",
  component: CloseButton,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

// Basic CloseButton Stories
export const Default: Story = {
  args: {}
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

// Interactive Example
export const Interactive: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <CloseButton />
      <span>← Click to close</span>
    </div>
  )
};

// Usage in a Card Example
export const InCardHeader: Story = {
  render: () => (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "400px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px"
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px" }}>Card Title</h3>
        <CloseButton />
      </div>
      <p style={{ margin: 0, color: "#666" }}>This is a card with a close button in the header.</p>
    </div>
  )
};

// Usage in Modal Header Example
export const InModalHeader: Story = {
  render: () => (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "0",
        maxWidth: "500px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid #e0e0e0"
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>Modal Title</h2>
        <CloseButton />
      </div>
      <div style={{ padding: "20px" }}>
        <p style={{ margin: 0, color: "#666" }}>Modal content goes here...</p>
      </div>
    </div>
  )
};

// Usage in Toast/Alert Example
export const InAlert: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        padding: "12px 16px",
        backgroundColor: "#E3F2FD",
        border: "1px solid #2196F3",
        borderRadius: "6px",
        maxWidth: "400px"
      }}
    >
      <div style={{ flex: 1 }}>
        <strong style={{ display: "block", marginBottom: "4px", color: "#1976D2" }}>Info</strong>
        <p style={{ margin: 0, color: "#1565C0", fontSize: "14px" }}>
          This is an informational message that can be dismissed.
        </p>
      </div>
      <CloseButton />
    </div>
  )
};

// States Showcase
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <CloseButton />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Default</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <CloseButton disabled />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>Disabled</p>
      </div>
    </div>
  )
};
