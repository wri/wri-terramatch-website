import classnames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export type PillStatus = "edit" | "error" | "success" | "awaiting" | "warning";

export interface StatusPillProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status: PillStatus;
}

const StatusPill = ({ status, children, className, ...props }: StatusPillProps) => {
  // eslint-disable-next-line no-unused-vars
  const StatusMapper: { [key in PillStatus]: any } = {
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
        name: IconNames.CROSS,
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
    }
  };

  if (!StatusMapper[status]) return null;

  const { iconProps, classNames } = StatusMapper[status];

  return (
    <div
      {...props}
      className={classnames(className, classNames, "flex items-center gap-1.5 rounded-xl py-0.5 pr-3 pl-1.5")}
    >
      <Icon {...iconProps} className={classnames(iconProps.classNames, "h-4 w-auto")} />
      {children}
    </div>
  );
};

export default StatusPill;
