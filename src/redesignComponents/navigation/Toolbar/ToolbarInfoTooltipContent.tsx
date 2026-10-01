import { Box, Text } from "@chakra-ui/react";
import { Children, FC, ReactNode } from "react";

type ToolbarInfoTooltipContentProps = {
  lines: ReactNode | ReactNode[];
};

const ToolbarInfoTooltipContent: FC<ToolbarInfoTooltipContentProps> = ({ lines }) => (
  <Box>
    {Children.map(lines, line => (
      <Text color="neutral.200" textStyle="300" textAlign="center">
        {line}
      </Text>
    ))}
  </Box>
);

export const wrapToolbarInfoTooltipContent = (content: ReactNode): ReactNode => {
  if (typeof content === "string") {
    return <ToolbarInfoTooltipContent lines={content} />;
  }
  return content;
};

export default ToolbarInfoTooltipContent;
