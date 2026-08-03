import { Flex } from "@chakra-ui/react";
import { FC } from "react";

import type { NumberBadgeProps, NumberBadgeSize, NumberBadgeVariant } from "./types";

const MAX_COUNT = 99;

const SIZE_STYLES: Record<NumberBadgeSize, { boxSize: string; padding: string; textStyle: string }> = {
  small: { boxSize: "0.625rem", padding: "0.125rem", textStyle: "50-bold" },
  large: { boxSize: "1.25rem", padding: "0.125rem 0.25rem", textStyle: "200-bold" }
};

const VARIANT_STYLES: Record<NumberBadgeVariant, { backgroundColor: string; color: string }> = {
  notification: { backgroundColor: "error.500", color: "error.100" },
  information: { backgroundColor: "information.300", color: "information.900" },
  primary: { backgroundColor: "primary.900", color: "primary.100" },
  secondary: { backgroundColor: "neutral.200", color: "neutral.700" }
};

const NumberBadge: FC<NumberBadgeProps> = ({
  count,
  variant = "notification",
  size = "large",
  ariaLabel,
  className
}) => {
  if (count <= 0) {
    return null;
  }

  const { boxSize, padding, textStyle } = SIZE_STYLES[size];
  const { backgroundColor, color } = VARIANT_STYLES[variant];

  return (
    <Flex
      className={className}
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      width="auto"
      minWidth={boxSize}
      minHeight={boxSize}
      padding={padding}
      backgroundColor={backgroundColor}
      color={color}
      textStyle={textStyle}
      lineHeight="1"
      aria-label={ariaLabel}
    >
      {count > MAX_COUNT ? `${MAX_COUNT}+` : count}
    </Flex>
  );
};

export default NumberBadge;
