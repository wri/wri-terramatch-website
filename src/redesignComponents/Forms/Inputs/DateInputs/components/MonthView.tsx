import { DatePicker, useDatePickerContext } from "@ark-ui/react";
import type { FC } from "react";

import ViewNavigation from "./ViewNavigation";

interface MonthViewProps {
  className?: string;
  columns?: 3 | 4;
}

const MonthView: FC<MonthViewProps> = ({ className = "rect-cell-view", columns = 3 }) => {
  const { getMonthsGrid } = useDatePickerContext();
  return (
    <DatePicker.View view="month" className={className}>
      <ViewNavigation />
      <DatePicker.Table>
        <DatePicker.TableBody>
          {getMonthsGrid({ columns, format: "short" }).map(months => (
            <DatePicker.TableRow key={months.map(({ value }) => value).join("-")}>
              {months.map(month => (
                <DatePicker.TableCell key={month.value} value={month.value}>
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

export default MonthView;
