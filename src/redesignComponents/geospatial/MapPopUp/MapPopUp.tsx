import { Box } from "@chakra-ui/react";
import { MapPopUp as WriMapPopup } from "@worldresources/wri-design-systems";
import { ComponentProps, FC } from "react";

const MapPopUp: FC<ComponentProps<typeof WriMapPopup>> = props => {
  return (
    <Box
      className="map-popup-wri"
      css={{
        "& [aria-modal='true']": {
          width: "fit-content",
          maxWidth: "max-content",
          zIndex: 1000,
          pointerEvents: "auto"
        },
        "& > div:nth-of-type(2)": {
          background: "transparent",
          pointerEvents: "none",
          backdropFilter: "none"
        }
      }}
    >
      <WriMapPopup {...props} />
    </Box>
  );
};

export default MapPopUp;
