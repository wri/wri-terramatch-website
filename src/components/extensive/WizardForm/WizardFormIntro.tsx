import { useT } from "@transifex/react";
import classNames from "classnames";
import Image, { StaticImageData } from "next/image";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { When } from "react-if";

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
};

const WizardFormIntro = (props: WizardFormIntroProps) => {
  const { format } = useDate();
  const t = useT();

  return (
    <div className="w-full space-y-8 rounded-lg border-2 border-neutral-100 bg-white p-15">
      <When condition={!!props.imageSrc}>
        <Image
          src={props.imageSrc!}
          alt=""
          role="presentation"
          className="m-auto h-[280px] w-full"
          height={280}
          width={280}
          style={{ objectFit: "contain" }}
        />
      </When>
      <Text variant="text-bold-headline-1000" className="text-center uppercase">
        {props.title}
      </Text>
      <When condition={props.description}>
        <Text variant="text-light-body-300" className="text-center" containHtml>
          {props.description}
        </Text>
      </When>
      <When condition={props.ctaProps?.href}>
        <Button {...props.ctaProps!} variant="text" className="m-auto text-center underline" target="_blank" />
      </When>
      <div className="space-y-3">
        <When condition={!!props.deadline}>
          <InfoItem title={t("Deadline")}>{format(Date.parse(props.deadline!), "do MMMM y")}</InfoItem>
        </When>
        <When condition={!!props.deadline}>
          <InfoItem title={t("Time")}>{format(Date.parse(props.deadline!), "HH:mm")}</InfoItem>
        </When>
      </div>
      <FormFooter
        className="mt-15"
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
