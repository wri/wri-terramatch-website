import Image, { StaticImageData } from "next/image";
import { FC, ReactNode } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import { ModalBase } from "../Modal/ModalsBases";

export interface AnnouncementModalProps {
  title: string;
  body: ReactNode;
  bannerImage?: StaticImageData;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  dontShowAgainLabel: string;
  onSkip: () => void;
  onPrimaryAction: () => void;
  onDontShowAgain: () => void;
}

const AnnouncementModal: FC<AnnouncementModalProps> = ({
  title,
  body,
  bannerImage,
  primaryCtaLabel,
  secondaryCtaLabel,
  dontShowAgainLabel,
  onSkip,
  onPrimaryAction,
  onDontShowAgain
}) => (
  <ModalBase className="pb-10">
    {bannerImage != null ? (
      <Image
        src={bannerImage}
        alt=""
        role="presentation"
        className="h-screen max-h-[280px] min-h-[180px] rounded-lg object-cover"
      />
    ) : null}
    <Text variant="text-bold-headline-1000" className={`${bannerImage != null ? "mt-10" : ""} mb-4 uppercase`}>
      {title}
    </Text>
    {typeof body === "string" ? (
      <Text variant="text-light-body-300" containHtml>
        {body}
      </Text>
    ) : (
      <Text variant="text-light-body-300">{body}</Text>
    )}
    <div className="mt-10 flex justify-center gap-8">
      <Button variant="secondary" onClick={onSkip}>
        {secondaryCtaLabel}
      </Button>
      <Button onClick={onPrimaryAction}>{primaryCtaLabel}</Button>
    </div>
    <Button variant="text" className="mt-[105px] underline screen-height-sm:mt-8" onClick={onDontShowAgain}>
      {dontShowAgainLabel}
    </Button>
  </ModalBase>
);

export default AnnouncementModal;
