import { Box, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

export interface FilterCardsProps {
  label: string;
  caption?: string;
  children: React.ReactNode;
  className?: string;
}

const FilterCard: FC<FilterCardsProps> = ({ label, caption, children, className }) => {
  return (
    <Flex
      flexDirection="column"
      gap={3}
      p={4}
      w="100%"
      css={{
        borderRadius: "4px",
        border: `1px solid ${getThemedColor("neutral", 400)}`,
        background: ` ${getThemedColor("neutral", 100)}`
      }}
      className={className}
    >
      <Box>
        <Text textStyle="500-bold" color="neutral.900">
          {label}
        </Text>
        {caption && (
          <Text textStyle="300" color="neutral.700">
            {caption}
          </Text>
        )}
      </Box>
      {children}
    </Flex>
  );
};

export default FilterCard;
