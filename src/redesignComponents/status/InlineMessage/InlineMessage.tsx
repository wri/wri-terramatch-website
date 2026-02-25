import { Box } from "@chakra-ui/react";
import { InlineMessage as InlineMessageComponent } from "@worldresources/wri-design-systems";
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
}

const InlineMessage: FC<InlineMessageProps> = ({
  label,
  variant,
  caption,
  size,
  icon,
  onActionClick,
  actionLabel,
  isButtonRight
}) => {
  return (
    <Box
      className="w-auto"
      css={{
        "& [aria-roledescription] > div > div:first-of-type": {
          alignItems: "center"
        },
        "& [aria-roledescription] > div > div:first-of-type > svg": {
          marginTop: 0
        }
      }}
    >
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
