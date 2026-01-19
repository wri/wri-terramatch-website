import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import BaseImage from "../Image";

export interface ProfileImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  isAvailable?: boolean;
}

export const ProfileImage: FC<ProfileImageProps> = ({ alt, isAvailable = true, src, className, ...rest }) => {
  const showNotAvailable = !isAvailable || src == null;
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
};

export default ProfileImage;
