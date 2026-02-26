import { Box } from "@chakra-ui/react";
import { FC } from "react";

import Button, { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import { MoreVertIcon } from "@/redesignComponents/foundations/Icons";

interface ActionCellProps {
  button?: IButtonProps;
  buttonSecondary?: IButtonProps;
  onButtonIconClick?: () => void;
}

const ActionCell: FC<ActionCellProps> = ({ button, buttonSecondary, onButtonIconClick }) => {
  return (
    <Box
      textAlign="right"
      gap={2}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      {button != null && <Button {...button} variant="secondary" size="small" />}
      {buttonSecondary != null && <Button {...buttonSecondary} />}
      {onButtonIconClick != null && (
        <IconButton
          icon={<MoreVertIcon boxSize={4} className="text-theme-neutral-700" />}
          onClick={onButtonIconClick}
        />
      )}
    </Box>
  );
};

export default ActionCell;
