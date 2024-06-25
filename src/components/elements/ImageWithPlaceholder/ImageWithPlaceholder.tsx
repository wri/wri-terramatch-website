import classNames from "classnames";
import Image from "next/image";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

export interface ImageWithPlaceholderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageUrl?: string;
  alt: string;
  placeholderIconSize?: number;
}

const ImageWithPlaceholder: FC<ImageWithPlaceholderProps> = ({
  imageUrl,
  alt,
  placeholderIconSize = 64,
  className,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={classNames(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-primary-100",
        className
      )}
    >
      <Image referrerPolicy="no-referrer" src={imageUrl as string} alt={alt} fill className="object-cover" />
    </div>
  );
};

export default ImageWithPlaceholder;
