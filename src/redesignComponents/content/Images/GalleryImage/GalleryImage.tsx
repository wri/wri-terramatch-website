import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import BaseImage from "../Image";

export interface GalleryImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  isAdd?: boolean;
  onClickEdit?: () => void;
  onClickAdd?: () => void;
  hoverContent?: React.ReactNode;
  type?: "video" | "image";
}

const GalleryImage: FC<GalleryImageProps> = ({
  alt,
  isAdd,
  onClickEdit,
  onClickAdd,
  hoverContent,
  type = "image",
  ...rest
}) => {
  return (
    <BaseImage
      {...rest}
      alt={alt}
      borderRadius="rounded-md"
      defaultAlt="Gallery"
      classNamesHover="m-0.5 border border-white w-[calc(100%-0.25rem)] h-[calc(100%-0.25rem)] absolute inset-0 rounded-md"
      isAdd={isAdd}
      onClickEdit={onClickEdit}
      onClickAdd={onClickAdd}
      hoverContent={hoverContent}
      type={type}
    />
  );
};

export default GalleryImage;
