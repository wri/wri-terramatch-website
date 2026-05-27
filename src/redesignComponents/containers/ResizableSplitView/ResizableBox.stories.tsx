import { Box, Flex, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import ResizableBox from "./ResizableBox";

const meta = {
  title: "Redesign Components/Containers/Resizable Box",
  component: ResizableBox,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box h="100vh" w="100%" p={6} bg="gray.50">
        <Story />
      </Box>
    )
  ]
} satisfies Meta<typeof ResizableBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialHeight: 80,
    minHeight: 40,
    maxHeight: 225
  },
  render: args => (
    <ResizableBox {...args} bg="white" borderRadius="md" border="1px solid" borderColor="neutral.300" shadow="sm">
      <Flex h="100%" align="center" justify="center" direction="column" gap={2} p={6}>
        <Text fontSize="lg" fontWeight="semibold" color="primary.800">
          Drag the icon to resize height
        </Text>
        <Text fontSize="sm" color="neutral.700">
          This is an isolated story for `ResizableBox`.
        </Text>
      </Flex>
    </ResizableBox>
  )
};
