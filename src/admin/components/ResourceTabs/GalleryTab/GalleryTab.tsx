import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import ImageGallery from "@/components/elements/ImageGallery/ImageGallery";
import ImageGalleryItem from "@/components/elements/ImageGallery/ImageGalleryItem";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import Text from "@/components/elements/Text/Text";
import ModalAddImages from "@/components/extensive/Modal/ModalAddImages";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useMedias } from "@/connections/EntityAssocation";
import { SupportedEntity } from "@/connections/EntityAssocation";
import { useModalContext } from "@/context/modal.provider";
import { useDeleteV2FilesUUID } from "@/generated/apiComponents";
import { getCurrentPathEntity } from "@/helpers/entity";
import { EntityName, FileType } from "@/types/common";
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
  const [isGeotagged, setIsGeotagged] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { openModal, closeModal } = useModalContext();
  const [filters, setFilters] = useState<{ isPublic: boolean | undefined; modelType: string | undefined }>({
    isPublic: undefined,
    modelType: undefined
  });
  const resource = entity ?? ctx.resource;

  const queryParams: any = useMemo(() => {
    return {
      "page[number]": pagination.page,
      "page[size]": pagination.pageSize
    };
  }, [pagination]);

  if (filter !== "all") {
    queryParams["filter[is_public]"] = filter === "public";
  }
  if (filters.isPublic !== undefined) {
    queryParams["filter[is_public]"] = filters.isPublic;
  }
  if (filters.modelType) {
    queryParams["filter[model_type]"] = filters.modelType;
  }
  queryParams["search"] = searchString;
  queryParams["isGeotagged"] = isGeotagged;
  queryParams["direction"] = sortOrder;
  const [isLoaded, { associations: mediaList, indexTotal }] = useMedias({
    entity: resource as SupportedEntity,
    uuid: ctx?.record?.uuid,
    queryParams
  });

  // const { refetch } = useGetV2MODELUUIDFiles(
  //   {
  //     // Currently only projects, sites, nurseries, projectReports, nurseryReports and siteReports are set up
  //     pathParams: { model: resource, uuid: ctx?.record?.uuid },
  //     queryParams
  //   },
  //   {
  //     enabled: !!ctx?.record?.uuid
  //   }
  // );

  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess() {
      // refetch();
    }
  });

  // useEffect(() => {
  //   refetch();
  // }, [filters, pagination, searchString, isGeotagged, sortOrder, refetch]);

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
            // refetch();
            closeModal(ModalId.UPLOAD_IMAGES);
          }
        }}
        model={resource}
        collection="media"
        entityData={ctx?.record}
        setErrorMessage={message => {
          Log.error(message);
        }}
      />
    );
  };

  return (
    <When condition={isLoaded}>
      <TabbedShowLayout.Tab label={label ?? "Gallery"} {...rest}>
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Text variant="text-24-bold">{t("All Images")}</Text>
            <Button variant="primary" onClick={openFormModalHandlerUploadImages}>
              {t("UPLOAD IMAGES")}
            </Button>
          </div>
          <ImageGallery
            data={
              mediaList?.map(file => ({
                //@ts-ignore
                uuid: file.uuid!,
                fullImageUrl: file.url!,
                thumbnailImageUrl: file.thumbUrl!,
                label: file.name,
                isPublic: file.isPublic!,
                isGeotagged: file?.lat !== 0 && file?.lng !== 0,
                isCover: file.isCover,
                raw: file
              })) || []
            }
            entity={resource}
            entityData={ctx.record}
            pageCount={Math.ceil((indexTotal ?? 0) / pagination.pageSize)}
            onGalleryStateChange={pagination => {
              setPagination(pagination);
            }}
            onDeleteConfirm={uuid => deleteFile({ pathParams: { uuid } })}
            ItemComponent={ImageGalleryItem}
            onChangeSearch={setSearchString}
            onChangeGeotagged={setIsGeotagged}
            reloadGalleryImages={() => {}}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            setFilters={setFilters}
            className="mt-3"
            isAdmin={true}
            isLoading={!isLoaded}
          />
        </div>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default GalleryTab;
