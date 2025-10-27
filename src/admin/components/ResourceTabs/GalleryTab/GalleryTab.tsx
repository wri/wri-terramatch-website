import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import ImageGallery from "@/components/elements/ImageGallery/ImageGallery";
import ImageGalleryItem from "@/components/elements/ImageGallery/ImageGalleryItem";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import Text from "@/components/elements/Text/Text";
import ModalAddImages, { FileUploadEntity } from "@/components/extensive/Modal/ModalAddImages";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { deleteMedia } from "@/connections/Media";
import { useModalContext } from "@/context/modal.provider";
import { getCurrentPathEntity } from "@/helpers/entity";
import { EntityName, FileType } from "@/types/common";
import { HookFilters, HookProps } from "@/types/connection";
import Log from "@/utils/log";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: EntityName;
}

const GalleryTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const t = useT();
  const ctx = useShowContext();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6 });
  const [filter] = useState<string>("all");
  const [searchString, setSearchString] = useState<string>("");
  const [isGeotagged, setIsGeotagged] = useState<boolean | null>(null);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const { openModal, closeModal } = useModalContext();
  const [filters, setFilters] = useState<{ isPublic: boolean | undefined; modelType: string | undefined }>({
    isPublic: undefined,
    modelType: undefined
  });
  const resource = entity ?? ctx.resource;

  const [isLoaded, { data: mediaList, indexTotal, refetch }] = useMedias(
    useMemo<HookProps<typeof useMedias>>(() => {
      const requestFilters: HookFilters<typeof useMedias> = {};
      if (filter !== "all") {
        requestFilters.isPublic = filter === "public";
      } else {
        requestFilters.isPublic = filters.isPublic;
      }
      if (filters.modelType) {
        requestFilters.modelType = filters.modelType;
      }
      requestFilters.search = searchString;

      if (isGeotagged !== null) {
        requestFilters.isGeotagged = isGeotagged;
      }

      return {
        entity: resource as SupportedEntity,
        uuid: ctx?.record?.uuid,
        pageNumber: pagination.page,
        pageSize: pagination.pageSize,
        sortDirection: sortOrder,
        filter: requestFilters
      };
    }, [
      ctx?.record?.uuid,
      filter,
      filters.isPublic,
      filters.modelType,
      isGeotagged,
      pagination.page,
      pagination.pageSize,
      resource,
      searchString,
      sortOrder
    ])
  );

  const openFormModalHandlerUploadImages = () => {
    openModal(
      ModalId.UPLOAD_IMAGES,
      <ModalAddImages
        title={t("Upload Media")}
        variantFileInput={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES}
        previewAsTable
        descriptionInput={t("drag and drop or browse your device")}
        onClose={() => closeModal(ModalId.UPLOAD_IMAGES)}
        content={t(
          `if operations have begun, please upload images or videos of this specific ${getCurrentPathEntity()}`
        )}
        acceptedTypes={FileType.Image.split(",") as FileType[]}
        primaryButtonText={t("Save")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            refetch?.();
            closeModal(ModalId.UPLOAD_IMAGES);
          }
        }}
        entity={resource as FileUploadEntity}
        collection="media"
        entityData={ctx?.record}
        setErrorMessage={message => {
          Log.error(message);
        }}
      />
    );
  };

  return (
    <TabbedShowLayout.Tab label={label ?? "Gallery"} {...rest}>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{t("All Images")}</Text>
          <Button variant="primary" onClick={openFormModalHandlerUploadImages}>
            {t("UPLOAD IMAGES")}
          </Button>
        </div>
        <ImageGallery
          data={mediaList!}
          entity={resource}
          entityData={ctx.record}
          pageCount={Math.ceil((indexTotal ?? 0) / pagination.pageSize)}
          onGalleryStateChange={pagination => {
            setPagination(pagination);
          }}
          onDeleteConfirm={async uuid => {
            try {
              await deleteMedia(uuid);
              refetch?.();
            } catch (error) {
              Log.error(error);
            }
          }}
          ItemComponent={ImageGalleryItem}
          onChangeSearch={setSearchString}
          onChangeGeotagged={setIsGeotagged}
          reloadGalleryImages={refetch}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          setFilters={setFilters}
          className="mt-3"
          isAdmin={true}
          isLoading={!isLoaded}
        />
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default GalleryTab;
