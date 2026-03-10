import { DatePicker } from "@ark-ui/react";

import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

const ViewNavigation = () => (
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
);

export default ViewNavigation;
