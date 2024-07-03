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
}

const Status = (props: StatusProps) => {
  const { className, status, textVariant = "text-12-semibold" } = props;

  const convertStatusToReadableStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      approved: "Approved",
      submitted: "Submitted",
      draft: "Draft",
      started: "Started",
      "under-review": "Under Review",
      "needs-more-information": "Needs More Information",
      "restoration-in-progress": "Restoration in Progress",
      "awaiting-approval": "Awaiting Approval"
    };

    return statusMap[status] ?? "";
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
