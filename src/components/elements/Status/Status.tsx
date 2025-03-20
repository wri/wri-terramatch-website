import { useT } from "@transifex/react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

import Text from "../Text/Text";
import { COLOR_BG_MAP } from "./constants/colorBgMap";
import { COLOR_TEXT_MAP } from "./constants/colorTextMap";
import { StatusEnum } from "./constants/statusMap";

export interface StatusProps {
  className?: string;
  status: StatusEnum;
  textVariant?: TextVariants;
  variant?: "default" | "small";
}

const Status = (props: StatusProps) => {
  const t = useT();

  const { className, status, textVariant = "text-12-semibold", variant = "default" } = props;

  const convertStatusToReadableStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      approved: t("Approved"),
      submitted: t("Submitted"),
      draft: t("Draft"),
      started: t("Started"),
      "under-review": t("Under Review"),
      "needs-more-information": t("Needs More Information"),
      "restoration-in-progress": t("Restoration in Progress"),
      "awaiting-approval": t("Awaiting Approval")
    };

    const statusMapSmall: { [key: string]: string } = {
      approved: t("Approved"),
      submitted: t("Submitted"),
      draft: t("Draft"),
      started: t("Started"),
      "under-review": t("Under Review"),
      "needs-more-information": t("Needs Info"),
      "restoration-in-progress": t("Restoration in Progress"),
      "awaiting-approval": t("Awaiting Approval")
    };

    return variant == "small" ? statusMapSmall[status] ?? "" : statusMap[status] ?? "";
  };

  return (
    <div className={tw("flex items-center justify-center rounded-xl py-1 px-[6px]", COLOR_BG_MAP[status], className)}>
      <Text
        variant={textVariant}
        className={`flex w-fit items-center justify-center gap-[6px] text-center ${COLOR_TEXT_MAP[status]}`}
      >
        <When condition={status === "approved"}>
          <div className="h-4 w-4">
            <Icon name={IconNames.CHECK_CIRCLE_FILL} className="h-4 w-4 text-secondary" />
          </div>
        </When>
        {convertStatusToReadableStatus(status)}
      </Text>
    </div>
  );
};

export default Status;
