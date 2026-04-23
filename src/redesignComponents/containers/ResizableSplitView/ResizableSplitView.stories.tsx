import { Box, Flex, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import ResizableSplitView from "./index";

const meta = {
  title: "Redesign Components/Containers/ResizableSplitView",
  component: ResizableSplitView,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box h="100vh" w="100%">
        <Story />
      </Box>
    )
  ]
} satisfies Meta<typeof ResizableSplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: () => <></>
  },
  render: () => (
    <ResizableSplitView initialTopHeight={65}>
      {({ topHeight, onMouseDown }) => (
        <>
          <ResizableSplitView.Top height={topHeight} onMouseDown={onMouseDown}>
            <Flex h="100%" w="100%" bg="primary.100" align="center" justify="center">
              <Text fontSize="2xl" fontWeight="bold" color="primary.800">
                Content 1
              </Text>
            </Flex>
          </ResizableSplitView.Top>

          <ResizableSplitView.Bottom>
            <Flex h="100%" w="100%" bg="secondary.100" align="center" justify="center" p={4}>
              <Text fontSize="2xl" fontWeight="bold" color="secondary.800">
                Content 2
              </Text>
            </Flex>
          </ResizableSplitView.Bottom>
        </>
      )}
    </ResizableSplitView>
  )
};
