import { Box } from "@chakra-ui/react";
import {
  type AlertProps as WriAlertBannerProps,
  AlertBanner as WriAlertBanner
} from "@worldresources/wri-design-systems";

export interface AlertBannerProps extends WriAlertBannerProps {
  className?: string;
  width?: "full-width" | "inline";
}

const INFORMATION_STYLES = {
  "& > .chakra-alert__root": {
    backgroundColor: "information.100",
    borderBottomColor: "information.300",
    color: "information.900",
    "& > span > svg": {
      color: "information.500"
    }
  }
};

const AlertBanner = ({ className, ...props }: AlertBannerProps) => {
  return (
    <Box className={className} css={props.variant === "information" ? INFORMATION_STYLES : undefined}>
      <WriAlertBanner width={props.width} {...props} />
    </Box>
  );
};

export default AlertBanner;
