import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo } from "react";

import Loader from "@/components/generic/Loading/Loader";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import ImageGalleryCard from "@/redesignComponents/content/ContentCard/ImageGalleryCard/ImageGalleryCard";
import { HookProps } from "@/types/connection";

const DEFAULT_LATEST_IMAGES_PAGE_SIZE = 4;

type LatestImagesSectionTabProps = {
  entityUuid: string;
  entityName: SupportedEntity;
  columns?: number;
  rows?: number;
  minItems?: number;
  onClickAdd?: () => void;
};

const LatestImagesSectionTab: FC<LatestImagesSectionTabProps> = ({
  entityUuid,
  entityName,
  columns,
  rows,
  minItems,
  onClickAdd
}) => {
  const t = useT();
  const router = useRouter();
  const goToGallery = useCallback(() => {
    router.push({ pathname: router.pathname, query: { ...router.query, tab: "gallery" } }, undefined, {
      shallow: true
    });
  }, [router]);

  const [loaded, { data: mediaList, loadFailure }] = useMedias(
    useMemo<HookProps<typeof useMedias>>(() => {
      return {
        entity: entityName,
        uuid: entityUuid,
        pageNumber: 1,
        pageSize: minItems ?? DEFAULT_LATEST_IMAGES_PAGE_SIZE,
        sortDirection: "DESC",
        sortField: "createdAt"
      };
    }, [entityUuid, entityName, minItems])
  );

  const images =
    mediaList?.map(media => ({
      uuid: media.uuid,
      src: media.url ?? "",
      alt: media.name
    })) ?? [];

  if (!loaded) {
    return <Loader className="w-full rounded-md bg-theme-neutral-100" />;
  }

  if (loadFailure != null) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-md bg-theme-neutral-100 px-5 text-center text-sm text-theme-neutral-600">
        {t("Unable to load images.")}
      </div>
    );
  }

  return (
    <ImageGalleryCard
      classNameImage="!w-auto"
      className="w-full"
      images={images}
      onClickAdd={onClickAdd ?? goToGallery}
      columns={columns}
      rows={rows}
      minItems={minItems}
    />
  );
};

export default LatestImagesSectionTab;
