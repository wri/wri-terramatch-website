import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import type { SizeValue } from "@/lib/sizing";

import BaseImage from "../Image";

export interface ProfileImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: SizeValue;
  scale?: number;
  position?: { x: number; y: number };
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

export const ProfileImage: FC<ProfileImageProps> = ({
  alt,
  src,
  className,
  isAdd,
  onClickEdit,
  scale,
  position,
  ...rest
}) => {
  const transforms: string[] = [];

  if (position != null) {
    transforms.push(`translate(${position.x}px, ${position.y}px)`);
  }

  if (scale != null && !Number.isNaN(scale)) {
    transforms.push(`scale(${scale})`);
  }

  const style = transforms.length > 0 ? { transform: transforms.join(" ") } : undefined;

  return (
    <BaseImage
      {...rest}
      isAdd={isAdd}
      onClickEdit={onClickEdit}
      src={src}
      alt={alt}
      style={style}
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
