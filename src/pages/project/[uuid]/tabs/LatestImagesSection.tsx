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
    return <Loader className="bg-theme-neutral-100 w-full rounded-md" />;
  }

  if (loadFailure != null) {
    return (
      <div className="bg-theme-neutral-100 text-theme-neutral-600 flex h-32 w-full items-center justify-center rounded-md px-5 text-center text-sm">
        {t("Unable to load images.")}
      </div>
    );
  }

  return (
    <ImageGalleryCard
      classNameImage="!w-auto mobile:!aspect-[2/1] mobile:!h-auto mobile:!object-cover"
      className="w-full mobile:!grid-cols-2"
      images={images}
      onClickAdd={onClickAdd ?? goToGallery}
      columns={columns}
      rows={rows}
      minItems={minItems}
    />
  );
};

export default LatestImagesSectionTab;
