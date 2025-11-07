import { DetailedHTMLProps, FC, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

type FormStepHeaderProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  subtitle?: string;
  actionButtonProps?: IButtonProps;
};

const FormStepHeader: FC<PropsWithChildren<FormStepHeaderProps>> = ({
  title,
  subtitle,
  actionButtonProps,
  children,
  className,
  ...divProps
}) => (
  <div {...divProps} className={twMerge("flex-1 bg-white px-16 pt-8 pb-11", className)}>
    <div className="flex items-center justify-between">
      <Text variant="text-heading-700">{title}</Text>
      {actionButtonProps == null ? null : <Button {...actionButtonProps!} />}
    </div>
    <Text variant="text-body-600" className="mt-8" containHtml>
      {subtitle}
    </Text>
    <div className="my-8 h-[2px] w-full bg-neutral-200" />
    {children}
  </div>
);

export default FormStepHeader;
