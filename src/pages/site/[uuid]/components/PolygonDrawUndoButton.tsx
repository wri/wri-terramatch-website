import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import UndoIcon from "@/redesignComponents/foundations/Icons/Function/UndoIcon";

type PolygonDrawUndoButtonProps = {
  onClick: () => void;
};

/** Floating Undo button centred on the full-screen map while a new polygon is being drawn. */
const PolygonDrawUndoButton: FC<PolygonDrawUndoButtonProps> = ({ onClick }) => {
  const t = useT();

  return (
    <Button
      variant="secondary"
      leftIcon={<UndoIcon />}
      className="fixed bottom-2 left-[calc(32rem+(100vw-32rem)/2)] z-[38] -translate-x-1/2"
      onClick={onClick}
    >
      {t("Undo")}
    </Button>
  );
};

export default PolygonDrawUndoButton;
