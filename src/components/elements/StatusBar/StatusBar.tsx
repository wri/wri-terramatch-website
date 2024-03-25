import { useT } from "@transifex/react";
import classnames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { Status } from "@/types/common";

export interface StatusPillProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status: Status;
  description?: string;
}

const StatusBar = ({ title, status, children, description = "", className, ...props }: StatusPillProps) => {
  const t = useT();

  // eslint-disable-next-line no-unused-vars
  const StatusMapping: { [key in Status]: any } = {
    edit: {
      classNames: "bg-neutral-200",
      title: t("Status: Draft")
    },
    error: {
      classNames: "bg-error-200",
      title: t("Status: Rejected")
    },
    success: {
      classNames: "bg-secondary-200",
      title: t("Status: Approved")
    },
    awaiting: {
      classNames: "bg-primary-200",
      title: t("Status: Awaiting Feedback")
    },
    warning: {
      classNames: "bg-tertiary-200",
      title: t("Status: More Info Requested")
    }
  };

  const statusProps = StatusMapping[status] || StatusMapping.edit;

  return (
    <div {...props} className={classnames(className, statusProps.classNames, "w-full")}>
      <div className="mx-auto flex w-[82vw] items-center justify-between gap-3 p-4 px-10 xl:px-0">
        <div className="flex flex-1 items-start">
          <StatusPill status={status} />
          <div>
            <Text variant="text-bold-subtitle-400">{title || statusProps.title}</Text>
            <Text variant="text-light-subtitle-400" className="line-clamp-3" title={description}>
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
