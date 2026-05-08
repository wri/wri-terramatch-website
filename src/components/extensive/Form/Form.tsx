import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes, PropsWithChildren } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

type FormProps = PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLFormElement>, HTMLFormElement>> & {
  formType?: string;
};

type FormHeaderProps = {
  title: string;
  subtitle?: string;
};

type FormFooterProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  primaryButtonProps?: IButtonProps;
  secondaryButtonProps?: IButtonProps;
  formType?: string;
};

const Form: FC<FormProps> & { Header: typeof Header; Footer: typeof Footer } = ({
  children,
  formType,
  className,
  ...rest
}) => (
  <form
    {...rest}
    className={classNames(
      formType ? "" : "flex w-full flex-col gap-8 rounded-lg border-2 border-neutral-100 bg-white px-14 py-14",
      className
    )}
  >
    {children}
  </form>
);

const Header: FC<PropsWithChildren<FormHeaderProps>> = ({ title, subtitle, children }) => (
  <div className="flex flex-col items-center gap-8">
    <Text as="h1" variant="text-32-bold" className="uppercase">
      {title}
    </Text>
    {children == null ? (
      subtitle == null ? null : (
        <Text as="h2" variant="text-light-body-300" className="text-center">
          {subtitle}
        </Text>
      )
    ) : (
      children
    )}
  </div>
);

const Footer: FC<FormFooterProps> = ({ primaryButtonProps, secondaryButtonProps, className, formType, ...rest }) =>
  formType == "signUp" ? (
    <div {...rest} className={classNames("grid w-full", className)}>
      {primaryButtonProps != null && (
        <Button {...primaryButtonProps} type="submit" className={`ml-auto ${primaryButtonProps.className} w-full`} />
      )}
      {secondaryButtonProps != null && (
        <Button
          {...secondaryButtonProps}
          type="button"
          className={`mr-auto ${secondaryButtonProps.className}`}
          variant="secondary"
        />
      )}
    </div>
  ) : (
    <div {...rest} className={classNames("flex w-full items-center justify-between", className)}>
      {secondaryButtonProps != null && (
        <Button
          {...secondaryButtonProps}
          type="button"
          className={`mr-auto ${secondaryButtonProps.className}`}
          variant="secondary"
        />
      )}
      {primaryButtonProps != null && (
        <Button {...primaryButtonProps} type="submit" className={`ml-auto ${primaryButtonProps.className}`} />
      )}
    </div>
  );

Form.Header = Header;
Form.Footer = Footer;

export default Form;
