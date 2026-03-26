import { Grid, GridItem } from "@chakra-ui/react";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

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
  imageSize?: number;
  className?: string;
  onSelectImage?: (image: GalleryImageType) => void;
}

const ImageGalleryCard: FC<IImageGalleryCardProps> = ({
  images,
  onClickAdd,
  columns = 2,
  imageSize = 164,
  onSelectImage,
  onScroll,
  className
}) => {
  const imageCount = images?.length ?? 0;
  const minimumCapacity = Math.max(MIN_ITEMS, columns * MIN_ROWS);
  const roundedCapacity = Math.ceil(Math.max(imageCount, 1) / columns) * columns;
  const itemsToShow = Math.max(minimumCapacity, roundedCapacity);
  const placeholderCount = itemsToShow - imageCount;
  const isEmpty = imageCount === 0;

  return (
    <Grid
      templateColumns={`repeat(${columns}, 1fr)`}
      gapY={5}
      gapX={5}
      onScroll={onScroll}
      className={twMerge("rounded-md bg-theme-neutral-100 p-5", className)}
    >
      {images?.map(image => (
        <GridItem key={image.uuid}>
          <GalleryImage
            onClickEdit={onSelectImage && (() => onSelectImage(image))}
            src={image.src}
            alt={image.alt}
            size={imageSize}
            className="min-w-full bg-theme-neutral-200"
            hoverContent={" "}
          />
        </GridItem>
      ))}
      {Array.from({ length: placeholderCount }).map((_, index) => {
        const isFirstPlaceholder = index === 0;
        const showContent = isEmpty && isFirstPlaceholder;

        return (
          <GridItem key={`placeholder-${index}`}>
            {showContent ? (
              <GalleryImage
                className="min-w-full"
                alt="No images available"
                isAdd={true}
                onClickAdd={onClickAdd}
                size={imageSize}
              />
            ) : (
              <div
                className="min-w-full rounded-md bg-theme-neutral-200"
                style={{ width: imageSize, height: imageSize }}
              />
            )}
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default ImageGalleryCard;
