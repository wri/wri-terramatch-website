import { Box } from "@chakra-ui/react";
import { MapMarker } from "@worldresources/wri-design-systems";
import { FC } from "react";

export interface MapMarkerProps {
  ariaLabel?: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  onClick?: () => void;
  showFocusState?: boolean;
  count?: number;
  mode?: "dark" | "light";
  variant?: "cluster" | "simple-pin" | "icon";
  triggerRef?: React.RefObject<HTMLButtonElement>;
  color?: string;
}

const BOX_SHADOW =
  "0rem 0.0625rem 0.125rem -0.0625rem rgba(0, 0, 0, 0.10), 0rem 0.0625rem 0.1875rem 0rem rgba(0, 0, 0, 0.10) !important";

const FOCUS_STATE_STYLES = {
  outline: "0.125rem solid #50B6E2",
  borderRadius: "50%",
  scale: "1.25",
  outlineOffset: "0rem !important",
  "& button:hover": { scale: "1 !important" }
};

const PointMarker: FC<MapMarkerProps> = ({
  ariaLabel,
  icon,
  backgroundColor,
  onClick,
  showFocusState,
  count,
  mode,
  variant,
  triggerRef,
  color = "primary.500"
}) => {
  return (
    <Box
      css={{
        "& > div": showFocusState && FOCUS_STATE_STYLES,
        "& button": {
          ...(variant === "icon" ? { width: "2.5rem", height: "2.5rem" } : { fontWeight: "400" }),
          transition: "all 0.1s ease-in-out",
          boxShadow: BOX_SHADOW,
          ...(variant === "simple-pin" && {
            width: "1rem",
            height: "1rem",
            borderColor: "neutral.100",
            backgroundColor: color
          })
        },
        "& button::after": {
          display: "none"
        },
        "& button:hover": { scale: 1.25 }
      }}
    >
      <MapMarker
        ariaLabel={ariaLabel}
        icon={icon}
        backgroundColor={backgroundColor}
        onClick={onClick}
        showFocusState={showFocusState}
        count={count}
        mode={mode}
        variant={variant}
        ref={triggerRef}
      />
    </Box>
  );
};

export default PointMarker;
