import type { DatePickerRootProps, DateValue } from "@ark-ui/react";
import { DatePicker, Portal, useDatePicker } from "@ark-ui/react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import classNames from "classnames";
import { useRef, useState } from "react";

import { CalendarIcon } from "@/redesignComponents/foundations/Icons";

import { DateRangeInputs, DayView, MonthView, YearView } from "./components";
import {
  calendarGlobalStyles,
  dateRangePickerStyles,
  FieldCaption,
  FieldContainer,
  FieldErrorBar,
  FieldErrorMessage,
  FieldLabel,
  RequiredIndicator
} from "./styled";
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
}

const StyledPickerWrapper = styled.div<{ $size: "default" | "small" }>`
  ${({ $size }) => dateRangePickerStyles($size)}
`;

export const DateRangeInput = ({
  min,
  max,
  label,
  caption,
  errorMessage,
  required,
  disabled,
  size = "default",
  noMarginBottom = false
}: DateRangeInputProps) => {
  const [dates, setDates] = useState<DateValue[]>([]);
  const preservedRef = useRef<PreservedDate | null>(null);

  const picker = useDatePicker({
    selectionMode: "range",
    fixedWeeks: true,
    min,
    max,
    value: dates,
    disabled,
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
    }
  });

  const handleClearDate = (index: 0 | 1) => {
    const keepDate = index === 0 ? dates[1] : dates[0];

    if (!keepDate) {
      preservedRef.current = null;
      setDates([]);
    } else {
      preservedRef.current = { date: keepDate, clearedIndex: index };
      setDates([keepDate]);
    }

    picker.setOpen(true);
  };

  return (
    <FieldContainer $size={size} $noMarginBottom={noMarginBottom} className="ds-date-range-input-container">
      {errorMessage ? <FieldErrorBar /> : null}
      <div style={{ marginLeft: errorMessage ? "19px" : "0px" }}>
        {label ? (
          <FieldLabel $size={size} $disabled={disabled} aria-label={label}>
            {required ? (
              <RequiredIndicator $disabled={disabled} aria-label="required">
                *
              </RequiredIndicator>
            ) : null}
            {label}
            {!required ? <span className="optional-text">{" (Optional)"}</span> : ""}
          </FieldLabel>
        ) : null}
        {caption ? (
          <FieldCaption $size={size} $disabled={disabled} aria-label={caption}>
            {caption}
          </FieldCaption>
        ) : null}
        {errorMessage ? (
          <FieldErrorMessage $size={size} aria-label={errorMessage} role="alert">
            {errorMessage}
          </FieldErrorMessage>
        ) : null}
        <StyledPickerWrapper $size={size} data-invalid={errorMessage ? "" : undefined}>
          <Global styles={calendarGlobalStyles} />
          <DatePicker.RootProvider value={picker}>
            <DatePicker.Label>Select range</DatePicker.Label>
            <DatePicker.Control>
              <DatePicker.Trigger>
                <CalendarIcon />
              </DatePicker.Trigger>
              <DatePicker.Input index={0} placeholder="MM/DD/YYYY" />
              <span
                className={classNames("text-14-light text-theme-neutral-800", {
                  "!text-theme-neutral-500": !dates[0] && !dates[1]
                })}
              >
                —
              </span>
              <DatePicker.Input index={1} placeholder="MM/DD/YYYY" />
            </DatePicker.Control>
            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content>
                  <DateRangeInputs onClearDate={handleClearDate} preservedRef={preservedRef} />
                  <DayView />
                  <MonthView />
                  <YearView />
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          </DatePicker.RootProvider>
        </StyledPickerWrapper>
      </div>
    </FieldContainer>
  );
};

export default DateRangeInput;
