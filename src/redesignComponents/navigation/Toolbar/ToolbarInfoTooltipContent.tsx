import { Box, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

type ToolbarInfoTooltipContentProps = {
  lines: ReactNode | ReactNode[];
};

const ToolbarInfoTooltipContent = ({ lines }: ToolbarInfoTooltipContentProps) => {
  const lineArray = Array.isArray(lines) ? lines : [lines];

  return (
    <Box>
      {lineArray.map((line, index) => (
        <Text key={index} color="neutral.200" textStyle="300" textAlign="center">
          {line}
        </Text>
      ))}
    </Box>
  );
};

export const wrapToolbarInfoTooltipContent = (content: ReactNode): ReactNode => {
  if (typeof content === "string") {
    return <ToolbarInfoTooltipContent lines={content} />;
  }
  return content;
};

export default ToolbarInfoTooltipContent;
