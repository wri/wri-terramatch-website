import classNames from "classnames";
import Image from "next/image";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

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
      {imageUrl ? (
        <Image src={imageUrl} alt={alt} fill className="object-cover" />
      ) : (
        <Icon
          name={IconNames.IMAGE_PLACEHOLDER}
          className="text-primary-200"
          width={placeholderIconSize}
          height={placeholderIconSize}
        />
      )}
    </div>
  );
};

export default ImageWithPlaceholder;
