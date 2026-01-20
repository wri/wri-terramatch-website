import { FC } from "react";

import { getThemedColor } from "@/lib/theme";
import Button from "@/redesignComponents/Forms/Actions/Button/Button";
import { CheckApproved, Edit, InformationRequired } from "@/redesignComponents/foundations/Icons";

import type { AccordionHeaderProps } from "./types";

const statusConfig = {
  success: {
    icon: <CheckApproved boxSize={4} color={getThemedColor("success", 500)} />,
    color: getThemedColor("success", 500)
  },
  error: {
    icon: <InformationRequired boxSize={4} color={getThemedColor("error", 500)} />,
    color: getThemedColor("error", 500)
  },
  default: {
    icon: null,
    color: getThemedColor("neutral", 500)
  }
};

const AccordionHeader: FC<AccordionHeaderProps> = ({ label, title, badge, status = "default", buttonProps }) => {
  const config = statusConfig[status];

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[16px] leading-[24px] text-[#1A1919]">{label}:</span>
          <span className="text-[20px] leading-[28px] text-[#032230]">{title}</span>
        </div>
        {badge && (
          <div className="rounded-full border bg-[#032230] px-2 py-1">
            <span className="font-inter flex text-[14px] font-bold leading-[20px] text-[#ffffff]">{badge}</span>
          </div>
        )}
      </div>
      {(config.icon ?? buttonProps) && (
        <div className="flex items-center gap-3">
          {config.icon}
          {buttonProps && (
            <Button
              variant="secondary"
              size="small"
              leftIcon={buttonProps.icon || <Edit boxSize={4} />}
              onClick={buttonProps.onClick}
              {...buttonProps}
            >
              {buttonProps.label || "Edit"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AccordionHeader;
