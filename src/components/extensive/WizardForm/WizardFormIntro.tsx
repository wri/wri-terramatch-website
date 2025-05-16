import { useT } from "@transifex/react";
import classNames from "classnames";
import Image, { StaticImageData } from "next/image";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { useDate } from "@/hooks/useDate";

import { FormFooter } from "./FormFooter";

type WizardFormIntroProps = {
  title: string;
  description?: string;
  imageSrc?: string | StaticImageData;

  submitButtonProps?: Omit<IButtonProps, "type" | "variant">;
  backButtonProps?: Omit<IButtonProps, "color" | "variant">;
  ctaProps?: IButtonProps;

  deadline?: string;

  variant?: "default" | "small";
};

const VARIANTS = {
  default: {
    containerClass: "space-y-8 p-15",
    imageClass: "m-auto h-[280px] w-full",
    footerMarginTop: "mt-15"
  },
  small: {
    containerClass: "space-y-4 p-10",
    imageClass: "m-auto",
    footerMarginTop: "mt-5"
  }
};

const WizardFormIntro = (props: WizardFormIntroProps) => {
  const { format } = useDate();
  const t = useT();

  const { containerClass, imageClass, footerMarginTop } = VARIANTS[props.variant ?? "default"];

  return (
    <div className={`w-full rounded-lg border-2 border-neutral-100 bg-white ${containerClass}`}>
      {props.imageSrc && (
        <Image
          src={props.imageSrc!}
          alt=""
          role="presentation"
          className={imageClass}
          height={280}
          width={280}
          style={{ objectFit: "contain" }}
        />
      )}
      <Text variant="text-bold-headline-1000" className="text-center uppercase">
        {props.title}
      </Text>
      {props.description && (
        <Text variant="text-light-body-300" className="text-center" containHtml>
          {props.description}
        </Text>
      )}
      {props.ctaProps?.href && (
        <Button {...props.ctaProps!} variant="text" className="m-auto text-center underline" target="_blank" />
      )}
      {props.deadline && (
        <div className="space-y-3">
          <InfoItem title={t("Deadline")}>{format(Date.parse(props.deadline!), "do MMMM y")}</InfoItem>
          <InfoItem title={t("Time")}>{format(Date.parse(props.deadline!), "HH:mm")}</InfoItem>
        </div>
      )}
      <FormFooter
        className={footerMarginTop}
        submitButtonProps={props.submitButtonProps}
        backButtonProps={props.backButtonProps}
      />
    </div>
  );
};

interface InfoItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  children: string;
}

const InfoItem = ({ children, className, title, ...props }: InfoItemProps) => {
  return (
    <div
      {...props}
      className={classNames(className, "flex w-full justify-between rounded-lg bg-primary-100 px-4 py-3")}
    >
      <Text variant="text-bold-subtitle-400">{title}</Text>
      <Text variant="text-light-subtitle-400">{children}</Text>
    </div>
  );
};

export default WizardFormIntro;
