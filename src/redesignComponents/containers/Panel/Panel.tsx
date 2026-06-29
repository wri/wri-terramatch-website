import { Box } from "@chakra-ui/react";
import { Panel as WriPanel } from "@worldresources/wri-design-systems";
import React, { ComponentProps, FC } from "react";
import { twMerge } from "tailwind-merge";

const Panel: FC<ComponentProps<typeof WriPanel> & { className?: string }> = ({ className, ...props }) => {
  const boxStyles = {
    "& > div": {
      width: "100% !important"
    }
  };

  return (
    <Box css={boxStyles} className={twMerge("h-full", className)}>
      <WriPanel {...props} />
    </Box>
  );
};

export default Panel;
