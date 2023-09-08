import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

interface FormProps extends PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLFormElement>, HTMLFormElement>> {}

type FormHeaderProps = {
  title: string;
  subtitle?: string;
};

interface FormFooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  primaryButtonProps?: IButtonProps;
  secondaryButtonProps?: IButtonProps;
}

const Form = ({ children, ...rest }: FormProps) => {
  return (
    <form {...rest} className="flex w-full flex-col gap-8 rounded-lg border-2 border-neutral-100 bg-white px-14 py-14">
      {children}
    </form>
  );
};

const Header = ({ title, subtitle }: FormHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <Text as="h1" variant="text-heading-1000" className="uppercase">
        {title}
      </Text>
      <When condition={!!subtitle}>
        <Text as="h2" variant="text-light-body-300" className="text-center">
          {subtitle ?? ""}
        </Text>
      </When>
    </div>
  );
};

const Footer = (props: FormFooterProps) => {
  const { primaryButtonProps, secondaryButtonProps, className, ...rest } = props;
  return (
    <div {...rest} className={classNames("mt-6 flex w-full items-center justify-between", className)}>
      <When condition={!!secondaryButtonProps}>
        <Button
          {...secondaryButtonProps!}
          type="button"
          className={`mr-auto ${secondaryButtonProps?.className}`}
          variant="secondary"
        />
      </When>
      <When condition={!!primaryButtonProps}>
        <Button {...primaryButtonProps!} type="submit" className={`ml-auto ${primaryButtonProps?.className}`} />
      </When>
    </div>
  );
};

Form.Header = Header;
Form.Footer = Footer;

export default Form;
