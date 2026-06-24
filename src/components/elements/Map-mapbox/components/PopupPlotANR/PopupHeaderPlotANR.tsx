import { Text } from "@chakra-ui/react";
import { type FC, memo } from "react";

type PopupHeaderPlotANRProps = {
  polygonName: string;
};

const PopupHeaderPlotANR: FC<PopupHeaderPlotANRProps> = ({ polygonName }) => {
  return (
    <Text textStyle="400-bold" color="neutral.900" width="max-content" maxW="14rem" lineClamp={1}>
      {polygonName}
    </Text>
  );
};

export default memo(PopupHeaderPlotANR);
