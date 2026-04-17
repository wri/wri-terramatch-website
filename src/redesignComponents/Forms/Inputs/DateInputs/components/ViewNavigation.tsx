import { DatePicker } from "@ark-ui/react";
import type { FC } from "react";

import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

const ViewNavigation: FC = () => (
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
