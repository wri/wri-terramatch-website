import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { ModalBaseProps } from "./Modal";

const createModalComponent =
  (baseClasses: string, extraClasses?: string): FC<ModalBaseProps> =>
  ({ children, className, ...rest }) =>
    (
      <div {...rest} className={twMerge(baseClasses, extraClasses, className)}>
        {children}
      </div>
    );

const commonBaseClasses =
  "m-auto flex max-h-full flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white";

export const EditModalBase = createModalComponent(commonBaseClasses + " max-w-[1400px]");

export const ModalBase = createModalComponent(commonBaseClasses + " max-w-[800px] p-15", "margin-4 z-50");

export const ModalAddBase = createModalComponent(commonBaseClasses + " h-[80%] w-[776px]", "margin-4 z-50");

export const ModalBaseSubmit = createModalComponent(commonBaseClasses + " w-[776px]", "margin-4 z-50");

export const ModalBaseImageGallery = createModalComponent(
  "m-auto flex max-h-full flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white h-[80%] w-[80vw] p-8 margin-4 overflow-hidden"
);

export const ModalBaseWithClose = createModalComponent(commonBaseClasses + " max-w-[800px] p-8", "margin-4 z-50");

export const ModalBaseWithLogo = createModalComponent(commonBaseClasses + " h-[95%] w-[776px]", "margin-4 z-50");

export const ModalBaseWithMap = createModalComponent(
  commonBaseClasses + " h-[504px] w-[80vw] overflow-hidden wide:h-[700px]",
  "margin-4 z-50"
);

export const ModalBaseImageDetail = createModalComponent(
  commonBaseClasses + " w-[850px] lg:w-[890px] wide:w-[950px]  px-8 pt-10 pb-6 bg-white relative",
  "margin-4 z-50"
);
