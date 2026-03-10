import { DatePicker, useDatePickerContext } from "@ark-ui/react";

import ViewNavigation from "./ViewNavigation";

const MonthView = () => {
  const { getMonthsGrid } = useDatePickerContext();
  return (
    <DatePicker.View view="month" className="rect-cell-view">
      <ViewNavigation />
      <DatePicker.Table>
        <DatePicker.TableBody>
          {getMonthsGrid({ columns: 3, format: "short" }).map((months, i) => (
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

export default MonthView;
