import classNames from "classnames";
import Image, { StaticImageData } from "next/image";
import noImageAvailable from "public/images/no-image-available.png";
import { DetailedHTMLProps, FC, HTMLAttributes, useState } from "react";

export interface ImageWithPlaceholderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageUrl?: string | StaticImageData;
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
  const [hasErrored, setHasErrored] = useState(false);
  return (
    <div
      {...rest}
      className={classNames(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-primary-100",
        className
      )}
    >
      <Image
        referrerPolicy="no-referrer"
        src={hasErrored || !imageUrl ? noImageAvailable : imageUrl}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasErrored(true)}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
