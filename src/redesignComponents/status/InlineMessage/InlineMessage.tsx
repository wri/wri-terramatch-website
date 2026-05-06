import { Box } from "@chakra-ui/react";
import { InlineMessage as InlineMessageComponent } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import { FC } from "react";
export interface InlineMessageProps {
  label: string;
  caption?: string;
  variant: "info-white" | "info-grey" | "success" | "warning" | "error";
  size?: "small" | "large" | "full-width";
  icon?: React.ReactNode;
  onActionClick?: VoidFunction;
  actionLabel?: string;
  isButtonRight?: boolean;
  buttonLeftIcon?: React.ReactNode;
  buttonRightIcon?: React.ReactNode;
  className?: string;
}

const BASE_CSS: Record<string, any> = {
  "& [aria-roledescription] > div > div:first-of-type": {
    alignItems: "center"
  },
  "& [aria-roledescription] > div > div:first-of-type > svg": {
    marginTop: 0
  },
  "& [aria-roledescription]": {
    columnGap: "0.5rem",
    marginBottom: "0 !important"
  },
  "& [aria-roledescription] > div > div:first-of-type > p": {
    maxWidth: "100%"
  },
  "& [aria-roledescription] > div > p": {
    maxWidth: "100%"
  },
  "& > div": {
    maxWidth: "100%",
    padding: "0.5rem 0.75rem"
  }
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
  return (
    <Box className={classNames("w-auto", className)} css={BASE_CSS}>
      <InlineMessageComponent
        label={label ?? ""}
        variant={variant}
        caption={caption}
        size={size}
        icon={icon}
        onActionClick={onActionClick}
        actionLabel={actionLabel}
        isButtonRight={isButtonRight}
      />
    </Box>
  );
};

export default InlineMessage;
