import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { CalendarIcon } from "@/redesignComponents/foundations/Icons";

import SeparatorDot from "./SeparatorDot";

export interface DateRangeProps {
  startDate: string;
  endDate: string;
}

const DateRange: FC<DateRangeProps> = ({ startDate, endDate }) => {
  const t = useT();

  return (
    <Flex gap={2} className="items-center">
      <Flex gap={1} className="items-center">
        <CalendarIcon />
        <Text textStyle="300" color="neutral.900">
          {t("Start:")}
        </Text>
        <Text textStyle="300" color="neutral.900">
          {startDate}
        </Text>
      </Flex>
      <SeparatorDot />
      <Flex gap={1} className="items-center">
        <CalendarIcon />
        <Text textStyle="300" color="neutral.900">
          {t("End:")}
        </Text>
        <Text textStyle="300-bold" color="neutral.900">
          {endDate}
        </Text>
      </Flex>
    </Flex>
  );
};

export default DateRange;
