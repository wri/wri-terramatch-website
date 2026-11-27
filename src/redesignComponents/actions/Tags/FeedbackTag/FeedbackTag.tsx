import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { getThemedBorderWidth, getThemedRadius, Tag } from "@worldresources/wri-design-systems";
import React, { FC } from "react";

import { getThemedColor } from "@/lib/theme";

const DISABLED_BORDER_COLOR = getThemedColor("neutral", 400);

const BORDER_COLOR_BY_TYPE: Record<FeedbackTagProps["type"], string> = {
  "info-white": getThemedColor("neutral", 300),
  "info-grey": getThemedColor("neutral", 400),
  success: getThemedColor("success", 300),
  warning: getThemedColor("warning", 300),
  error: getThemedColor("error", 300)
};

export type FeedbackTagProps = {
  type: "info-white" | "info-grey" | "success" | "warning" | "error";
  disabled?: boolean;
  className?: string;
  label: string;
  size?: "small" | "default" | "large";
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
};

const FeedbackTag: FC<FeedbackTagProps> = ({
  type,
  disabled = false,
  className,
  label,
  size = "default",
  icon,
  closable = false,
  onClose
}: FeedbackTagProps) => {
  const t = useT();

  return (
    <Box
      css={{
        "& span": {
          fontWeight: "bold",
          fontSize: size === "small" ? "0.625rem" : size === "default" ? "0.75rem" : "1rem",
          lineHeight: size === "small" ? "1rem" : size === "default" ? "1.25rem" : "1.5rem"
        },
        "& svg": {
          size: size === "small" ? 8 : size === "default" ? 10 : 12
        },
        "& .chakra-tag__startElement": {
          width: "auto !important"
        },
        "& .chakra-tag__root": {
          borderRadius: getThemedRadius(300),
          ...(size === "default" && {
            border: `${getThemedBorderWidth(100)} solid ${
              disabled ? DISABLED_BORDER_COLOR : BORDER_COLOR_BY_TYPE[type]
            } !important`
          })
        }
      }}
    >
      <Tag
        label={t(label)}
        onClick={() => {}}
        variant={type}
        disabled={disabled}
        className={className}
        size={size}
        icon={icon}
        closable={closable}
        onClose={onClose}
      />
    </Box>
  );
};

export default FeedbackTag;
