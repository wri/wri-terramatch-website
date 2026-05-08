import type { Meta, StoryObj } from "@storybook/react";
import { Button, showToast } from "@worldresources/wri-design-systems";

const meta: Meta = {
  title: "Redesign Components/Status/Toast",
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj;

export const Info: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() =>
        showToast({
          label: "Label",
          caption: "Caption",
          type: "info",
          placement: "top-end",
          closableLabel: "Close"
        })
      }
    >
      Show Info
    </Button>
  )
};

export const Success: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() =>
        showToast({
          label: "Label",
          caption: "Caption",
          type: "success",
          placement: "top-end",
          duration: 3000,
          closable: true,
          closableLabel: "Dismiss"
        })
      }
    >
      Show Success
    </Button>
  )
};

export const Warning: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() =>
        showToast({
          label: "Label",
          caption: "Caption",
          type: "warning",
          placement: "top-end",
          duration: 4000,
          closable: true,
          closableLabel: "Dismiss"
        })
      }
    >
      Show Warning
    </Button>
  )
};

export const Error: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() =>
        showToast({
          label: "Label",
          caption: "Caption",
          type: "error",
          placement: "top-end",
          duration: 5000,
          closable: true,
          closableLabel: "Dismiss"
        })
      }
    >
      Show Error
    </Button>
  )
};

export const Loading: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() =>
        showToast({
          label: "Label",
          caption: "Caption",
          type: "loading",
          placement: "top-end",
          closable: true,
          closableLabel: "Dismiss"
        })
      }
    >
      Show Loading
    </Button>
  )
};

export const WithAction: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() =>
        showToast({
          label: "Label",
          caption: "Caption",
          type: "success",
          placement: "top-end",
          duration: 6000,
          closable: true,
          closableLabel: "Dismiss",
          action: {
            label: "Label",
            onClick: () => alert("Caption")
          }
        })
      }
    >
      Show With Action
    </Button>
  )
};

export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Button
        variant="primary"
        onClick={() =>
          showToast({ label: "Label", caption: "Caption", type: "info", placement: "top-start", duration: 3000 })
        }
      >
        Top Start
      </Button>
      <Button
        variant="primary"
        onClick={() =>
          showToast({ label: "Label", caption: "Caption", type: "info", placement: "top-end", duration: 3000 })
        }
      >
        Top End
      </Button>
      <Button
        variant="primary"
        onClick={() =>
          showToast({ label: "Label", caption: "Caption", type: "info", placement: "bottom-start", duration: 3000 })
        }
      >
        Bottom Start
      </Button>
      <Button
        variant="primary"
        onClick={() =>
          showToast({ label: "Label", caption: "Caption", type: "info", placement: "bottom-end", duration: 3000 })
        }
      >
        Bottom End
      </Button>
    </div>
  )
};
