import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";

interface FormFooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  submitButtonProps?: Omit<IButtonProps, "type" | "variant">;
  backButtonProps?: Omit<IButtonProps, "color" | "variant">;
  variant?: "default" | "sticky";
}
const footerVariants = {
  sticky: "sticky bottom-0 w-full bg-white py-4 px-16 shadow-top",
  default: "w-full"
} as const;

export const FormFooter = (props: FormFooterProps) => {
  const { className, submitButtonProps, backButtonProps, ...rest } = props;

  return (
    <div className={classNames(footerVariants[props.variant ?? "default"], className)}>
      <div {...rest} className={classNames("flex w-full items-center justify-between", className)}>
        <When condition={!!backButtonProps}>
          <Button {...backButtonProps!} variant="secondary" />
        </When>
        <When condition={!!submitButtonProps}>
          <Button {...submitButtonProps!} />
        </When>
      </div>
    </div>
  );
};
