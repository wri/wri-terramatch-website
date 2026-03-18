import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import BaseImage from "../Image";

export interface ProfileImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  isAdd?: boolean;
}

export const ProfileImage: FC<ProfileImageProps> = ({ alt, src, className, isAdd, ...rest }) => {
  return (
    <BaseImage
      {...rest}
      isAdd={isAdd}
      src={src}
      alt={alt}
      borderRadius="rounded-full"
      defaultAlt="Profile"
      className={classNames(
        "border",
        { "border-theme-neutral-600": src == null, "border-theme-primary-900": src != null },
        className
      )}
    />
  );
};

export default ProfileImage;
