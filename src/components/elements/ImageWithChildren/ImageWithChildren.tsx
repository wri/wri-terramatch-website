import classNames from "classnames";
import Image, { StaticImageData } from "next/image";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

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
  return (
    <div {...divProps} className={classNames(className, "relative")}>
      <Image
        src={imageSrc}
        alt=""
        role="presentation"
        loading="lazy"
        style={{ objectFit: "cover" }}
        className="absolute top-0 right-0 left-0 bottom-0 h-full w-full"
      />
      <div className={classNames("absolute top-0 right-0 left-0 bottom-0", childrenContainerClassName)}>{children}</div>
    </div>
  );
};

export default ImageWithChildren;
