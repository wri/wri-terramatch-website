import classNames from "classnames";
import Image, { StaticImageData } from "next/image";
import noImageAvailable from "public/images/no-image-available.png";
import { DetailedHTMLProps, FC, HTMLAttributes, useState } from "react";

export interface ImageWithPlaceholderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageUrl?: string | StaticImageData;
  alt: string;
  placeholderIconSize?: number;
  sizes?: string;
}

const ImageWithPlaceholder: FC<ImageWithPlaceholderProps> = ({
  imageUrl,
  alt,
  placeholderIconSize = 64,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...rest
}) => {
  const [hasErrored, setHasErrored] = useState(false);

  const shouldShowPlaceholder = () => {
    if (hasErrored || imageUrl == null) return true;
    if (typeof imageUrl === "object" && imageUrl.src == null) return true;
    if (typeof imageUrl === "string" && imageUrl.trim() === "") return true;
    return false;
  };

  const getImageSrc = () => {
    return shouldShowPlaceholder() ? noImageAvailable : imageUrl!;
  };

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
        src={getImageSrc()}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        onError={() => setHasErrored(true)}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
