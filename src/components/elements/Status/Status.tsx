import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

import Text from "../Text/Text";

export interface StatusProps {
  className?: string;
  status:
    | "draft"
    | "submitted"
    | "approved"
    | "under-review"
    | "needs-more-information"
    | "planting-in-progress"
    | "awaiting-approval";
  textVariant?: TextVariants;
}

const Status = (props: StatusProps) => {
  const { className, status, textVariant = "text-12-semibold" } = props;

  const convertStatusToReadableStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      approved: "Approved",
      submitted: "Submitted",
      draft: "Draft",
      "under-review": "Under Review",
      "needs-more-information": "Needs More Information",
      "planting-in-progress": "Planting in Progress",
      "awaiting-approval": "Awaiting Approval"
    };

    return statusMap[status] || "";
  };

  const getColorStatusText = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      approved: "text-green-500",
      submitted: "text-blue",
      draft: "text-pinkCustom",
      "under-review": "text-tertiary-600",
      "needs-more-information": "text-tertiary-600",
      "planting-in-progress": "text-blue",
      "awaiting-approval": "text-tertiary-600"
    };

    return colorMap[status] || "";
  };

  const getColorStatusBg = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      approved: "bg-secondary-200",
      submitted: "bg-blue-200",
      draft: "bg-pinkCustom-200",
      "under-review": "bg-tertiary-50",
      "awaiting-approval": "bg-tertiary-50",
      "needs-more-information": "bg-tertiary-50",
      "planting-in-progress": "bg-blue-200"
    };

    return colorMap[status] || "";
  };

  return (
    <div
      className={tw("flex items-center justify-center rounded-xl py-1 px-[6px]", getColorStatusBg(status), className)}
    >
      <Text
        variant={textVariant}
        className={`flex w-fit items-center justify-center gap-[6px] text-center ${getColorStatusText(status)}`}
      >
        <When condition={status === "approved"}>
          <Icon name={IconNames.CHECK_CIRCLE_FILL} className="h-4 w-4 text-secondary" />
        </When>
        {convertStatusToReadableStatus(status)}
      </Text>
    </div>
  );
};

export default Status;
