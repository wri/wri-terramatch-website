import { Flex } from "@chakra-ui/react";
import classNames from "classnames";
import { FC, ReactNode } from "react";

export const METRIC_CARD_CLASS_NAME = (maxCard?: number) =>
  classNames(
    classNames(
      "mobile:!max-w-[100%] mobile:!min-w-[calc((100%/1)-6px)] flex-1 max-w-[calc((100%/2)-6px)] min-w-[calc((100%/2)-6px)]  w-[350px] h-auto",
      maxCard === 5
        ? "ws-1100:max-w-[calc((100%/3)-8px)] ws-1100:min-w-[calc((100%/3)-8px)] md:!max-w-[calc((100%/4)-9px)] md:!min-w-[calc((100%/4)-9px)] lg:!max-w-[calc((100%/5)-26px)] lg:!min-w-[calc((100%/5)-26px)]"
        : "ws-1100:max-w-[calc((100%/3)-8px)] ws-1100:min-w-[calc((100%/3)-8px)] md:!max-w-[calc((100%/4)-9px)] md:!min-w-[calc((100%/4)-9px)] lg:!max-w-[calc((100%/4)-1rem)] lg:!min-w-[calc((100%/4)-1rem)]"
    )
  );

interface MetricCardsRowProps {
  children: ReactNode;
  className?: string;
}

const MetricCardsRow: FC<MetricCardsRowProps> = ({ children, className }) => (
  <Flex flex={1} flexWrap="wrap" className={classNames("gap-x-3 gap-y-3 lg:gap-8", className)} justify="flex-start">
    {children}
  </Flex>
);

export default MetricCardsRow;
