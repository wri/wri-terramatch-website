import classNames from "classnames";
import noImageAvailable from "public/images/no-image-available.png";
import { DetailedHTMLProps, FC, HTMLAttributes, useState } from "react";

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
  const [hasErrored, setHasErrored] = useState(false);

  const src = hasErrored || imageUrl == null || imageUrl.trim() === "" ? noImageAvailable.src : imageUrl;

  return (
    <div
      {...rest}
      className={classNames(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-primary-100",
        className
      )}
    >
      <img
        referrerPolicy="no-referrer"
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => setHasErrored(true)}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
