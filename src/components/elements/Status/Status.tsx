import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

import Text from "../Text/Text";

export interface StatusProps {
  className?: string;
  status: "Draft" | "Submitted" | "Approved" | "Under Review" | "Needs More Info" | "Planting in Progress";
  textVariant?: TextVariants;
}

const Status = (props: StatusProps) => {
  const { className, status, textVariant = "text-12-semibold" } = props;

  const getColorStatusText = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      Approved: "text-green-500",
      Submitted: "text-blue",
      Draft: "text-purple",
      "Under Review": "text-tertiary-600",
      "Needs More Info": "text-tertiary-600",
      "Planting in Progress": "text-blue"
    };

    return colorMap[status] || "";
  };

  const getColorStatusBg = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      Approved: "bg-secondary-200",
      Submitted: "bg-blue-200",
      Draft: "bg-purple-200",
      "Under Review": "bg-tertiary-50",
      "Needs More Info": "bg-tertiary-50",
      "Planting in Progress": "bg-blue-200"
    };

    return colorMap[status] || "";
  };

  return (
    <div
      className={tw("flex items-center justify-center rounded-xl py-1 px-[6px]", getColorStatusBg(status), className)}
    >
      <Text
        variant={textVariant}
        className={`flex w-fit items-center gap-[6px] whitespace-nowrap ${getColorStatusText(status)}`}
      >
        <When condition={status === "Approved"}>
          <Icon name={IconNames.CHECK_CIRCLE_FILL} className="h-4 w-4 text-secondary" />
        </When>
        {status}
      </Text>
    </div>
  );
};

export default Status;
