import { Box, Grid, GridItem } from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { EntityName } from "@/types/common";
import { HookProps } from "@/types/connection";

import GalleryImage from "../../Images/GalleryImage/GalleryImage";
import { MIN_ITEMS } from "./constants";

interface IImageGalleryCardProps {
  entityUUID: string;
  entityName: EntityName;
}

const ImageGalleryCard: FC<IImageGalleryCardProps> = ({ entityUUID, entityName }) => {
  const [, { data: mediaList }] = useMedias(
    useMemo<HookProps<typeof useMedias>>(() => {
      return {
        entity: entityName as SupportedEntity,
        uuid: entityUUID,
        pageNumber: 1,
        pageSize: 4,
        sortDirection: "DESC"
      };
    }, [entityUUID, entityName])
  );
  const thumbnails = mediaList?.map(media => media.url);
  const imageCount = thumbnails?.length ?? 0;
  const itemsToShow = Math.max(MIN_ITEMS, imageCount);
  const placeholderCount = itemsToShow - imageCount;
  const isEmpty = imageCount === 0;

  return (
    <Box padding={5} backgroundColor="white" borderRadius="md">
      <Grid templateColumns="repeat(2, 1fr)" gapY={5} gapX={5}>
        {thumbnails?.map((image, index) => (
          <GridItem key={`image-${index}-${image}`}>
            <GalleryImage
              src={image!}
              alt="No Image Available"
              className="h-full min-h-full w-full min-w-full bg-theme-neutral-200"
            />
          </GridItem>
        ))}
        {Array.from({ length: placeholderCount }).map((_, index) => {
          const isFirstPlaceholder = index === 0;
          const showContent = isEmpty && isFirstPlaceholder;

          return (
            <GridItem key={`placeholder-${index}`}>
              {showContent ? (
                <GalleryImage alt="No images available" isAvailable={false} />
              ) : (
                <div className="rounded-md bg-theme-neutral-200" style={{ width: 164, height: 164 }} />
              )}
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ImageGalleryCard;
