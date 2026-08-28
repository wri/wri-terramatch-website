import classnames from "classnames";
import Link from "next/link";

import StatusTag from "@/components/elements/StatusTag/StatusTag";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";

export interface ActionTrackerCardRowProps {
  title: string;
  subtitle: string;
  status?: string | null;
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
  ctaLink,
  ctaText,
  onClick,
  updatedAt,
  updatedBy
}: ActionTrackerCardRowProps) => {
  return (
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
          <StatusTag status={status} size="small" />
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
};

export default ActionTrackerCardRow;
