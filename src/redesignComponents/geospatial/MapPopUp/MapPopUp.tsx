import { Box } from "@chakra-ui/react";
import { MapPopUp as WriMapPopup } from "@worldresources/wri-design-systems";
import { ComponentProps, FC } from "react";

const MapPopUp: FC<ComponentProps<typeof WriMapPopup>> = props => {
  return (
    <Box
      css={{
        "& [aria-modal='true'] > div:first-of-type": {
          minHeight: "2.5rem"
        },
        "& [aria-modal='true']": {
          width: "fit-content",
          maxWidth: "max-content"
        }
      }}
    >
      <WriMapPopup {...props} />
    </Box>
  );
};

export default MapPopUp;
