import classnames from "classnames";
import Link from "next/link";

import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { Status } from "@/types/common";

import Icon, { IconNames } from "../Icon/Icon";

export interface ActionTrackerCardRowProps {
  title: string;
  subtitle: string;
  status: Status;
  statusText: string;
  ctaText: string;
  ctaLink: string;
  updatedAt?: string;
  updatedBy?: string;
  className?: string;
  onClick?: () => {};
}

const ActionTrackerCardRow = ({
  title,
  subtitle,
  className,
  status,
  statusText,
  ctaLink,
  ctaText,
  onClick,
  updatedAt,
  updatedBy
}: ActionTrackerCardRowProps) => (
  <Link
    href={ctaLink!}
    title={title}
    className={classnames("group flex cursor-pointer flex-col  rounded-md p-0 shadow", className)}
    onClick={onClick}
  >
    <div className="mx-3 mb-2 mt-3 wide:mx-6 wide:mt-6 wide:mb-5">
      <div className="mb-1 flex items-start gap-3">
        <Text variant="text-body-500" className="flex-1">
          {title}
        </Text>
        <StatusPill status={status}>
          <Text variant="text-bold-caption-100">{statusText}</Text>
        </StatusPill>
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
    <div className="flex w-full items-center justify-between rounded-b-md bg-primary-200 p-3 group-hover:bg-primary-400 group-hover:text-white wide:p-6">
      <Text variant="text-button-700" className="group-hover:text-white">
        {ctaText}
      </Text>
      <Icon name={IconNames.CHEVRON_RIGHT_SMALL} className="h-5 w-5" />
    </div>
  </Link>
);

export default ActionTrackerCardRow;
