import { Box } from "@chakra-ui/react";
import { MapPopUp as WriMapPopup } from "@worldresources/wri-design-systems";
import { ComponentProps, FC } from "react";

const MapPopUp: FC<ComponentProps<typeof WriMapPopup>> = props => {
  return (
    <Box>
      <WriMapPopup {...props} />
    </Box>
  );
};

export default MapPopUp;
