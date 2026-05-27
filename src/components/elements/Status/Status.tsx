import { useT } from "@transifex/react";
import { FC } from "react";
import { twMerge as tw } from "tailwind-merge";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

import Text from "../Text/Text";
import { COLOR_BG_MAP } from "./constants/colorBgMap";
import { COLOR_TEXT_MAP } from "./constants/colorTextMap";
import { StatusEnum } from "./constants/statusMap";

type StatusProps = {
  className?: string;
  status: StatusEnum;
  textVariant?: TextVariants;
  variant?: "default" | "small";
  classNameText?: string;
};

const convertStatusToReadableStatus = (t: typeof useT, variant: "default" | "small", status: string): string => {
  const statusMap: { [key: string]: string } = {
    approved: t("Approved"),
    submitted: t("Submitted"),
    "pending-approval": t("Pending Approval"),
    draft: t("Draft"),
    started: t("Started"),
    "under-review": t("Under Review"),
    "needs-more-information": t("Needs More Information"),
    "information-required": t("Information Required"),
    "awaiting-approval": t("Awaiting Approval")
  };

  const statusMapSmall: { [key: string]: string } = {
    approved: t("Approved"),
    submitted: t("Submitted"),
    "pending-approval": t("Pending Approval"),
    draft: t("Draft"),
    started: t("Started"),
    "under-review": t("Under Review"),
    "needs-more-information": t("Needs Info"),
    "information-required": t("Info Required"),
    "awaiting-approval": t("Awaiting Approval")
  };

  return variant == "small" ? statusMapSmall[status] ?? "" : statusMap[status] ?? "";
};

const Status: FC<StatusProps> = ({
  className,
  status,
  textVariant = "text-12-semibold",
  variant = "default",
  classNameText
}) => {
  const t = useT();
  return (
    <div className={tw("flex items-center justify-center rounded-xl py-1 px-[6px]", COLOR_BG_MAP[status], className)}>
      <Text
        variant={textVariant}
        className={tw(
          "flex w-fit items-center justify-center gap-[6px] text-center",
          COLOR_TEXT_MAP[status],
          classNameText
        )}
      >
        {status === "approved" && (
          <div className="h-4 w-4">
            <Icon name={IconNames.CHECK_CIRCLE_FILL} className="h-4 w-4 text-secondary" />
          </div>
        )}
        {convertStatusToReadableStatus(t, variant, status)}
      </Text>
    </div>
  );
};

export default Status;
