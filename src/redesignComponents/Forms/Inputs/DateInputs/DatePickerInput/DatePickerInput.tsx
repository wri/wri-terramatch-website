import type { DatePickerRootProps, DateValue } from "@ark-ui/react";
import { DatePicker, Portal, useDatePicker } from "@ark-ui/react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { FieldWrapper } from "@worldresources/wri-design-systems";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { CalendarIcon } from "@/redesignComponents/foundations/Icons";
import { formatDateValue, getDateFormatString, parseDateInput } from "@/utils/date";

import { DayView, MonthView, YearView } from "../components";
import { calendarBaseGlobalStyles, datePickerControlStyles } from "../styled";

interface DatePickerInputProps {
  showOptionalLabel?: boolean;
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
  className?: string;
}

const StyledPickerWrapper = styled.div<{ $size: "default" | "small" }>`
  ${({ $size }) => datePickerControlStyles($size)}
`;

export const DatePickerInput: FC<DatePickerInputProps> = ({
  showOptionalLabel = true,
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
  onValueChange,
  className
}) => {
  const [uncontrolledDate, setUncontrolledDate] = useState<DateValue[]>(defaultValue);
  const date = valueProp ?? uncontrolledDate;
  const isFilled = date.length > 0;
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
      if (valueProp !== undefined) {
        onValueChange?.(value);
      } else {
        setUncontrolledDate(value);
      }
    }
  });

  return (
    <FieldWrapper
      label={label}
      caption={caption}
      errorMessage={errorMessage}
      required={required}
      disabled={disabled}
      size={size}
      showOptionalLabel={showOptionalLabel}
      noMarginBottom={noMarginBottom}
      className={twMerge("ds-date-picker-input-container", className)}
    >
      <StyledPickerWrapper
        $size={size}
        data-invalid={errorMessage != null ? "" : undefined}
        data-open={picker.open ? "" : undefined}
        data-filled={isFilled ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
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
              <DatePicker.Content className="!min-h-[20.3125rem]">
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

export default DatePickerInput;
