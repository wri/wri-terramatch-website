import type { DatePickerRootProps, DateValue } from "@ark-ui/react";
import { DatePicker, Portal, useDatePicker } from "@ark-ui/react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { FieldWrapper, getThemedColor } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import type { FC, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import { CalendarIcon } from "@/redesignComponents/foundations/Icons";
import { formatDateValue, getDateFormatString, parseDateInput } from "@/utils/date";

import { DayView, MonthView, YearView } from "../components";
import { datePickerControlStyles } from "../styled";
import { useKeyboardFocusVisible } from "../useKeyboardFocusVisible";
import { DateRangeInputs } from "./components";
import { calendarGlobalStyles } from "./styled";
import type { PreservedDate } from "./types";

interface DateRangeInputProps {
  min?: DatePickerRootProps["min"];
  max?: DatePickerRootProps["max"];
  label?: string;
  caption?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  size?: "default" | "small";
  noMarginBottom?: boolean;
  value?: DateValue[];
  defaultValue?: DateValue[];
  onValueChange?: (value: DateValue[]) => void;
}

const StyledPickerWrapper = styled.div<{ $size: "default" | "small" }>`
  ${({ $size }) => datePickerControlStyles($size)}
`;

export const DateRangeInput: FC<DateRangeInputProps> = ({
  min,
  max,
  label,
  caption,
  errorMessage,
  required,
  disabled,
  size = "default",
  noMarginBottom = false,
  value: valueProp,
  defaultValue = [],
  onValueChange
}) => {
  useKeyboardFocusVisible();
  const [uncontrolledDates, setUncontrolledDates] = useState<DateValue[]>(defaultValue);
  const dates = valueProp ?? uncontrolledDates;
  const isFilled = dates.length > 0;
  const setDates = useCallback(
    (next: DateValue[]) => {
      if (valueProp !== undefined) {
        onValueChange?.(next);
      } else {
        setUncontrolledDates(next);
      }
    },
    [onValueChange, valueProp]
  );
  const preservedRef = useRef<PreservedDate | null>(null);
  const browserLocale = useMemo(() => navigator.language, []);
  const dateFormat = useMemo(() => getDateFormatString(browserLocale), [browserLocale]);

  const picker = useDatePicker({
    selectionMode: "range",
    fixedWeeks: true,
    locale: browserLocale,
    min,
    max,
    value: dates,
    disabled,
    format(date) {
      return formatDateValue(date, dateFormat);
    },
    parse(value): DateValue | undefined {
      return parseDateInput(value, dateFormat) as DateValue | undefined;
    },
    onValueChange({ value }) {
      const preserved = preservedRef.current;

      if (preserved && value.length === 1) {
        preservedRef.current = null;
        const [a, b] = value[0].compare(preserved.date) > 0 ? [preserved.date, value[0]] : [value[0], preserved.date];
        setDates([a, b]);
        return;
      }

      if (preserved && value.length === 0) return;

      preservedRef.current = null;
      setDates(value);

      if (value.length === 1) {
        requestAnimationFrame(() => picker.setOpen(true));
      }
    }
  });

  const handleClearDate = useCallback(
    (index: 0 | 1) => {
      if (preservedRef.current) {
        preservedRef.current = null;
        setDates([]);
        picker.setOpen(true);
        return;
      }

      const keepDate = index === 0 ? dates[1] : dates[0];

      if (!keepDate) {
        preservedRef.current = null;
        setDates([]);
      } else {
        preservedRef.current = { date: keepDate, clearedIndex: index };
        setDates([keepDate]);
      }

      picker.setOpen(true);
    },
    [dates, picker, setDates]
  );

  const handleInputKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (disabled || picker.open) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        picker.setOpen(true);
      }
    },
    [disabled, picker]
  );

  return (
    <FieldWrapper
      label={label}
      caption={caption}
      errorMessage={errorMessage}
      required={required}
      disabled={disabled}
      size={size}
      showOptionalLabel={false}
      noMarginBottom={noMarginBottom}
      className="ds-date-range-input-container"
    >
      <StyledPickerWrapper
        $size={size}
        data-invalid={errorMessage != null ? "" : undefined}
        data-open={picker.open ? "" : undefined}
        data-filled={isFilled ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
      >
        <Global styles={calendarGlobalStyles} />
        <DatePicker.RootProvider value={picker}>
          <DatePicker.Control
            onClick={() => !disabled && picker.setOpen(true)}
            style={{ gap: "0.5rem", cursor: disabled ? "not-allowed" : "pointer" }}
          >
            <CalendarIcon style={{ color: getThemedColor("neutral", 600) }} />
            <div className="flex justify-center">
              <DatePicker.Input index={0} placeholder={dateFormat} onKeyDown={handleInputKeyDown} />
            </div>

            <span
              className={classNames("text-14-light text-theme-neutral-800", {
                "!text-theme-neutral-500": !dates[0] && !dates[1]
              })}
            >
              —
            </span>

            <div className="flex justify-center">
              <DatePicker.Input index={1} placeholder={dateFormat} onKeyDown={handleInputKeyDown} />
            </div>
          </DatePicker.Control>
          <Portal>
            <DatePicker.Positioner>
              <DatePicker.Content>
                <DateRangeInputs onClearDate={handleClearDate} preservedRef={preservedRef} dateFormat={dateFormat} />
                <DayView />
                <MonthView />
                <YearView />
              </DatePicker.Content>
            </DatePicker.Positioner>
          </Portal>
        </DatePicker.RootProvider>
      </StyledPickerWrapper>
    </FieldWrapper>
  );
};

export default DateRangeInput;
