import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Redesign Components/Foundations/Typography",
  parameters: {
    layout: "padded"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj;

const typographyScale = [
  { size: "1100", category: "Headline" },
  { size: "1000", category: "Headline" },
  { size: "900", category: "Headline" },
  { size: "800", category: "Headline" },
  { size: "700", category: "Subtitle" },
  { size: "600", category: "Subtitle" },
  { size: "500", category: "Body" },
  { size: "400", category: "Body" },
  { size: "300", category: "Captions" },
  { size: "200", category: "Captions" }
];

const TypographyRow = ({ size, category, bold = false }: { size: string; category: string; bold: boolean }) => {
  const exampleText = "The Quick Brown Fox Jumps Over The Lazy Dog";

  return (
    <Box bg="neutral.200" border="4px" borderColor="neutral.300" borderRadius="16px" p={4} mb={2}>
      <Flex direction="row" align="center" justify="space-between" gap={4} flexWrap="wrap">
        <Flex direction="row" align="center" gap={2} flex="0 0 auto">
          <Text fontSize="400" color="neutral.900">
            {size}
          </Text>
          <Text fontSize="400" color="neutral.600">
            |
          </Text>
          <Text fontSize="400" color="neutral.900">
            {category}
          </Text>
        </Flex>
        <Box flex="1" minW="200px">
          <Text
            textStyle={bold ? `${size}-bold` : size}
            color="neutral.900"
            textAlign="right"
            className="truncate whitespace-nowrap"
          >
            {exampleText}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export const BoldTypeface: Story = {
  render: () => (
    <VStack align="stretch" gap={0} padding={4}>
      {typographyScale.map(({ size, category }) => (
        <TypographyRow key={size} size={size} category={category} bold={true} />
      ))}
    </VStack>
  )
};

export const RegularTypeface: Story = {
  render: () => (
    <VStack align="stretch" gap={0} padding={4}>
      {typographyScale.map(({ size, category }) => (
        <TypographyRow key={size} size={size} category={category} bold={false} />
      ))}
    </VStack>
  )
};
