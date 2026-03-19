import { DatePicker, useDatePickerContext } from "@ark-ui/react";
import type { FC } from "react";

import ViewNavigation from "./ViewNavigation";

const DayView: FC = () => {
  const { weekDays, weeks } = useDatePickerContext();
  return (
    <DatePicker.View view="day">
      <ViewNavigation />
      <DatePicker.Table>
        <DatePicker.TableHead>
          <DatePicker.TableRow>
            {weekDays.map((weekDay, i) => (
              <DatePicker.TableHeader key={i}>{weekDay.narrow}</DatePicker.TableHeader>
            ))}
          </DatePicker.TableRow>
        </DatePicker.TableHead>
        <DatePicker.TableBody>
          {weeks.map((week, i) => (
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

export default DayView;
