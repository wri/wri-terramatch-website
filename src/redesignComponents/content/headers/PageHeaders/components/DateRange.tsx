import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { Calendar } from "@/redesignComponents/foundations/Icons/Calendar";

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
        <Calendar />
        <Text fontSize="14px" color="neutral.900">
          {t("Start:")}
        </Text>
        <Text fontSize="14px" color="neutral.900" fontWeight="bold">
          {startDate}
        </Text>
      </Flex>
      <SeparatorDot />
      <Flex gap={1} className="items-center">
        <Calendar />
        <Text fontSize="14px" color="neutral.900">
          {t("End:")}
        </Text>
        <Text fontSize="14px" color="neutral.900" fontWeight="bold">
          {endDate}
        </Text>
      </Flex>
    </Flex>
  );
};

export default DateRange;
