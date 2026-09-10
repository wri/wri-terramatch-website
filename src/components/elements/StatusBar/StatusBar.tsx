import { useT } from "@transifex/react";
import classnames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import StatusPill, { StatusPillStatus } from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

export interface StatusBarProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status?: string | null;
  description?: string;
  classNameStatusBar?: string;
}

const StatusBar = ({
  title,
  status,
  children,
  description = "",
  className,
  classNameStatusBar,
  ...props
}: StatusBarProps) => {
  const t = useT();

  const StatusMapping: Record<StatusPillStatus, { classNames: string; title: string }> = {
    edit: {
      classNames: "bg-neutral-200",
      title: t("Status: Draft")
    },
    draft: {
      classNames: "bg-theme-neutral-100",
      title: t("Status: Draft")
    },
    error: {
      classNames: "bg-error-200",
      title: t("Status: Rejected")
    },
    rejected: {
      classNames: "bg-theme-error-100",
      title: t("Status: Not Selected")
    },
    "not-selected": {
      classNames: "bg-theme-error-100",
      title: t("Status: Not Selected")
    },
    success: {
      classNames: "bg-secondary-200",
      title: t("Status: Approved")
    },
    approved: {
      classNames: "bg-theme-success-100",
      title: t("Status: Approved")
    },
    awaiting: {
      classNames: "bg-primary-200",
      title: t("Status: Awaiting Feedback")
    },
    "pending-approval": {
      classNames: "bg-theme-information-100",
      title: t("Status: Pending Approval")
    },
    warning: {
      classNames: "bg-tertiary-200",
      title: t("Status: Information Required")
    },
    "information-required": {
      classNames: "bg-theme-warning-100",
      title: t("Status: Information Required")
    },
    due: {
      classNames: "bg-theme-error-100",
      title: t("Status: Due")
    },
    "nothing-to-report": {
      classNames: "bg-theme-neutral-100",
      title: t("Status: Nothing Reported")
    },
    "nothing-reported": {
      classNames: "bg-theme-neutral-100",
      title: t("Status: Nothing Reported")
    },
    restoration: {
      classNames: "bg-green-30",
      title: t("Status: Restoration in Progress")
    }
  };

  const resolvedStatus: StatusPillStatus = (() => {
    const mapped = mapStatusToTagStateEntity(status)?.type;
    if (mapped != null && StatusMapping[mapped as StatusPillStatus] != null) {
      return mapped as StatusPillStatus;
    }
    if (status != null && status !== "" && StatusMapping[status as StatusPillStatus] != null) {
      return status as StatusPillStatus;
    }
    return "edit";
  })();
  const statusProps = StatusMapping[resolvedStatus];

  return (
    <div {...props} className={classnames(className, statusProps.classNames, "w-full")}>
      <div
        className={classnames(
          "mx-auto flex w-[82vw] items-center justify-between gap-3 p-3.5 px-10 xl:px-0 mobile:w-full",
          classNameStatusBar
        )}
      >
        <div className="flex flex-1 items-center">
          <StatusPill status={resolvedStatus} />
          <div>
            <Text variant="text-16-bold">{title || statusProps.title}</Text>
            <Text variant="text-16-light" className="line-clamp-3" title={description}>
              {description}
            </Text>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default StatusBar;
