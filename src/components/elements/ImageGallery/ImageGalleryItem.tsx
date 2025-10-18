import { useT } from "@transifex/react";
import classNames from "classnames";
import { format } from "date-fns";
import { DetailedHTMLProps, FC, HTMLAttributes, useCallback, useMemo } from "react";

import { MenuItemProps } from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { usePatchV2MediaProjectProjectMediaUuid, usePostV2ExportImage } from "@/generated/apiComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

import ImageWithChildren from "../ImageWithChildren/ImageWithChildren";
import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_RIGHT } from "../Menu/MenuVariant";

export type ImageGalleryItemData = {
  uuid: string;
  thumbnailImageUrl: string;
  fullImageUrl: string;
  downloadUrl?: string;
  label: string;
  subtitle?: string;
  isGeotagged?: boolean;
  isPublic: boolean;
  isCover?: boolean;
};

export interface ImageGalleryItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: MediaDto;
  entityData?: any;
  onDelete?: (id: string) => void;
  reloadGalleryImages?: () => void;
}

const ImageGalleryItem: FC<ImageGalleryItemProps> = ({
  data,
  entityData,
  onDelete,
  className,
  reloadGalleryImages,
  ...rest
}) => {
  const { openModal, closeModal } = useModalContext();
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();
  const { getReadableEntityName } = useGetReadableEntityName();
  const t = useT();
  const { mutateAsync } = usePostV2ExportImage();
  const { mutateAsync: updateIsCoverAsync } = usePatchV2MediaProjectProjectMediaUuid();
  const handleDelete = useCallback(() => {
    onDelete?.(data.uuid);
  }, [data.uuid, onDelete]);
  const setImageCover = useCallback(async () => {
    const result = await updateIsCoverAsync({
      pathParams: { project: entityData.uuid, mediaUuid: data.uuid }
    });
    if (result) {
      openNotification("success", t("Success!"), t("Image set as cover successfully"));
      reloadGalleryImages?.();
    } else {
      openNotification("error", t("Error!"), t("Failed to set image as cover"));
    }
  }, [data.uuid, entityData.uuid, openNotification, reloadGalleryImages, t, updateIsCoverAsync]);
  const openModalImageDetail = useCallback(() => {
    openModal(
      ModalId.MODAL_IMAGE_DETAIL,
      <ModalImageDetails
        title="IMAGE DETAILS"
        data={data}
        entityData={entityData}
        onClose={() => closeModal(ModalId.MODAL_IMAGE_DETAIL)}
        reloadGalleryImages={reloadGalleryImages}
        handleDelete={handleDelete}
      />,
      true
    );
  }, [closeModal, data, entityData, handleDelete, openModal, reloadGalleryImages]);

  const handleDownload = useCallback(async (): Promise<void> => {
    showLoader();
    try {
      const response = await mutateAsync({
        body: {
          uuid: data.uuid
        }
      });

      if (!response) {
        Log.error("No response received from the server.");
        openNotification("error", t("Error!"), t("No response received from the server."));
        return;
      }

      const blob = new Blob([response], { type: "image/jpeg" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = link.download = data?.fileName ?? "image.jpg";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      hideLoader();
      openNotification("success", t("Success!"), t("Image downloaded successfully"));
    } catch (error) {
      Log.error("Download error:", error);
      hideLoader();
    }
  }, [data?.fileName, data.uuid, hideLoader, mutateAsync, openNotification, showLoader, t]);

  const galleryMenu: MenuItemProps[] = useMemo(
    () => [
      {
        id: "1",
        render: () => (
          <Text variant="text-12-bold" className="pr-3">
            {t("Edit Attributes")}
          </Text>
        ),
        onClick: openModalImageDetail
      },
      {
        id: "2",
        render: () => (
          <Text variant="text-12-bold" className="pr-3">
            {t("Download")}
          </Text>
        ),
        onClick: handleDownload
      },
      ...(!entityData?.project
        ? [
            {
              id: "3",
              render: () => (
                <Text variant="text-12-bold" className="pr-3">
                  {t("Make Cover")}
                </Text>
              ),
              onClick: setImageCover
            }
          ]
        : []),
      {
        id: "4",
        render: () => null,
        type: "line"
      },
      {
        id: "5",
        render: () => (
          <Text variant="text-12-bold" className="pr-3">
            {t("Delete")}
          </Text>
        ),
        onClick: handleDelete
      }
    ],
    [entityData?.project, handleDelete, handleDownload, openModalImageDetail, setImageCover, t]
  );

  return (
    <div {...rest} className={classNames("relative overflow-hidden rounded-xl bg-background", className)}>
      {data.thumbUrl && (
        <ImageWithChildren
          imageSrc={{
            src: data.thumbUrl,
            height: 211,
            width: 1440
          }}
          isGeotagged={data.lat !== null && data.lng !== null}
          isCover={data.isCover}
          className="h-[226px] rounded-t-xl"
        >
          <div className="flex justify-between p-3">
            {/* Left */}
            {!data.isPublic && (
              <Icon name={IconNames.LOCK_CIRCLE} height={32} width={32} className="fill-neutral-700" />
            )}

            {/* Right */}

            <div className="ml-auto flex items-center">
              <Menu menu={galleryMenu} placement={MENU_PLACEMENT_BOTTOM_RIGHT}>
                <Icon
                  name={IconNames.ELIPSES}
                  className="h-8 w-8 rotate-90 cursor-pointer rounded-full bg-[#6f6d6d80] p-1 text-white hover:text-primary"
                ></Icon>
              </Menu>
            </div>
          </div>
        </ImageWithChildren>
      )}

      <div className="p-4 text-darkCustom">
        <div className="flex items-center justify-between gap-1">
          <Text variant="text-14-bold" className="flex items-center gap-1">
            {t("Uploaded via")}:{" "}
            <Text variant="text-14-light" className="capitalize">
              {getReadableEntityName(data?.entityType as EntityName, true)}
            </Text>
          </Text>
          <button
            className="rounded-lg p-1 text-darkCustom hover:bg-grey-800 hover:text-primary"
            onClick={openModalImageDetail}
          >
            <Icon name={IconNames.EDIT} height={24} width={24} className="" />
          </button>
        </div>
        <Text variant="text-14-bold" className="flex items-center gap-1">
          {t("Date uploaded")}:{" "}
          <Text variant="text-14-light" className="capitalize">
            {(() => {
              try {
                return format(new Date(Date.parse(data.createdAt)), "dd/MM/Y");
              } catch (e) {
                return "-";
              }
            })()}
          </Text>
        </Text>
        <Text variant="text-14-bold" className="flex items-center gap-1">
          {t("Visibility")}:{" "}
          <Text variant="text-14-light" className="capitalize">
            {data.isPublic ? t("Public") : t("Private")}
          </Text>
        </Text>
      </div>
    </div>
  );
};

export default ImageGalleryItem;
