import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import ImageCredit from "@/components/elements/ImageCredit/ImageCredit";

export interface BannerProps
  extends PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>> {
  bgImage?: string;
  imageCredit?: {
    name: string;
    position: "right" | "left";
  };
}

const Banner = ({ className, bgImage, imageCredit, ...props }: BannerProps) => {
  return (
    <div
      {...props}
      className={classNames(
        "relative flex w-full flex-col items-center justify-center bg-heroBanner bg-cover bg-no-repeat px-10 py-8 md:py-15",
        className
      )}
      style={{
        backgroundImage: `url('${bgImage}')`
      }}
    >
      {props.children}
      <ImageCredit
        className={classNames(`absolute bottom-0`, {
          "left-5": imageCredit?.position === "left",
          "right-5": imageCredit?.position === "right"
        })}
      >
        {imageCredit?.name}
      </ImageCredit>
    </div>
  );
};

export default Banner;
