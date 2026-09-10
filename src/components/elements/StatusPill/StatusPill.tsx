import classnames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { Status } from "@/types/common";

export type StatusPillStatus =
  | Status
  | "due"
  | "draft"
  | "pending-approval"
  | "information-required"
  | "approved"
  | "nothing-to-report"
  | "nothing-reported"
  | "not-selected"
  | "rejected";

export interface StatusPillProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status: StatusPillStatus;
}

type StatusPillStyle = {
  classNames: string;
  iconProps: { name: IconNames; classNames: string };
};

const StatusMapping: Record<StatusPillStatus, StatusPillStyle> = {
  edit: {
    classNames: "bg-neutral-200",
    iconProps: {
      name: IconNames.EDIT_CIRCLE,
      classNames: "fill-neutral-800"
    }
  },
  draft: {
    classNames: "bg-theme-neutral-100",
    iconProps: {
      name: IconNames.EDIT_CIRCLE,
      classNames: "fill-theme-neutral-600"
    }
  },
  error: {
    classNames: "bg-error-200",
    iconProps: {
      name: IconNames.CROSS_CIRCLE,
      classNames: "fill-error"
    }
  },
  rejected: {
    classNames: "bg-theme-error-100",
    iconProps: {
      name: IconNames.CROSS_CIRCLE,
      classNames: "fill-theme-error-500"
    }
  },
  "not-selected": {
    classNames: "bg-theme-error-100",
    iconProps: {
      name: IconNames.CROSS_CIRCLE,
      classNames: "fill-theme-error-500"
    }
  },
  success: {
    classNames: "bg-secondary-200",
    iconProps: {
      name: IconNames.CHECK_CIRCLE_FILL,
      classNames: "fill-secondary"
    }
  },
  approved: {
    classNames: "bg-theme-success-100",
    iconProps: {
      name: IconNames.CHECK_CIRCLE_FILL,
      classNames: "fill-theme-success-500"
    }
  },
  awaiting: {
    classNames: "bg-primary-200",
    iconProps: {
      name: IconNames.CLOCK,
      classNames: "fill-primary"
    }
  },
  "pending-approval": {
    classNames: "bg-theme-information-100",
    iconProps: {
      name: IconNames.CLOCK,
      classNames: "fill-theme-information-500"
    }
  },
  warning: {
    classNames: "bg-tertiary-200",
    iconProps: {
      name: IconNames.WARNING,
      classNames: "fill-tertiary"
    }
  },
  "information-required": {
    classNames: "bg-theme-warning-100",
    iconProps: {
      name: IconNames.WARNING,
      classNames: "fill-theme-warning-500"
    }
  },
  due: {
    classNames: "bg-theme-error-100",
    iconProps: {
      name: IconNames.CLOCK,
      classNames: "fill-theme-error-500"
    }
  },
  "nothing-to-report": {
    classNames: "bg-theme-neutral-100",
    iconProps: {
      name: IconNames.EXCLAMATION_CIRCLE,
      classNames: "fill-theme-neutral-900"
    }
  },
  "nothing-reported": {
    classNames: "bg-theme-neutral-100",
    iconProps: {
      name: IconNames.EXCLAMATION_CIRCLE,
      classNames: "fill-theme-neutral-900"
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

const StatusPill = ({ status, children, className, ...props }: StatusPillProps) => {
  if (StatusMapping[status] == null) return null;

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
