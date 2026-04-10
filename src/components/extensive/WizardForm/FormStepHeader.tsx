import { DetailedHTMLProps, FC, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";
import Button, { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import FormSectionHeader from "@/redesignComponents/content/headers/FormSectionHeader/FormSectionHeader";

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
  <div {...divProps} className={twMerge("flex-1 bg-white py-4 pl-14", className)}>
    <FormSectionHeader
      actions={actionButtonProps != null && <Button variant="secondary" {...actionButtonProps} />}
      title={title}
      showBorder={false}
      className="!mb-3"
    />
    {subtitle != null && (
      <Text variant="text-body-600" className="mt-2" containHtml>
        {subtitle}
      </Text>
    )}
    {children}
  </div>
);

export default FormStepHeader;
