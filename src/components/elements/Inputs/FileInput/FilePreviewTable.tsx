import { useT } from "@transifex/react";
import Lottie from "lottie-react";
import { UseFormReturn } from "react-hook-form";
import { Else, If, Then, When } from "react-if";

import SpinnerLottie from "@/assets/animations/spinner.json";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useModalContext } from "@/context/modal.provider";
import { usePatchV2MediaProjectProjectMediaUuid, usePatchV2MediaUuid } from "@/generated/apiComponents";
import { UploadedFile } from "@/types/common";

import Menu from "../../Menu/Menu";
import Table from "../../Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "../../Table/TableVariants";
import Text from "../../Text/Text";
import Checkbox from "../Checkbox/Checkbox";

export interface FilePreviewTableProps {
  items: Partial<UploadedFile>[];
  className?: string;
  onDelete?: (file: Partial<UploadedFile>) => void;
  onPrivateChange?: (file: Partial<UploadedFile>, checked: boolean) => void;
  formHook?: UseFormReturn;
  updateFile?: (file: Partial<UploadedFile>) => void;
  entityData?: any;
}

const FilePreviewTable = ({ items, onDelete, updateFile, entityData }: FilePreviewTableProps) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const { showLoader, hideLoader } = useLoading();

  const { mutate: updateMedia } = usePatchV2MediaUuid();
  const { mutateAsync: updateIsCover } = usePatchV2MediaProjectProjectMediaUuid();

  const openModalImageDetail = (item: any) => {
    const data = {
      uuid: item.uuid!,
      fullImageUrl: item.url!,
      thumbnailImageUrl: item.thumb_url!,
      label: item.model_name,
      isPublic: item.is_public!,
      isGeotagged: item?.lat !== 0 && item?.lng !== 0,
      isCover: item.is_cover,
      raw: { ...item, location: { lat: item.lat, lng: item.lng }, name: item.title, created_date: item.created_at }
    };

    openModal(
      ModalId.MODAL_IMAGE_DETAIL,
      <ModalImageDetails
        title={t("IMAGE DETAILS")}
        data={data}
        entityData={entityData}
        onClose={() => closeModal(ModalId.MODAL_IMAGE_DETAIL)}
        reloadGalleryImages={() => {}}
        handleDelete={() => {}}
        updateValuesInForm={updatedItem => {
          if (updatedItem.is_cover) {
            items.forEach(item => {
              if (item.uuid !== updatedItem.uuid && item.is_cover) {
                updateFile?.({ ...item, is_cover: false });
              }
            });
          }
          updateFile?.(updatedItem);
        }}
      />,
      true
    );
  };

  const handleUpdateIsCover = async (selectedItem: Partial<UploadedFile>, checked: boolean) => {
    showLoader();

    try {
      const updatedItems = items.map(item => ({
        ...item,
        is_cover: item.uuid === selectedItem.uuid ? checked : false
      }));

      updatedItems.forEach(item => updateFile?.(item));

      if (checked) {
        await updateIsCover({
          pathParams: { project: entityData.uuid, mediaUuid: selectedItem.uuid! }
        });
      }
    } catch (error) {
      console.error("Error updating cover status:", error);
    } finally {
      hideLoader();
    }
  };

  const handleUpdateIsPublic = async (item: Partial<UploadedFile>, checked: boolean) => {
    showLoader();
    try {
      await updateMedia({
        pathParams: { uuid: item.uuid! },
        body: { is_public: checked }
      });
      updateFile?.({ ...item, is_public: checked });
    } catch (error) {
      console.error("Error updating public status:", error);
    } finally {
      hideLoader();
    }
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

  const data = items.map(item => ({
    id: item.uuid,
    image: item.title,
    size: formatFileSize(item.size ?? 0),
    cover: item,
    public: item,
    geoCoded: item?.lat !== 0 && item?.lng !== 0,
    elipsis: item
  }));

  return (
    <When condition={items.length > 0}>
      <Table
        variant={VARIANT_TABLE_SITE_POLYGON_REVIEW}
        data={data}
        columns={[
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
                checked={props.getValue().is_cover}
                name={""}
                onChange={e => {
                  handleUpdateIsCover(props.getValue(), e.target.checked);
                }}
              />
            ),
            header: `${t("Cover")}`,
            meta: { align: "center" }
          },
          {
            accessorKey: "public",
            cell: (props: any) => (
              <Checkbox
                checked={props.getValue().is_public}
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
            cell: (props: any) => (
              <If condition={props.getValue}>
                <Then>
                  <div className="w-fit rounded bg-secondary-200 py-1 px-2">
                    <Text variant="text-12-bold" className="text-green">
                      {t("Yes")}
                    </Text>
                  </div>
                </Then>
                <Else>
                  <div className="w-fit rounded bg-grey-100 py-1 px-2">
                    <Text variant="text-12-semibold" className="text-neutral-600">
                      {t("No")}
                    </Text>
                  </div>
                </Else>
              </If>
            ),
            meta: { align: "center" }
          },
          {
            accessorKey: "elipsis",
            header: "",
            cell: (props: any) => (
              <If condition={props.getValue().uploadState?.isLoading || props.getValue().uploadState?.isDeleting}>
                <Then>
                  <Lottie animationData={SpinnerLottie} className="h-6 w-6" />
                </Then>
                <Else>
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
                          openModalImageDetail(props.getValue());
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
                </Else>
              </If>
            ),
            meta: { align: "right" },
            enableSorting: false
          }
        ]}
      />
    </When>
  );
};

export default FilePreviewTable;
