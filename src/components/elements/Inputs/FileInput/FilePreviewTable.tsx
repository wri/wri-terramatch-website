import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Lottie from "lottie-react";
import { FC, useCallback, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import SpinnerLottie from "@/assets/animations/spinner.json";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { useMedia } from "@/connections/Media";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useModalContext } from "@/context/modal.provider";
import { usePatchV2MediaProjectProjectMediaUuid } from "@/generated/apiComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { UploadedFile } from "@/types/common";
import Log from "@/utils/log";

import Menu from "../../Menu/Menu";
import Table from "../../Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "../../Table/TableVariants";
import Text from "../../Text/Text";
import Checkbox from "../Checkbox/Checkbox";

type FilePreviewTableProps = {
  items: Partial<UploadedFile>[];
  className?: string;
  onDelete?: (file: Partial<UploadedFile>) => void;
  formHook?: UseFormReturn;
  updateFile?: (file: Partial<UploadedFile>) => void;
  entityData?: any;
};

type FilePreview = {
  id: string | undefined;
  image: string | undefined;
  size: string;
  cover: Partial<UploadedFile>;
  public: Partial<UploadedFile>;
  geoCoded: boolean;
  ellipsis: Partial<UploadedFile>;
};

const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  const units = ["kB", "MB", "GB", "TB"];
  let size = sizeInBytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const FilePreviewTable: FC<FilePreviewTableProps> = ({ items, onDelete, updateFile, entityData }) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const { showLoader, hideLoader } = useLoading();

  const [, { update: updateMedia }] = useMedia({ id: entityData.uuid });
  const { mutateAsync: updateIsCover } = usePatchV2MediaProjectProjectMediaUuid();

  const openModalImageDetail = useCallback(
    (item: Partial<UploadedFile>) => {
      const data = {
        uuid: item.uuid,
        fullImageUrl: item.url,
        thumbnailImageUrl: item.thumbUrl,
        isPublic: item.isPublic,
        isGeotagged: item.lat !== 0 && item.lng !== 0,
        isCover: item.isCover,
        raw: { ...item, location: { lat: item.lat, lng: item.lng }, name: item.fileName, created_date: item.createdAt }
      };

      openModal(
        ModalId.MODAL_IMAGE_DETAIL,
        <ModalImageDetails
          title={t("IMAGE DETAILS")}
          data={data as unknown as MediaDto}
          entityData={entityData}
          onClose={() => closeModal(ModalId.MODAL_IMAGE_DETAIL)}
          reloadGalleryImages={() => {}}
          handleDelete={onDelete && (() => onDelete(item))}
          updateValuesInForm={updatedItem => {
            if (updatedItem.isCover) {
              items.forEach(item => {
                if (item.uuid !== updatedItem.uuid && item.isCover) {
                  updateFile?.({ ...item, isCover: false });
                }
              });
            }
            updateFile?.(updatedItem);
          }}
        />,
        true
      );
    },
    [closeModal, entityData, items, onDelete, openModal, t, updateFile]
  );

  const handleUpdateIsCover = useCallback(
    async (selectedItem: Partial<UploadedFile>, checked: boolean) => {
      showLoader();

      try {
        const updatedItems = items.map(item => ({
          ...item,
          isCover: item.uuid === selectedItem.uuid ? checked : false
        }));

        updatedItems.forEach(item => updateFile?.(item));

        if (checked) {
          await updateIsCover({
            pathParams: { project: entityData.uuid, mediaUuid: selectedItem.uuid! }
          });
        }
      } catch (error) {
        Log.error("Error updating cover status:", error);
      } finally {
        hideLoader();
      }
    },
    [entityData.uuid, hideLoader, items, showLoader, updateFile, updateIsCover]
  );

  const handleUpdateIsPublic = useCallback(
    (item: Partial<UploadedFile>, checked: boolean) => {
      showLoader();
      try {
        updateMedia({ isPublic: checked });
        updateFile?.({ ...item, isPublic: checked });
      } catch (error) {
        Log.error("Error updating public status:", error);
      } finally {
        hideLoader();
      }
    },
    [hideLoader, showLoader, updateFile, updateMedia]
  );

  const data = useMemo(
    () =>
      items.map(
        (item): FilePreview => ({
          id: item.uuid,
          image: item.fileName,
          size: formatFileSize(item.size ?? 0),
          cover: item,
          public: item,
          geoCoded: item?.lat != null && item?.lat !== 0 && item?.lng != null && item?.lng !== 0,
          ellipsis: item
        })
      ),
    [items]
  );

  const columns = useMemo(
    (): ColumnDef<FilePreview>[] => [
      {
        accessorKey: "image",
        header: `${t("Image")}`
      },
      {
        accessorKey: "size",
        header: `${t("Size")}`
      },
      {
        accessorKey: "cover",
        cell: (props: any) => (
          <Checkbox
            checked={props.getValue().isCover}
            name={""}
            onChange={e => {
              handleUpdateIsCover(props.getValue(), e.target.checked);
            }}
            disabled={!entityData?.project}
          />
        ),
        header: `${t("Cover")}`,
        meta: { align: "center" }
      },
      {
        accessorKey: "public",
        cell: (props: any) => (
          <Checkbox
            checked={props.getValue().isPublic}
            name={""}
            onChange={e => {
              handleUpdateIsPublic(props.getValue(), e.target.checked);
            }}
          />
        ),
        header: `${t("Public")}`,
        meta: { align: "center" }
      },
      {
        accessorKey: "geoCoded",
        header: `${t("GeoCoded")}`,
        cell: (props: any) =>
          props.getValue() ? (
            <div className="w-fit rounded bg-secondary-200 px-2 py-1">
              <Text variant="text-12-bold" className="text-green">
                {t("Yes")}
              </Text>
            </div>
          ) : (
            <div className="w-fit rounded bg-grey-100 px-2 py-1">
              <Text variant="text-12-semibold" className="text-neutral-600">
                {t("No")}
              </Text>
            </div>
          ),
        meta: { align: "center" }
      },
      {
        accessorKey: "ellipsis",
        header: "",
        cell: (props: any) =>
          props.getValue().uploadState?.isLoading || props.getValue().uploadState?.isDeleting ? (
            <Lottie animationData={SpinnerLottie} className="h-6 w-6" />
          ) : (
            <Menu
              menu={[
                {
                  id: "1",
                  render: () => (
                    <div className="flex items-center gap-2">
                      <Icon name={IconNames.EDIT_PA} className="h-3 w-3" />
                      <Text variant="text-12-bold">{t("Edit")}</Text>
                    </div>
                  ),
                  onClick: () => {
                    openModalImageDetail(props.getValue() as Partial<UploadedFile>);
                  }
                },
                {
                  id: "2",
                  render: () => (
                    <div className="flex items-center gap-2">
                      <Icon name={IconNames.TRASH_PA} className="h-3 w-3" />
                      <Text variant="text-12-bold">{t("Delete")}</Text>
                    </div>
                  ),
                  onClick: () => {
                    onDelete && onDelete(props.getValue());
                  }
                }
              ]}
            >
              <Icon name={IconNames.ELIPSES} />
            </Menu>
          ),
        meta: { align: "right" },
        enableSorting: false
      }
    ],
    [entityData?.project, handleUpdateIsCover, handleUpdateIsPublic, onDelete, openModalImageDetail, t]
  );

  return data.length === 0 ? null : <Table variant={VARIANT_TABLE_SITE_POLYGON_REVIEW} data={data} columns={columns} />;
};

export default FilePreviewTable;
