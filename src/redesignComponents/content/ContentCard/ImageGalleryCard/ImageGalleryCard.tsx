import { Grid, GridItem } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import { type SizeValue, resolveRemSizeValue } from "@/lib/sizing";

import GalleryImage from "../../Images/GalleryImage/GalleryImage";
import { MIN_ITEMS, MIN_ROWS } from "./constants";

export interface GalleryImageType {
  uuid: string;
  src: string;
  alt: string;
}

interface IImageGalleryCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  images: GalleryImageType[];
  onClickAdd?: () => void;
  columns?: number;
  imageSize?: SizeValue;
  className?: string;
  onSelectImage?: (image: GalleryImageType) => void;
  classNameImage?: string;
}

const ImageGalleryCard: FC<IImageGalleryCardProps> = ({
  images,
  onClickAdd,
  columns = 2,
  imageSize = 41,
  onSelectImage,
  onScroll,
  className,
  classNameImage
}) => {
  const imageCount = images?.length ?? 0;
  const minimumCapacity = Math.max(MIN_ITEMS, columns * MIN_ROWS);
  const roundedCapacity = Math.ceil(Math.max(imageCount, 1) / columns) * columns;
  const itemsToShow = Math.max(minimumCapacity, roundedCapacity);
  const placeholderCount = itemsToShow - imageCount;
  const isEmpty = imageCount === 0;
  const t = useT();

  return (
    <Grid
      templateColumns={`repeat(${columns}, 1fr)`}
      gapY={5}
      gapX={5}
      onScroll={onScroll}
      className={twMerge("bg-theme-neutral-100 rounded-md p-5", className)}
    >
      {images?.map(image => (
        <GridItem key={image.uuid}>
          <GalleryImage
            onClickEdit={onSelectImage && (() => onSelectImage(image))}
            src={image.src}
            alt={image.alt}
            size={imageSize}
            className={twMerge("bg-theme-neutral-200 min-w-full", classNameImage)}
            hoverContent={" "}
          />
        </GridItem>
      ))}
      {Array.from({ length: placeholderCount }).map((_, index) => {
        const isFirstPlaceholder = index === 0;
        const showAddSlot = onClickAdd != null && isFirstPlaceholder;

        return (
          <GridItem key={`placeholder-${index}`}>
            {showAddSlot ? (
              <GalleryImage
                className={twMerge("bg-theme-neutral-200 min-w-full", classNameImage)}
                alt={isEmpty ? t("No images available") : t("Add image")}
                isAdd={true}
                onClickAdd={onClickAdd}
                size={imageSize}
              />
            ) : (
              <div
                className="bg-theme-neutral-200 min-w-full rounded-md"
                style={{ width: resolveRemSizeValue(imageSize), height: resolveRemSizeValue(imageSize) }}
              />
            )}
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default ImageGalleryCard;
