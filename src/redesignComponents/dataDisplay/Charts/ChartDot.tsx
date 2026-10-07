import { Box } from "@chakra-ui/react";
import { FC } from "react";

export type ChartDotProps = {
  color: string;
  size?: "small" | "medium";
};

const DOT_SIZES = { small: "0.75rem", medium: "1rem" } as const;

export const ChartDot: FC<ChartDotProps> = ({ color, size = "medium" }) => (
  <Box
    flexShrink={0}
    width={DOT_SIZES[size]}
    height={DOT_SIZES[size]}
    borderRadius="full"
    borderWidth="1px"
    borderColor="blackAlpha.300"
    style={{ backgroundColor: color }}
  />
);

export default ChartDot;
