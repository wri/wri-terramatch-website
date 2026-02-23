import { FC, useMemo } from "react";

import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import ImageGalleryCard from "@/redesignComponents/content/ContentCard/ImageGalleryCard/ImageGalleryCard";
import { HookProps } from "@/types/connection";

const LastestImagesSectionTab: FC<{ entityUuid: string; entityName: SupportedEntity }> = ({
  entityUuid,
  entityName
}) => {
  const [, { data: mediaList }] = useMedias(
    useMemo<HookProps<typeof useMedias>>(() => {
      return {
        entity: entityName,
        uuid: entityUuid,
        pageNumber: 1,
        pageSize: 4,
        sortDirection: "DESC"
      };
    }, [entityUuid, entityName])
  );

  const images = mediaList?.map(media => media.url) ?? [];
  return <ImageGalleryCard images={images as string[]} />;
};

export default LastestImagesSectionTab;
