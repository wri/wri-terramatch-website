import classNames from "classnames";
import { Fragment, ReactNode } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconProps } from "../Icon/Icon";
import List from "../List/List";

export interface TaskListProps {
  title: ReactNode;
  subtitle: string;
  items: TaskListItem[];
}

export interface TaskListItem {
  title: ReactNode;
  subtitle: string;
  iconProps: IconProps;
  actionText: string;
  actionUrl: string;
  done?: boolean;
}

const TaskList = (props: TaskListProps) => {
  return (
    <div className="w-[82vw] max-w-[82vw] overflow-hidden">
      <div className="bg-white p-8">
        <Text variant="text-36-bold" className="text-center" containHtml={true}>
          {props.title}
        </Text>
        <Text variant="text-16" className="mt-2 text-center">
          {props.subtitle}
        </Text>
      </div>
      <List
        as="div"
        className="flex flex-col gap-8 bg-no-repeat pb-10 pt-8"
        items={props.items}
        itemAs={Fragment}
        render={item => {
          return (
            <div
              className={classNames("flex items-center justify-between gap-6 rounded-xl border px-12 py-6 ", {
                "border-neutral-200 bg-white": !item.done,
                "border-secondary-500 bg-success-100": item.done
              })}
            >
              <div className="flex min-w-0 items-center gap-4">
                <Icon
                  {...item.iconProps}
                  width={60}
                  height={60}
                  className={classNames(item.iconProps.className, "min-w-[60px] wide:min-h-[100px] wide:min-w-[100px]")}
                />
                <div>
                  <Text variant="text-bold-subtitle-500" className="mb-1">
                    {item.title}
                  </Text>
                  <Text variant="text-body-400" containHtml>
                    {item.subtitle}
                  </Text>
                </div>
              </div>
              <div className="w-[148px]">
                <Button as="a" variant="sky" className="w-full flex-1" href={item.actionUrl}>
                  {item.actionText}
                </Button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default TaskList;
