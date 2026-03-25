import { Flex } from "@chakra-ui/react";
import classNames from "classnames";
import { FC, ReactNode } from "react";

export const METRIC_CARD_CLASS_NAME = classNames(
  "flex-1 max-w-[calc((100%/2)-6px)] ws-1100:max-w-[calc((100%/3)-6px)] md:!max-w-[calc((100%/4)-6px)] lg:!max-w-[calc((100%/4)-1rem)] w-[350px] h-auto"
);

interface KeyIndicatorsInsightsRowProps {
  children: ReactNode;
  className?: string;
}

const KeyIndicatorsInsightsRow: FC<KeyIndicatorsInsightsRowProps> = ({ children, className }) => (
  <Flex
    flex={1}
    flexWrap="wrap"
    className={classNames("gap-x-3 gap-y-3 lg:gap-x-8 lg:gap-y-8", className)}
    justify="flex-start"
  >
    {children}
  </Flex>
);

export default KeyIndicatorsInsightsRow;
