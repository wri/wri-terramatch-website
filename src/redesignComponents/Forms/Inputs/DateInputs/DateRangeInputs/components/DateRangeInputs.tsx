import { useDatePickerContext } from "@ark-ui/react";
import type { FC } from "react";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";
import { formatDateValue } from "@/utils/date";

import type { PreservedDate } from "../types";

interface DateRangeInputsProps {
  onClearDate: (index: 0 | 1) => void;
  preservedRef: React.RefObject<PreservedDate | null>;
  dateFormat: string;
}

const DateRangeInputs: FC<DateRangeInputsProps> = ({ onClearDate, preservedRef, dateFormat }) => {
  const { value } = useDatePickerContext();

  const isStartCleared = preservedRef.current?.clearedIndex === 0 && value.length === 1;
  const startText = isStartCleared ? "" : value[0] != null ? formatDateValue(value[0], dateFormat) : "";
  const endText = isStartCleared
    ? value[0] != null
      ? formatDateValue(value[0], dateFormat)
      : ""
    : value[1] != null
    ? formatDateValue(value[1], dateFormat)
    : "";

  return (
    <Grid className="mb-3 w-full max-w-[20rem] grid-cols-2 items-center gap-2">
      <Flex className="ql-align-center h-10 items-center gap-1 rounded border border-theme-neutral-700 pl-3 pr-1.5">
        <input
          readOnly
          className="text-14-light w-full leading-[normal] !tracking-[-0.015625rem] outline-none"
          value={startText}
        />
        <CloseButton onClick={() => onClearDate(0)} className="!bg-transparent" />
      </Flex>
      <Flex className="ql-align-center h-10 items-center gap-1 rounded border border-theme-neutral-700 pl-3 pr-1.5">
        <input
          readOnly
          className="text-14-light w-full leading-[normal] !tracking-[-0.015625rem] outline-none"
          value={endText}
        />
        <CloseButton onClick={() => onClearDate(1)} className="!bg-transparent" />
      </Flex>
    </Grid>
  );
};

export default DateRangeInputs;
import { Flex, Grid } from "@chakra-ui/react";
