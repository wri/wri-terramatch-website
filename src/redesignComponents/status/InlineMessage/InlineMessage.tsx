import { Box } from "@chakra-ui/react";
import {
  InlineMessage as InlineMessageComponent,
  InlineMessageProps as InlineMessageComponentProps
} from "@worldresources/wri-design-systems";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { CheckApprovedIcon, WarningIcon } from "@/redesignComponents/foundations/Icons";

export interface InlineMessageProps extends InlineMessageComponentProps {
  className?: string;
}

const BASE_CSS: Record<string, any> = {
  "& [aria-roledescription] > div > div:first-of-type > p": {
    maxWidth: "100%"
  },
  "& [aria-roledescription] > div > p": {
    maxWidth: "100%"
  },
  "& > div": {
    maxWidth: "100%"
  },
  "& > div > div > div": {
    alignItems: "baseline"
  },
  "& > div > div > div > svg": {
    marginTop: "0"
  }
};

const getDefaultIcon = (variant: InlineMessageComponentProps["variant"]): ReactNode => {
  if (variant === "warning") {
    return <WarningIcon />;
  }
  if (variant === "success") {
    return <CheckApprovedIcon />;
  }
  return undefined;
};

const InlineMessage: FC<InlineMessageProps> = ({
  label,
  variant,
  caption,
  size,
  icon,
  onActionClick,
  actionLabel,
  isButtonRight,
  className
}) => {
  const resolvedIcon = icon ?? getDefaultIcon(variant);

  return (
    <Box className={twMerge("w-auto", className)} css={BASE_CSS}>
      <InlineMessageComponent
        label={label ?? ""}
        variant={variant}
        caption={caption}
        size={size}
        icon={resolvedIcon}
        onActionClick={onActionClick}
        actionLabel={actionLabel}
        isButtonRight={isButtonRight}
      />
    </Box>
  );
};

export default InlineMessage;
