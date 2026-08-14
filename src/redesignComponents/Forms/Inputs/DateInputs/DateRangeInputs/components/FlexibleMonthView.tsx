import { DatePicker, useDatePickerContext } from "@ark-ui/react";
import type { FC } from "react";

import ViewNavigation from "../../components/ViewNavigation";

const FlexibleMonthView: FC = () => {
  const { getMonthsGrid } = useDatePickerContext();
  return (
    <DatePicker.View view="month" className="flexible-month-view">
      <ViewNavigation />
      <DatePicker.Table>
        <DatePicker.TableBody>
          {getMonthsGrid({ columns: 4, format: "short" }).map((months, i) => (
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

export default FlexibleMonthView;
