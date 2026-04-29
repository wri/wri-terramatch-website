import type { DatePickerRootProps, DateValue } from "@ark-ui/react";
import { DatePicker, Portal, useDatePicker } from "@ark-ui/react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import type { FC } from "react";
import { useMemo, useState } from "react";

import { CalendarIcon } from "@/redesignComponents/foundations/Icons";
import { formatDateValue, getDateFormatString, parseDateInput } from "@/utils/date";

import { DayView, MonthView, YearView } from "../components";
import {
  calendarBaseGlobalStyles,
  datePickerControlStyles,
  FieldCaption,
  FieldContainer,
  FieldErrorBar,
  FieldErrorMessage,
  FieldLabel,
  RequiredIndicator
} from "../styled";

interface DatePickerInputProps {
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
  ${({ $size }) => datePickerControlStyles($size)}
`;

export const DatePickerInput: FC<DatePickerInputProps> = ({
  min,
  max,
  label,
  caption,
  errorMessage,
  required,
  disabled,
  size = "default",
  noMarginBottom = false
}) => {
  const [date, setDate] = useState<DateValue[]>([]);
  const browserLocale = useMemo(() => navigator.language, []);
  const dateFormat = useMemo(() => getDateFormatString(browserLocale), [browserLocale]);

  const picker = useDatePicker({
    selectionMode: "single",
    fixedWeeks: true,
    locale: browserLocale,
    min,
    max,
    value: date,
    disabled,
    format(dateVal) {
      return formatDateValue(dateVal, dateFormat);
    },
    parse(value): DateValue | undefined {
      return parseDateInput(value, dateFormat) as DateValue | undefined;
    },
    onValueChange({ value }) {
      setDate(value);
    }
  });

  return (
    <FieldContainer $size={size} $noMarginBottom={noMarginBottom} className="ds-date-picker-input-container">
      {errorMessage != null ? <FieldErrorBar /> : null}
      <div style={{ marginLeft: errorMessage != null ? "19px" : "0px" }}>
        {label != null ? (
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
        {caption != null ? (
          <FieldCaption $size={size} $disabled={disabled} aria-label={caption}>
            {caption}
          </FieldCaption>
        ) : null}
        {errorMessage != null ? (
          <FieldErrorMessage $size={size} aria-label={errorMessage} role="alert">
            {errorMessage}
          </FieldErrorMessage>
        ) : null}
        <StyledPickerWrapper
          $size={size}
          data-invalid={errorMessage != null ? "" : undefined}
          data-open={picker.open ? "" : undefined}
        >
          <Global styles={calendarBaseGlobalStyles} />
          <DatePicker.RootProvider value={picker}>
            <DatePicker.Control
              onClick={() => !disabled && picker.setOpen(true)}
              style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            >
              <CalendarIcon />
              <DatePicker.Input index={0} placeholder={dateFormat} />
            </DatePicker.Control>
            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content className="!min-h-[325px]">
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

export default DatePickerInput;
