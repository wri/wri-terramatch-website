import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import UndoIcon from "@/redesignComponents/foundations/Icons/Function/UndoIcon";

type PolygonDrawUndoButtonProps = {
  onUndo: () => void;
};

const PolygonDrawUndoButton: FC<PolygonDrawUndoButtonProps> = ({ onUndo }) => {
  const t = useT();

  return (
    <Button
      variant="secondary"
      leftIcon={<UndoIcon />}
      className="fixed bottom-2 left-[calc(32rem+(100vw-32rem)/2)] z-[38] -translate-x-1/2"
      onClick={onUndo}
    >
      {t("Undo")}
    </Button>
  );
};

export default PolygonDrawUndoButton;
