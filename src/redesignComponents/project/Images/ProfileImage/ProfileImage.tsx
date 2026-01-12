import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import BaseImage from "../Image";

export interface ProfileImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  isAvailable?: boolean;
}

export function ProfileImage({ alt, isAvailable = true, src, className, ...rest }: ProfileImageProps) {
  const showNotAvailable = !isAvailable && !src;
  return (
    <BaseImage
      {...rest}
      isAvailable={isAvailable}
      src={src}
      alt={alt}
      borderRadius="rounded-full"
      defaultAlt="Profile"
      className={classNames(
        "border",
        { "border-theme-neutral-600": showNotAvailable, "border-theme-primary-900": !showNotAvailable },
        className
      )}
    />
  );
}
