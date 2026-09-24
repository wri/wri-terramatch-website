import { Box, Flex } from "@chakra-ui/react";
import classNames from "classnames";
import { FC } from "react";

import { ToolbarProps } from "./ToolBar.type";

const Toolbar: FC<ToolbarProps> = ({
  contentLeft,
  contentRight,
  className,
  classNameContentRight,
  contentCenter,
  classNameContentLeft,
  classNameContentCenter
}) => {
  return (
    <Flex className={classNames("items-center justify-between bg-white px-4", className)}>
      <Flex className={classNames("min-h-[1.75rem] flex-shrink-0 flex-col justify-center", classNameContentLeft)}>
        {contentLeft}
      </Flex>
      <Box className={classNameContentCenter}>{contentCenter}</Box>
      <Box className={classNames("flex-shrink-0", classNameContentRight)}>{contentRight}</Box>
    </Flex>
  );
};

export default Toolbar;
