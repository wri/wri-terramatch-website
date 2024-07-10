import classnames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { Status } from "@/types/common";

export interface StatusPillProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status: Status;
}

const StatusPill = ({ status, children, className, ...props }: StatusPillProps) => {
  // eslint-disable-next-line no-unused-vars
  const StatusMapping: { [key in Status]: any } = {
    edit: {
      classNames: "bg-neutral-200",
      iconProps: {
        name: IconNames.EDIT_CIRCLE,
        classNames: "fill-neutral-800"
      }
    },
    error: {
      classNames: "bg-error-200",
      iconProps: {
        name: IconNames.CROSS_CIRCLE,
        classNames: "fill-error"
      }
    },
    success: {
      classNames: "bg-secondary-200",
      iconProps: {
        name: IconNames.CHECK_CIRCLE_FILL,
        classNames: "fill-secondary"
      }
    },
    awaiting: {
      classNames: "bg-primary-200",
      iconProps: {
        name: IconNames.CLOCK,
        classNames: "fill-primary"
      }
    },
    warning: {
      classNames: "bg-tertiary-200",
      iconProps: {
        name: IconNames.WARNING,
        classNames: "fill-tertiary"
      }
    },
    restoration: {
      classNames: "bg-green-30",
      iconProps: {
        name: IconNames.CLOCK,
        classNames: "fill-green-100"
      }
    }
  };

  if (!StatusMapping[status]) return null;

  const { iconProps, classNames } = StatusMapping[status];

  return (
    <div
      {...props}
      className={twMerge(
        "flex items-center gap-1.5 whitespace-nowrap rounded-xl py-0.5 pr-3 pl-1.5",
        classNames,
        className
      )}
    >
      <Icon {...iconProps} className={classnames(iconProps.classNames, "h-4 w-auto lg:h-5")} />
      {children}
    </div>
  );
};

export default StatusPill;
