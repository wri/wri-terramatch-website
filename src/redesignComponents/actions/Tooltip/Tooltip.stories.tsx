import { Box, Text } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { InformationRequired } from "../../foundations/Icons";
import Tooltip from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Redesign Components/Actions/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  }
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: <Text>This is a tooltip message</Text>,
    children: <InformationRequired color="neutral.800" />
  }
};

export const WithText: Story = {
  args: {
    content: <Text>Hover over the icon to see the tooltip</Text>,
    children: (
      <Box as="span" cursor="pointer">
        <InformationRequired color="primary.600" />
      </Box>
    )
  }
};

export const LongContent: Story = {
  args: {
    content: (
      <Text>
        This is a longer tooltip message that contains more information about the element you are hovering over.
      </Text>
    ),
    children: <InformationRequired color="neutral.800" />
  }
};

export const Disabled: Story = {
  args: {
    content: <Text>This tooltip is disabled</Text>,
    children: <InformationRequired color="neutral.800" />,
    disabled: true
  }
};

export const DifferentPositions: Story = {
  render: () => (
    <Box display="flex" gap={4} flexWrap="wrap" alignItems="center">
      <Tooltip content={<Text>Top position</Text>} position="top">
        <InformationRequired color="neutral.800" />
      </Tooltip>
      <Tooltip content={<Text>Right position</Text>} position="right">
        <InformationRequired color="neutral.800" />
      </Tooltip>
      <Tooltip content={<Text>Bottom position</Text>} position="bottom">
        <InformationRequired color="neutral.800" />
      </Tooltip>
      <Tooltip content={<Text>Left position</Text>} position="left">
        <InformationRequired color="neutral.800" />
      </Tooltip>
    </Box>
  )
};
