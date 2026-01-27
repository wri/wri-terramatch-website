import { Text } from "@chakra-ui/react";
import { FC } from "react";

import type { TextBadgeProps, TextBadgeVariant } from "./types";

const getColor = (variant: TextBadgeVariant) => {
  if (variant === "primary") return "primary.100";
  if (variant === "secondary") return "neutral.700";
};

const getClassName = (variant: TextBadgeVariant) => {
  if (variant === "primary") return "primary.900";
  if (variant === "secondary") return "neutral.200";
};

const TextBadge: FC<TextBadgeProps> = ({ children, variant = "primary", className }) => {
  return (
    <Text
      fontSize="14px"
      lineHeight="20px"
      color={getColor(variant)}
      fontWeight="bold"
      className={className}
      paddingX="8px"
      paddingY="4px"
      borderRadius="full"
      backgroundColor={getClassName(variant)}
    >
      {children}
    </Text>
  );
};

export default TextBadge;
