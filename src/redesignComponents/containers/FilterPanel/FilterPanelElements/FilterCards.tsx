import { Box, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

export interface FilterCardsProps {
  label: string;
  labelSuffix?: string;
  caption?: string;
  children: React.ReactNode;
  className?: string;
}

const FilterCard: FC<FilterCardsProps> = ({ label, labelSuffix, caption, children, className }) => {
  return (
    <Flex
      flexDirection="column"
      gap={3}
      p={4}
      w="100%"
      css={{
        borderRadius: "0.25rem",
        border: `0.0625rem solid ${getThemedColor("neutral", 400)}`,
        background: ` ${getThemedColor("neutral", 100)}`
      }}
      className={className}
    >
      <Box>
        <Text textStyle="500-bold" color="neutral.900">
          {label}
          {labelSuffix != null && (
            <Text as="span" textStyle="300" color="neutral.700" marginLeft={1}>
              {labelSuffix}
            </Text>
          )}
        </Text>
        {caption != null && (
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
