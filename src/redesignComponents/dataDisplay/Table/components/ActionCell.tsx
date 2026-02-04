import { Box } from "@chakra-ui/react";
import { FC } from "react";

import Button, { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import { MoreVert } from "@/redesignComponents/foundations/Icons";

interface ActionCellProps {
  button: IButtonProps;
  onButtonIconClick: () => void;
}

const ActionCell: FC<ActionCellProps> = ({ button, onButtonIconClick }) => {
  return (
    <Box
      textAlign="right"
      gap={2}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <Button {...button} variant="secondary" size="small" />
      <IconButton icon={<MoreVert boxSize={4} className="text-theme-neutral-700" />} onClick={onButtonIconClick} />
    </Box>
  );
};

export default ActionCell;
