import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import BaseImage from "../Image";

export interface ProfileImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  isAvailable?: boolean;
  isAdd?: boolean;
}

export const ProfileImage: FC<ProfileImageProps> = ({ alt, isAvailable = true, src, className, isAdd, ...rest }) => {
  const showNotAvailable = !isAvailable || src == null;
  return (
    <BaseImage
      {...rest}
      isAvailable={isAvailable}
      isAdd={isAdd}
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
