import classnames from "classnames";
import Link from "next/link";

import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";

export interface ActionTrackerCardRowProps {
  title: string;
  subtitle: string;
  status: StatusEnum;
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
    className={classnames("group flex cursor-pointer flex-col rounded-xl p-0 shadow", className)}
    onClick={onClick}
  >
    <div className="mx-4 my-4 wide:mx-6 wide:mt-6 wide:mb-5">
      <div className="flex items-start gap-3">
        <Text variant="text-14-bold" className="flex-1">
          {title}
        </Text>
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
      </div>
      <Text variant="text-14-light" containHtml className="mb-2">
        {subtitle}
      </Text>
      <Text variant="text-14-light">Due: {updatedAt}</Text>
    </div>
    <div className="flex w-full items-center justify-between rounded-b-md bg-primary-200 p-3 group-hover:bg-primary-400 group-hover:text-white wide:p-6">
      <Text variant="text-14-bold" className="text-primary group-hover:text-white">
        {ctaText}
      </Text>
      <Icon name={IconNames.CHEVRON_RIGHT_SMALL} className="h-6 w-6 text-primary group-hover:text-white" />
    </div>
  </Link>
);

export default ActionTrackerCardRow;
