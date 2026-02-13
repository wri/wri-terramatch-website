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
  <div {...divProps} className={twMerge("flex-1 bg-white pt-4 pb-11 pl-20", className)}>
    <div className="flex items-center justify-between">
      <Text variant="text-24-bold" className="text-theme-primary-900">
        {title}
      </Text>
      {actionButtonProps != null && <Button {...actionButtonProps} />}
    </div>
    {subtitle != null && (
      <Text variant="text-body-600" className="mt-2" containHtml>
        {subtitle}
      </Text>
    )}
    <div className="bg-theme-neutral-300 my-2 h-[1px] w-full" />
    {children}
  </div>
);

export default FormStepHeader;
