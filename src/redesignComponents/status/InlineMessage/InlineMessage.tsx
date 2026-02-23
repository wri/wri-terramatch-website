import { Box } from "@chakra-ui/react";
import { InlineMessage as InlineMessageComponent } from "@worldresources/wri-design-systems";
import { FC } from "react";

export interface InlineMessageProps {
  label?: string;
  caption?: string;
  variant: "info-white" | "info-grey" | "success" | "warning" | "error";
  size?: "small" | "large";
  icon?: React.ReactNode;
  onActionClick?: VoidFunction;
  actionLabel?: string;
  isButtonRight?: boolean;
  widthFull?: boolean;
}

const InlineMessage: FC<InlineMessageProps> = ({
  label,
  variant,
  caption,
  size,
  icon,
  onActionClick,
  actionLabel,
  isButtonRight,
  widthFull
}) => {
  return (
    <Box
      width={widthFull ? "100%" : undefined}
      css={{
        "& > *": {
          width: widthFull ? "100%" : undefined,
          maxWidth: widthFull ? "100%" : undefined
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
