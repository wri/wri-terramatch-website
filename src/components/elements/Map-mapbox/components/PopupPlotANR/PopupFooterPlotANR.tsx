import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, memo, useCallback } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

type PopupFooterPlotANRProps = {
  onClose: () => void;
};

const PopupFooterPlotANR: FC<PopupFooterPlotANRProps> = ({ onClose }) => {
  const t = useT();

  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClose();
    },
    [onClose]
  );

  return (
    <Flex justifyContent="space-between" gap={0} width="100%" wrap="wrap">
      <Button variant="secondary" size="small" onClick={handleClose} classNameContainer="w-fit">
        {t("Close")}
      </Button>
    </Flex>
  );
};

export default memo(PopupFooterPlotANR);
