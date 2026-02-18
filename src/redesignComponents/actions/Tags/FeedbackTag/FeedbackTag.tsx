import { useT } from "@transifex/react";
import { Tag } from "@worldresources/wri-design-systems";
import React from "react";

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

const FeedbackTag = ({
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
  );
};

export default FeedbackTag;
