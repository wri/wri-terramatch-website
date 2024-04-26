import classNames from "classnames";
import { FC, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import WorkdaysGrid from "./WorkdayGrid";

export interface WorkdayCollapseGridItemProps {
  title: string;
  value: string;
}

export interface WorkdayCollapseGridContentProps {
  type: "Gender" | "Age" | "Ethnicity";
  item: WorkdayCollapseGridItemProps[];
  total: string;
}

export interface WorkdayCollapseGridProps {
  title: string;
  status: "Complete" | "Not Started" | "In Progress";
  content: WorkdayCollapseGridContentProps[];
}

const WorkdayCollapseGrid: FC<WorkdayCollapseGridProps> = ({ title, status, content, ...rest }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={classNames("flex w-full items-center justify-between rounded-t-2xl bg-customGreen-100 p-4", {
          "rounded-b-2xl": !open
        })}
      >
        <Text variant="text-18-bold">{title}</Text>
        <div className="flex items-baseline gap-2">
          <Text
            variant="text-14-bold"
            className={classNames("flex items-start gap-2 leading-normal", {
              "text-customGreen-200": status === "Complete",
              "text-neutral-550": status === "Not Started",
              "text-tertiary-450": status === "In Progress"
            })}
          >
            {status}
            <When condition={status === "Complete"}>
              <Icon name={IconNames.ROUND_CUSTOM_TICK} width={16} height={16} className="text-customGreen-200" />
            </When>
          </Text>

          <Icon
            name={IconNames.IC_ARROW_COLLAPSE}
            width={16}
            height={9}
            className={classNames("text-customGreen-300", { "rotate-180 transform": open })}
          />
        </div>
      </button>
      <When condition={open}>
        <WorkdaysGrid content={content} />
      </When>
    </div>
  );
};

export default WorkdayCollapseGrid;
