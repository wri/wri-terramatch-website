import { DatePicker, Portal, useDatePickerContext } from "@ark-ui/react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";

import { CalendarIcon, ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

import { calendarGlobalStyles, dateRangePickerStyles } from "./styled";

const StyledWrapper = styled.div`
  ${dateRangePickerStyles}
`;

const DayView = () => {
  const context = useDatePickerContext();
  return (
    <DatePicker.View view="day">
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger>
          <ChevronRightIcon />
        </DatePicker.PrevTrigger>
        <DatePicker.ViewTrigger>
          <DatePicker.RangeText />
        </DatePicker.ViewTrigger>
        <DatePicker.NextTrigger>
          <ChevronRightIcon />
        </DatePicker.NextTrigger>
      </DatePicker.ViewControl>
      <DatePicker.Table>
        <DatePicker.TableHead>
          <DatePicker.TableRow>
            {context.weekDays.map((weekDay, i) => (
              <DatePicker.TableHeader key={i}>{weekDay.narrow}</DatePicker.TableHeader>
            ))}
          </DatePicker.TableRow>
        </DatePicker.TableHead>
        <DatePicker.TableBody>
          {context.weeks.map((week, i) => (
            <DatePicker.TableRow key={i}>
              {week.map((day, j) => (
                <DatePicker.TableCell key={j} value={day}>
                  <DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
                </DatePicker.TableCell>
              ))}
            </DatePicker.TableRow>
          ))}
        </DatePicker.TableBody>
      </DatePicker.Table>
    </DatePicker.View>
  );
};

const MonthView = () => {
  const context = useDatePickerContext();
  return (
    <DatePicker.View view="month">
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger>&larr;</DatePicker.PrevTrigger>
        <DatePicker.ViewTrigger>
          <DatePicker.RangeText />
        </DatePicker.ViewTrigger>
        <DatePicker.NextTrigger>&rarr;</DatePicker.NextTrigger>
      </DatePicker.ViewControl>
      <DatePicker.Table>
        <DatePicker.TableBody>
          {context.getMonthsGrid({ columns: 4, format: "short" }).map((months, i) => (
            <DatePicker.TableRow key={i}>
              {months.map((month, j) => (
                <DatePicker.TableCell key={j} value={month.value}>
                  <DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
                </DatePicker.TableCell>
              ))}
            </DatePicker.TableRow>
          ))}
        </DatePicker.TableBody>
      </DatePicker.Table>
    </DatePicker.View>
  );
};

const YearView = () => {
  const context = useDatePickerContext();
  return (
    <DatePicker.View view="year">
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger>&larr;</DatePicker.PrevTrigger>
        <DatePicker.ViewTrigger>
          <DatePicker.RangeText />
        </DatePicker.ViewTrigger>
        <DatePicker.NextTrigger>&rarr;</DatePicker.NextTrigger>
      </DatePicker.ViewControl>
      <DatePicker.Table>
        <DatePicker.TableBody>
          {context.getYearsGrid({ columns: 4 }).map((years, i) => (
            <DatePicker.TableRow key={i}>
              {years.map((year, j) => (
                <DatePicker.TableCell key={j} value={year.value}>
                  <DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
                </DatePicker.TableCell>
              ))}
            </DatePicker.TableRow>
          ))}
        </DatePicker.TableBody>
      </DatePicker.Table>
    </DatePicker.View>
  );
};

export const DateRangeInput = () => {
  return (
    <StyledWrapper>
      <Global styles={calendarGlobalStyles} />
      <DatePicker.Root selectionMode="range">
        <DatePicker.Label>Select range</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input index={0} />
          <DatePicker.Input index={1} />
          <DatePicker.Trigger>
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.Control>
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DayView />
              <MonthView />
              <YearView />
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
    </StyledWrapper>
  );
};

export default DateRangeInput;
