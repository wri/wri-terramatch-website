import { Box } from "@chakra-ui/react";
import {
  InlineMessage as InlineMessageComponent,
  InlineMessageProps as InlineMessageComponentProps
} from "@worldresources/wri-design-systems";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
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
    alignItems: "center"
  },
  "& > div > div > div > svg": {
    marginTop: "0"
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
    <Box className={twMerge("w-auto", className)} css={BASE_CSS}>
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
