import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, memo, useCallback } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

type PopupFooterPlotANRProps = {
  onCancel: () => void;
};

const PopupFooterPlotANR: FC<PopupFooterPlotANRProps> = ({ onCancel }) => {
  const t = useT();

  const handleCancel = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onCancel();
    },
    [onCancel]
  );

  return (
    <Flex justifyContent="space-between" gap={0} width="100%" wrap="wrap">
      <Button variant="secondary" size="small" onClick={handleCancel} classNameContainer="w-fit">
        {t("Cancel")}
      </Button>
    </Flex>
  );
};

export default memo(PopupFooterPlotANR);
