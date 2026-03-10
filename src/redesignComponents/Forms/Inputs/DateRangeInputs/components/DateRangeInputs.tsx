import { useDatePickerContext } from "@ark-ui/react";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";

import type { PreservedDate } from "../types";
import { formatDate } from "../utils";

const DateRangeInputs = ({
  onClearDate,
  preservedRef
}: {
  onClearDate: (index: 0 | 1) => void;
  preservedRef: React.RefObject<PreservedDate | null>;
}) => {
  const { value } = useDatePickerContext();

  const isStartCleared = preservedRef.current?.clearedIndex === 0 && value.length === 1;
  const startText = isStartCleared ? "" : value[0] ? formatDate(value[0]) : "";
  const endText = isStartCleared ? (value[0] ? formatDate(value[0]) : "") : value[1] ? formatDate(value[1]) : "";

  return (
    <div className="mb-3 grid w-full max-w-[320px] grid-cols-2 items-center gap-2">
      <div className="ql-align-center border-theme-neutral-700 flex h-10 items-center gap-1 rounded border pl-3 pr-1.5">
        <input readOnly className="text-14-light w-full leading-[normal] outline-none" value={startText} />
        <CloseButton onClick={() => onClearDate(0)} className="!bg-transparent" />
      </div>
      <div className="ql-align-center border-theme-neutral-700 flex h-10 items-center gap-1 rounded border pl-3 pr-1.5">
        <input readOnly className="text-14-light w-full leading-[normal] outline-none" value={endText} />
        <CloseButton onClick={() => onClearDate(1)} className="!bg-transparent" />
      </div>
    </div>
  );
};

export default DateRangeInputs;
