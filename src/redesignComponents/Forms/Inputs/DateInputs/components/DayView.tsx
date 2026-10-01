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
            {weekDays.map(weekDay => (
              <DatePicker.TableHeader key={weekDay.value.toString()}>{weekDay.narrow}</DatePicker.TableHeader>
            ))}
          </DatePicker.TableRow>
        </DatePicker.TableHead>
        <DatePicker.TableBody>
          {weeks.map(week => (
            <DatePicker.TableRow key={week.map(day => day.toString()).join("-")}>
              {week.map(day => (
                <DatePicker.TableCell key={day.toString()} value={day}>
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
