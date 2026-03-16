import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { TerraFundAFR100 } from "./TerraFundAFR100";
import { TMLogo } from "./TMLogo";

const meta: Meta = {
  title: "Redesign Components/Foundations/Logos",
  parameters: {
    layout: "padded"
  },
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj;

export const AllLogos: Story = {
  render: () => (
    <VStack align="stretch" gap={6} padding={4}>
      <Flex
        align="center"
        justify="space-between"
        gap={8}
        flexWrap="wrap"
        borderRadius="16px"
        borderWidth="1px"
        borderColor="neutral.300"
        bg="neutral.100"
        p={4}
      >
        <Box minW="120px">
          <Text fontSize="400" color="neutral.900">
            TM Logo
          </Text>
          <Text fontSize="300" color="neutral.600">
            Primary TerraMatch logo
          </Text>
        </Box>
        <Box flex="0 0 auto">
          <TMLogo boxSize="80px" />
        </Box>
      </Flex>

      <Flex
        align="center"
        justify="space-between"
        gap={8}
        flexWrap="wrap"
        borderRadius="16px"
        borderWidth="1px"
        borderColor="neutral.300"
        bg="neutral.100"
        p={4}
      >
        <Box minW="120px">
          <Text fontSize="400" color="neutral.900">
            TerraFund AFR100
          </Text>
          <Text fontSize="300" color="neutral.600">
            TerraFund AFR100 program logo
          </Text>
        </Box>
        <Box flex="0 0 auto">
          <TerraFundAFR100 boxSize="80px" />
        </Box>
      </Flex>
    </VStack>
  )
};

export const TMLogoStory: Story = {
  render: () => (
    <Box p={4}>
      <TMLogo boxSize="120px" />
    </Box>
  )
};

export const TerraFundAFR100LogoStory: Story = {
  render: () => (
    <Box p={4}>
      <TerraFundAFR100 boxSize="120px" />
    </Box>
  )
};
