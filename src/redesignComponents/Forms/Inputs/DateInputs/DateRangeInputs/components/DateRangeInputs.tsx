import type { DateValue } from "@ark-ui/react";
import { useDatePickerContext } from "@ark-ui/react";
import type { FC } from "react";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";

import type { PreservedDate } from "../types";

interface DateRangeInputsProps {
  onClearDate: (index: 0 | 1) => void;
  preservedRef: React.RefObject<PreservedDate | null>;
  formatValue: (date: DateValue) => string;
}

const DateRangeInputs: FC<DateRangeInputsProps> = ({ onClearDate, preservedRef, formatValue }) => {
  const { value } = useDatePickerContext();

  const isStartCleared = preservedRef.current?.clearedIndex === 0 && value.length === 1;
  const startText = isStartCleared ? "" : value[0] ? formatValue(value[0]) : "";
  const endText = isStartCleared ? (value[0] ? formatValue(value[0]) : "") : value[1] ? formatValue(value[1]) : "";

  return (
    <div className="mb-3 grid w-full max-w-[20rem] grid-cols-2 items-center gap-2">
      <div className="ql-align-center flex h-10 items-center gap-1 rounded border border-theme-neutral-700 pl-3 pr-1.5">
        <input
          readOnly
          className="text-14-light w-full leading-[normal] !tracking-[-0.015625rem] outline-none"
          value={startText}
        />
        <CloseButton onClick={() => onClearDate(0)} className="!bg-transparent" />
      </div>
      <div className="ql-align-center flex h-10 items-center gap-1 rounded border border-theme-neutral-700 pl-3 pr-1.5">
        <input
          readOnly
          className="text-14-light w-full leading-[normal] !tracking-[-0.015625rem] outline-none"
          value={endText}
        />
        <CloseButton onClick={() => onClearDate(1)} className="!bg-transparent" />
      </div>
    </div>
  );
};

export default DateRangeInputs;
