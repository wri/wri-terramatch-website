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
          label: "Info notification",
          caption: "Something happened in the app.",
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
          label: "Changes saved",
          caption: "Your project has been updated.",
          type: "success",
          placement: "top-end",
          duration: 3000,
          closable: true,
          closableLabel: "Close"
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
          label: "Proceed with caution",
          caption: "This action may have unintended effects.",
          type: "warning",
          placement: "top-end",
          duration: 4000,
          closable: true,
          closableLabel: "Close"
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
          label: "Something went wrong",
          caption: "Please try again or contact support.",
          type: "error",
          placement: "top-end",
          duration: 5000,
          closable: true,
          closableLabel: "Close"
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
          label: "Uploading files…",
          caption: "Please wait while we process your request.",
          type: "loading",
          placement: "top-end",
          closable: true,
          closableLabel: "Close"
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
          label: "Report submitted",
          caption: "Your report has been queued for review.",
          type: "success",
          placement: "top-end",
          duration: 6000,
          closable: true,
          closableLabel: "Close",
          action: {
            label: "View report",
            onClick: () => alert("Navigating to report…")
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
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Button
        variant="primary"
        onClick={() => showToast({ label: "Top Start", type: "info", placement: "top-start", duration: 3000 })}
      >
        Top Start
      </Button>
      <Button
        variant="primary"
        onClick={() => showToast({ label: "Top End", type: "info", placement: "top-end", duration: 3000 })}
      >
        Top End
      </Button>
      <Button
        variant="primary"
        onClick={() => showToast({ label: "Bottom Start", type: "info", placement: "bottom-start", duration: 3000 })}
      >
        Bottom Start
      </Button>
      <Button
        variant="primary"
        onClick={() => showToast({ label: "Bottom End", type: "info", placement: "bottom-end", duration: 3000 })}
      >
        Bottom End
      </Button>
    </div>
  )
};
