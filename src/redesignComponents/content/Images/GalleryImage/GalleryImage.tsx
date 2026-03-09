import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import BaseImage from "../Image";

export interface GalleryImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  isAdd?: boolean;
  onClickAdd?: () => void;
}

const GalleryImage: FC<GalleryImageProps> = ({ alt, isAdd, onClickAdd, ...rest }) => {
  return (
    <BaseImage
      {...rest}
      alt={alt}
      borderRadius="rounded-md"
      defaultAlt="Gallery"
      classNamesHover="m-0.5 border border-white w-[calc(100%-0.25rem)] h-[calc(100%-0.25rem)] absolute inset-0 rounded-md"
      isAdd={isAdd}
      onClickAdd={onClickAdd}
    />
  );
};

export default GalleryImage;
