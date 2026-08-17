import { useT } from "@transifex/react";
import classNames from "classnames";
import Link from "next/link";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Button from "@/components/elements/Button/Button";
import StatusTag from "@/components/elements/StatusTag/StatusTag";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames, IconProps } from "@/components/extensive/Icon/Icon";
import { useDate } from "@/hooks/useDate";

export type FundingStatus = "inactive" | "active" | "disabled" | "coming-soon";
export interface FundingCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  description: string;
  status: FundingStatus;
  deadline?: string;
  location?: string;
  primaryLink: string;
  secondaryLink: string;
}

const FundingCard = (props: FundingCardProps) => {
  const { title, status, deadline, location, description, primaryLink, secondaryLink, className, ...rest } = props;
  const t = useT();
  const { format } = useDate();

  return (
    <div
      {...rest}
      className={classNames(
        className,
        "flex h-[420px] w-full flex-col overflow-auto rounded-lg border border-neutral-100 border-opacity-25 bg-white p-6 shadow wide:h-[500px]"
      )}
    >
      {status === "disabled" ? null : <StatusTag status={status} className="mb-4" />}
      <Text variant="text-bold-subtitle-500" className="mb-2">
        {title}
      </Text>
      {deadline == null ? null : (
        <CardItem
          iconProps={{
            name: IconNames.CALENDAR,
            width: 16,
            className: "fill-neutral-900 wide:min-h-[20px] wide:min-w-[20px] "
          }}
          title={t("Deadline") + ":"}
          subtitle={format(Date.parse(deadline), "do MMMM y, HH:mm")}
        />
      )}
      {location == null ? null : (
        <CardItem
          iconProps={{
            name: IconNames.MAP_PIN,
            width: 13,
            height: 18,
            className: "fill-neutral-900 min-w-[13px] min-h-[18px] wide:min-w-[17px] wide:min-h-[22px]"
          }}
          title={t("Location") + ":"}
          subtitle={location}
        />
      )}
      <Text variant="text-light-caption-200" className="mt-3 flex-1 line-clamp-5">
        {description}
      </Text>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          as={Link}
          variant="white"
          className="w-full flex-1"
          href={secondaryLink}
          disabled={secondaryLink == null || secondaryLink === ""}
          target="_blank"
        >
          {t("Read More")}
        </Button>
        <Button
          as={Link}
          variant={status === "active" ? "sky" : "secondary-blue"}
          className="w-full flex-1"
          href={primaryLink}
          disabled={primaryLink === "" || status === "inactive" || status === "disabled" || status === "coming-soon"}
        >
          {t("Apply Now")}
        </Button>
      </div>
    </div>
  );
};

interface CardItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  iconProps: IconProps;
  title: string;
  subtitle: string;
}

const CardItem = ({ iconProps, title, subtitle, className, ...props }: CardItemProps) => {
  return (
    <div {...props} className={classNames(className, "flex items-center gap-2 py-2")}>
      <Icon {...iconProps} />
      <Text variant="text-bold-caption-200">{title}</Text>
      <Text variant="text-light-caption-200" className="max-h-10 overflow-hidden">
        {subtitle}
      </Text>
    </div>
  );
};

export default FundingCard;
