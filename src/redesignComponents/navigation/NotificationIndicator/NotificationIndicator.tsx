import { Box } from "@chakra-ui/react";
import React, { FC } from "react";

interface NotificationIndicatorProps {
  children: React.ReactNode;
  variant?: "alert" | "neutral";
  bgColor?: string;
}

const NotificationIndicator: FC<NotificationIndicatorProps> = ({ children, variant = "neutral", bgColor }) => {
  const BG_COLOR_MAP: Record<"alert" | "neutral", string> = {
    alert: "error.500",
    neutral: "primary.900"
  };

  return (
    <Box
      rounded="full"
      minWidth={5}
      bgColor={bgColor ?? BG_COLOR_MAP[variant]}
      textStyle="300-bold"
      color="neutral.100"
    >
      {children}
    </Box>
  );
};

export default NotificationIndicator;
