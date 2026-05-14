import { SimpleGrid } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { CheckApprovedIcon, InformationRequiredIcon, WarningIcon } from "@/redesignComponents/foundations/Icons";

import InlineMessage from "./InlineMessage";

const meta = {
  title: "Redesign Components/Status/Inline Message",
  component: InlineMessage,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onActionClick: () => {} }
} satisfies Meta<typeof InlineMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InfoWhite: Story = {
  args: {
    label: "Info White",
    caption: "caption",
    variant: "info-white",
    actionLabel: "Label"
  }
};

export const InfoGrey: Story = {
  args: {
    label: "Info Grey",
    caption: "caption",
    variant: "info-grey",
    actionLabel: "Label"
  }
};

export const FullWidth: Story = {
  args: {
    label: "Full Width",
    caption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ultrices, nisi vel congue imperdiet, risus felis iaculis metus, sit amet accumsan justo nibh eu odio. Fusce velit augue, bibendum vestibulum elit vel, placerat iaculis dolor. Aliquam tincidunt nunc blandit, consequat magna ut, mollis mi. Morbi ac dictum nisi. Quisque leo neque, vehicula eu lorem ac, convallis pellentesque sem. Proin commodo libero quis nulla tristique, a vehicula sem consectetur. Donec id luctus orci.",
    variant: "info-grey",
    actionLabel: "Label",
    size: "full-width"
  }
};

export const Success: Story = {
  args: {
    label: "Success",
    caption: "caption",
    variant: "success",
    actionLabel: "Label",
    icon: <CheckApprovedIcon />
  }
};

export const Warning: Story = {
  args: {
    label: "Warning",
    caption: "caption",
    variant: "warning",
    actionLabel: "Label",
    icon: <WarningIcon />
  }
};

export const Error: Story = {
  args: {
    label: "Error",
    caption: "caption",
    variant: "error",
    actionLabel: "Label",
    icon: <InformationRequiredIcon />
  }
};

export const ButtonRight: Story = {
  args: {
    label: "Info White",
    caption: "caption",
    variant: "info-white",
    actionLabel: "Label",
    isButtonRight: true
  }
};

export const Small: Story = {
  args: {
    label: "Info White",
    caption: "caption",
    variant: "info-white",
    actionLabel: "Label",
    size: "small",
    isButtonRight: true
  }
};

export const SmallButtonRight: Story = {
  args: {
    label: "Info White",
    caption: "caption",
    variant: "info-white",
    actionLabel: "Label",
    size: "small",
    isButtonRight: true
  }
};

export const NoIconWithButtonIcon: Story = {
  args: {
    label: "Ready to finish this factor?",
    caption: "Mark this factor as complete when you've finished reviewing the response, rationale, and strategies.",
    variant: "info-grey",
    size: "full-width",
    actionLabel: "Mark complete",
    isButtonRight: true,
    buttonLeftIcon: <CheckApprovedIcon className="h-4 w-4" />
  }
};

export const LabelOnly: Story = {
  args: {
    variant: "success",
    label: "Profile updated",
    size: "small",
    icon: <CheckApprovedIcon />
  }
};

export const AllVariants: Story = {
  args: {
    variant: "info-white",
    label: "Info White",
    caption: "Informational message on white background.",
    size: "large"
  },
  render: () => (
    <SimpleGrid columns={1} gap={4} width="37.5rem">
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
      <InlineMessage
        variant="success"
        icon={<CheckApprovedIcon />}
        label="Success"
        caption="The operation completed successfully."
        size="large"
      />
      <InlineMessage
        variant="warning"
        icon={<WarningIcon />}
        label="Warning"
        caption="Please review before proceeding."
        size="large"
      />
      <InlineMessage
        icon={<InformationRequiredIcon />}
        variant="error"
        label="Error"
        caption="An unexpected error has occurred."
        size="large"
      />
    </SimpleGrid>
  )
};
