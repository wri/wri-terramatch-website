import { SimpleGrid } from "@chakra-ui/react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import type { Meta, StoryObj } from "@storybook/react";

import InlineMessage from "./InlineMessage";

const meta = {
  title: "Redesign Components/Status/Inline Message",
  component: InlineMessage,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div style={{ display: "flex", justifyContent: "center", width: "600px" }}>
        <Story />
      </div>
    )
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["info-white", "info-grey", "success", "warning", "error"],
      description: "Visual style variant of the message"
    },
    size: {
      control: "select",
      options: ["small", "large"],
      description: "Size of the inline message"
    },
    label: {
      control: "text",
      description: "Primary message text"
    },
    caption: {
      control: "text",
      description: "Optional secondary descriptive text"
    },
    actionLabel: {
      control: "text",
      description: "Label for the optional action button"
    },
    isButtonRight: {
      control: "boolean",
      description: "When true, positions the action button to the right"
    },
    widthFull: {
      control: "boolean",
      description: "When true, stretches the message container to full width"
    },
    icon: {
      control: false,
      description: "Custom icon node rendered inside the message"
    }
  }
} satisfies Meta<typeof InlineMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InfoWhite: Story = {
  args: {
    variant: "info-white",
    label: "This is an informational message",
    caption: "Additional context about this information.",
    size: "large"
  }
};

export const InfoGrey: Story = {
  args: {
    variant: "info-grey",
    label: "This is an informational message",
    caption: "Additional context about this information.",
    size: "large"
  }
};

export const Success: Story = {
  args: {
    variant: "success",
    label: "Action completed successfully",
    caption: "Your changes have been saved.",
    size: "large"
  }
};

export const Warning: Story = {
  args: {
    variant: "warning",
    label: "Proceed with caution",
    caption: "This action may have unintended consequences.",
    size: "large"
  }
};

export const Error: Story = {
  args: {
    variant: "error",
    label: "Something went wrong",
    caption: "Please try again or contact support.",
    size: "large"
  }
};

export const Small: Story = {
  args: {
    variant: "info-white",
    label: "Small inline message",
    caption: "Compact size variant.",
    size: "small"
  }
};

export const WithAction: Story = {
  args: {
    variant: "warning",
    label: "Your session is about to expire",
    caption: "You will be logged out in 5 minutes.",
    size: "large",
    actionLabel: "Stay logged in",
    onActionClick: () => alert("Action clicked!")
  }
};

export const WithActionRight: Story = {
  args: {
    variant: "info-grey",
    label: "New update available",
    caption: "A new version is ready to install.",
    size: "large",
    actionLabel: "Update now",
    isButtonRight: true,
    onActionClick: () => alert("Update clicked!")
  }
};

export const LabelOnly: Story = {
  args: {
    variant: "success",
    label: "Profile updated",
    size: "small"
  }
};

export const WithCustomIcon: Story = {
  args: {
    variant: "warning",
    label: "Custom icon message",
    caption: "This message uses a custom icon node.",
    size: "large",
    icon: <WarningAmberIcon fontSize="small" />
  }
};

export const FullWidth: Story = {
  args: {
    variant: "info-grey",
    label: "Full-width message",
    caption: "This message stretches to fill its container.",
    size: "large",
    widthFull: true
  }
};

export const AllVariants: Story = {
  args: {
    variant: "info-white",
    label: "Info White",
    caption: "Informational message on white background.",
    size: "large",
    widthFull: true
  },
  render: () => (
    <SimpleGrid columns={1} gap={4} width="600px">
      <InlineMessage
        variant="info-white"
        label="Info White"
        caption="Informational message on white background."
        size="large"
      />
      <InlineMessage
        variant="info-grey"
        label="Info Grey"
        caption="Informational message on grey background."
        size="large"
      />
      <InlineMessage variant="success" label="Success" caption="The operation completed successfully." size="large" />
      <InlineMessage variant="warning" label="Warning" caption="Please review before proceeding." size="large" />
      <InlineMessage variant="error" label="Error" caption="An unexpected error has occurred." size="large" />
    </SimpleGrid>
  )
};
