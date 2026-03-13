import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import BaseImage from "../Image";

export interface ProfileImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  isAdd?: boolean;
  menuItems?: {
    label: string;
    value: string;
    startIcon?: React.ReactNode;
    onClick?: () => void;
  }[];
  menuLabel?: string;
  onClickEdit?: () => void;
}

export const ProfileImage: FC<ProfileImageProps> = ({ alt, src, className, isAdd, onClickEdit, ...rest }) => {
  return (
    <BaseImage
      {...rest}
      isAdd={isAdd}
      onClickEdit={onClickEdit}
      src={src}
      alt={alt}
      borderRadius="rounded-full"
      defaultAlt="Profile"
      className={classNames(
        "shrink-0 border",
        { "border-theme-neutral-600": src == null, "border-theme-primary-900": src != null },
        className
      )}
    />
  );
};

export default ProfileImage;
