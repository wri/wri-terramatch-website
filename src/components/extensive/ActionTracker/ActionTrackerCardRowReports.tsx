import { useT } from "@transifex/react";
import classnames from "classnames";

import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { Status as PillStatuses } from "@/types/common";

export interface ActionTrackerCardRowProps {
  title: string;
  subtitle: string;
  status: StatusEnum;
  statusText: string;
  updatedAt?: string;
  updatedBy?: string;
  className?: string;
}

const STATUS_PILL_STATUSES = ["edit", "error", "success", "awaiting", "warning", "restoration"] as const;

const ActionTrackerCardRow = ({
  title,
  subtitle,
  className,
  status,
  statusText,
  updatedAt,
  updatedBy
}: ActionTrackerCardRowProps) => {
  const t = useT();
  return (
    <div title={title} className={classnames(`group flex flex-col  rounded-md p-0 shadow`, className)}>
      <div className="mx-3 mb-2 mt-3 wide:mx-6 wide:mt-6 wide:mb-5">
        <div className="mb-1 flex items-start gap-3">
          <Text variant="text-body-500" className="flex-1">
            {title}
          </Text>
          {STATUS_PILL_STATUSES.includes(status as (typeof STATUS_PILL_STATUSES)[number]) ? (
            <StatusPill status={status as PillStatuses}>
              <Text variant="text-bold-caption-100">{t(statusText)}</Text>
            </StatusPill>
          ) : (
            <Status
              status={status}
              variant="small"
              className={classnames("w-fit", {
                "bg-darkCustom-100/10": status === "draft"
              })}
              classNameText={classnames({
                "text-grey-500": status === "draft"
              })}
            />
          )}
        </div>
        <Text variant="text-body-300" containHtml>
          {subtitle}
        </Text>
        <Text variant="text-body-300" containHtml>
          {updatedAt}
        </Text>
        <Text variant="text-body-300" containHtml>
          {updatedBy}
        </Text>
      </div>
    </div>
  );
};

export default ActionTrackerCardRow;
