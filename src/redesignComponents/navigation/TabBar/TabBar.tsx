import { Box } from "@chakra-ui/react";
import { TabBar as TabBarWri } from "@worldresources/wri-design-systems";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export type TabBarWriProps = React.ComponentProps<typeof TabBarWri>;

interface TabBarProps extends TabBarWriProps {
  css?: React.CSSProperties;
  className?: string;
}

const TabBar: FC<TabBarProps> = props => {
  const { css, className, ...rest } = props;
  return (
    <Box
      css={{
        "& button": {
          textWrap: "nowrap !important"
        },
        "& > div:first-of-type": {
          minWidth: "max-content",
          width: "100%"
        },
        ...css
      }}
      className={twMerge("w-max-content", className)}
    >
      <TabBarWri {...rest} />
    </Box>
  );
};

export default TabBar;
