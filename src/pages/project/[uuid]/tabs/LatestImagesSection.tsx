import { useRouter } from "next/router";
import { FC, useMemo } from "react";

import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import ImageGalleryCard from "@/redesignComponents/content/ContentCard/ImageGalleryCard/ImageGalleryCard";
import { HookProps } from "@/types/connection";

const LatestImagesSectionTab: FC<{ entityUuid: string; entityName: SupportedEntity; columns?: number }> = ({
  entityUuid,
  entityName,
  columns
}) => {
  const router = useRouter();
  const goToTab = (tab: string) => {
    router.push({ pathname: router.pathname, query: { ...router.query, tab: tab } }, undefined, {
      shallow: true
    });
  };
  const [, { data: mediaList }] = useMedias(
    useMemo<HookProps<typeof useMedias>>(() => {
      return {
        entity: entityName,
        uuid: entityUuid,
        pageNumber: 1,
        pageSize: 4,
        sortDirection: "DESC",
        sortField: "createdAt"
      };
    }, [entityUuid, entityName])
  );

  const images =
    mediaList?.map(media => ({
      uuid: media.uuid,
      src: media.url ?? "",
      alt: media.name
    })) ?? [];
  return (
    <ImageGalleryCard
      classNameImage="!w-auto"
      className="w-full"
      images={images}
      onClickAdd={() => goToTab("gallery")}
      columns={columns}
    />
  );
};

export default LatestImagesSectionTab;
