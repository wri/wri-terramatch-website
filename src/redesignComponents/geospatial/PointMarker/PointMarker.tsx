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
}

const BOX_SHADOW = "0px 1px 2px -1px rgba(0, 0, 0, 0.10), 0px 1px 3px 0px rgba(0, 0, 0, 0.10) !important";

const FOCUS_STATE_STYLES = {
  outline: "2px solid #50B6E2",
  borderRadius: "50%",
  scale: "1.25",
  outlineOffset: "0px !important",
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
  triggerRef
}) => {
  return (
    <Box
      css={{
        "& > div": showFocusState && FOCUS_STATE_STYLES,
        "& button": {
          ...(variant === "icon" ? { width: "40px", height: "40px" } : { fontWeight: "400" }),
          transition: "all 0.1s ease-in-out",
          boxShadow: BOX_SHADOW
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
