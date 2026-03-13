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
}

const PointMarker: FC<MapMarkerProps> = ({
  ariaLabel,
  icon,
  backgroundColor,
  onClick,
  showFocusState,
  count,
  mode,
  variant
}) => {
  return (
    <Box
      css={
        variant === "icon"
          ? {
              "& button": {
                width: "40px",
                height: "40px"
              }
            }
          : {
              "& button": {
                fontWeight: "400"
              }
            }
      }
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
      />
    </Box>
  );
};

export default PointMarker;
