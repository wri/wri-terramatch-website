import classNames from "classnames";
import { Fragment } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconProps } from "../Icon/Icon";
import List from "../List/List";

export interface TaskListProps {
  title: string;
  subtitle: string;
  items: TaskListItem[];
}

export interface TaskListItem {
  title: string;
  subtitle: string;
  iconProps: IconProps;
  actionText: string;
  actionUrl: string;
  done?: boolean;
}

const TaskList = (props: TaskListProps) => {
  return (
    <div className="w-full overflow-hidden rounded-xl shadow">
      <div className="bg-white p-8">
        <Text variant="text-bold-headline-800" className="mb-2">
          {props.title}
        </Text>
        <Text variant="text-light-subtitle-400">{props.subtitle}</Text>
      </div>
      <List
        as="div"
        className="flex flex-col gap-8 bg-taskList bg-cover bg-no-repeat p-8 pb-10"
        items={props.items}
        itemAs={Fragment}
        render={item => {
          return (
            <div
              className={classNames("flex items-center justify-between gap-6 rounded-xl border py-6 px-5 shadow ", {
                "border-neutral-200 bg-white": !item.done,
                "border-secondary-500 bg-success-100": item.done
              })}
            >
              <div className="flex min-w-0 items-center gap-4">
                <Icon
                  {...item.iconProps}
                  width={60}
                  height={60}
                  className={classNames(item.iconProps.className, "min-w-[60px]")}
                />
                <div>
                  <Text variant="text-bold-subtitle-500" className="mb-1">
                    {item.title}
                  </Text>
                  <Text variant="text-light-body-300" containHtml>
                    {item.subtitle}
                  </Text>
                </div>
              </div>
              <Button as="a" variant="secondary" href={item.actionUrl}>
                {item.actionText}
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
};

export default TaskList;
