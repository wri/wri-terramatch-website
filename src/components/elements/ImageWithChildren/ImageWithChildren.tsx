import { useT } from "@transifex/react";
import classNames from "classnames";
import { StaticImageData } from "next/image";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import ImageWithPlaceholder from "../ImageWithPlaceholder/ImageWithPlaceholder";

export interface ImageWithChildrenProps
  extends PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>> {
  imageSrc: string | StaticImageData;
  childrenContainerClassName?: string;
}

/**
 * Can be usefull when height of image is fixed and won't change with content otherwise this might not work well.
 * Good to improve page speed performance instead of using background image.
 */
const ImageWithChildren = ({
  imageSrc,
  className,
  children,
  childrenContainerClassName,
  ...divProps
}: ImageWithChildrenProps) => {
  const t = useT();
  return (
    <div {...divProps} className={classNames(className, "relative")}>
      <ImageWithPlaceholder
        imageUrl={imageSrc as string}
        placeholder={t("No Image Available")}
        alt={t("No Image Available")}
        role="presentation"
        style={{ objectFit: "cover" }}
        className="absolute top-0 bottom-0 left-0 right-0 h-full w-full rounded-lg"
      />
      <div className={classNames("absolute top-0 right-0 left-0 bottom-0", childrenContainerClassName)}>{children}</div>
    </div>
  );
};

export default ImageWithChildren;
