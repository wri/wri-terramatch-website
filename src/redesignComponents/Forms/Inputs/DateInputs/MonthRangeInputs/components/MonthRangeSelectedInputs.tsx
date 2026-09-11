import { useDatePickerContext } from "@ark-ui/react";
import type { FC, RefObject } from "react";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";

import type { PreservedDate } from "../../DateRangeInputs/types";
import { formatMonthYear } from "../utils";

interface MonthRangeSelectedInputsProps {
  onClearMonth: (index: 0 | 1) => void;
  preservedRef: RefObject<PreservedDate | null>;
  locale: string;
}

const MonthRangeSelectedInputs: FC<MonthRangeSelectedInputsProps> = ({ onClearMonth, preservedRef, locale }) => {
  const { value } = useDatePickerContext();

  const isStartCleared = preservedRef.current?.clearedIndex === 0 && value.length === 1;
  const startText = isStartCleared ? "" : value[0] ? formatMonthYear(value[0], locale) : "";
  const endText = isStartCleared
    ? value[0]
      ? formatMonthYear(value[0], locale)
      : ""
    : value[1]
    ? formatMonthYear(value[1], locale)
    : "";

  return (
    <div className="mb-3 grid w-full grid-cols-2 items-center gap-2">
      <div className="ql-align-center flex h-10 items-center gap-1 rounded border border-theme-neutral-700 pl-3 pr-1.5">
        <input
          readOnly
          className="text-14-light w-full leading-[normal] !tracking-[-0.015625rem] outline-none"
          value={startText}
        />
        <CloseButton onClick={() => onClearMonth(0)} className="!bg-transparent" />
      </div>
      <div className="ql-align-center flex h-10 items-center gap-1 rounded border border-theme-neutral-700 pl-3 pr-1.5">
        <input
          readOnly
          className="text-14-light w-full leading-[normal] !tracking-[-0.015625rem] outline-none"
          value={endText}
        />
        <CloseButton onClick={() => onClearMonth(1)} className="!bg-transparent" />
      </div>
    </div>
  );
};

export default MonthRangeSelectedInputs;
