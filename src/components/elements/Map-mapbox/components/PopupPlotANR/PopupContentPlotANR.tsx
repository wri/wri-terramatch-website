import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, memo } from "react";

type PopupContentPlotANRProps = {
  plotId: number;
};

const PopupContentPlotANR: FC<PopupContentPlotANRProps> = ({ plotId }) => {
  const t = useT();

  return (
    <Flex padding="0.75rem" gap={2} maxWidth="17rem" cursor="default" width="100%" justifyContent="space-between">
      <Text color="neutral.700" textStyle="400">
        {t("Plot ID")}:
      </Text>
      <Text color="neutral.900" textStyle="400-bold">
        {plotId}
      </Text>
    </Flex>
  );
};

export default memo(PopupContentPlotANR);
