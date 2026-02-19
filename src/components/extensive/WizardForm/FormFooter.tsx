import { Box } from "@chakra-ui/react";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import ToolbarForm from "@/redesignComponents/navigation/Toolbar/ToolbarForm";

interface FormFooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  ButtonLeft?: IButtonProps;
  ButtonPrimary?: IButtonProps;
  ButtonSecondary?: IButtonProps;
  ButtonTertiary?: IButtonProps;
}

export const FormFooter = (props: FormFooterProps) => {
  return (
    <Box className={props.className}>
      <ToolbarForm {...props} />
    </Box>
  );
};
