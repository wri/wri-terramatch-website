import { useMedias, SupportedEntity } from "@/connections/EntityAssociation";
import { useMemo } from "react";
import { HookProps } from "@/types/connection";
import ImageGalleryCard from "@/redesignComponents/content/ContentCard/ImageGalleryCard/ImageGalleryCard";

const LastestImagesSectionTab = ({entityUuid, entityName}:{entityUuid:string, entityName: SupportedEntity}) => {
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
