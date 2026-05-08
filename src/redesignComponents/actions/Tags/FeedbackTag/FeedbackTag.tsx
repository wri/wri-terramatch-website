import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Tag } from "@worldresources/wri-design-systems";
import React, { FC } from "react";

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
