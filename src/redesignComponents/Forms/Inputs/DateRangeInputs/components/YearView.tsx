import { DatePicker, useDatePickerContext } from "@ark-ui/react";

import ViewNavigation from "./ViewNavigation";

const YearView = () => {
  const { getYearsGrid } = useDatePickerContext();
  return (
    <DatePicker.View view="year" className="rect-cell-view">
      <ViewNavigation />
      <DatePicker.Table>
        <DatePicker.TableBody>
          {getYearsGrid({ columns: 3 }).map((years, i) => (
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

export default YearView;
