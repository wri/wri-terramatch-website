import { Text } from "@chakra-ui/react";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import type { TextBadgeProps, TextBadgeVariant } from "./types";

const getColor = (variant: TextBadgeVariant) => {
  if (variant === "primary") return "primary.100";
  if (variant === "secondary") return "neutral.700";
  if (variant === "error") return "neutral.100";
};

const getClassName = (variant: TextBadgeVariant) => {
  if (variant === "primary") return "primary.900";
  if (variant === "secondary") return "neutral.200";
  if (variant === "error") return "error.500";
};

const TextBadge: FC<TextBadgeProps> = ({ children, variant = "primary", className }) => {
  return (
    <Text
      textStyle="300-bold"
      color={getColor(variant)}
      className={twMerge("rounded-full px-2 py-1", className)}
      backgroundColor={getClassName(variant)}
    >
      {children}
    </Text>
  );
};

export default TextBadge;
