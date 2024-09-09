import { useT } from "@transifex/react";
import classNames from "classnames";
import { format } from "date-fns";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import { MenuItemProps } from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { usePostV2ExportImage } from "@/generated/apiComponents";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import { SingularEntityName } from "@/types/common";

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
  isGeotagged: boolean;
  isPublic: boolean;
  raw?: Record<any, any>;
};

export interface ImageGalleryItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: ImageGalleryItemData;
  onClickGalleryItem?: (data: ImageGalleryItemData) => void;
  onDelete?: (id: string) => void;
}

const ImageGalleryItem: FC<ImageGalleryItemProps> = ({ data, onClickGalleryItem, onDelete, className, ...rest }) => {
  const { openModal, closeModal } = useModalContext();
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();
  const { getReadableEntityName } = useGetReadableEntityName();
  const t = useT();
  const { mutateAsync } = usePostV2ExportImage();

  const handleDelete = () => {
    onDelete?.(data.uuid);
  };

  const openMopdalImageDetail = () => {
    openModal(
      ModalId.MODAL_IMAGE_DETAIL,
      <ModalImageDetails title="IMAGE DETAILS" onClose={() => closeModal(ModalId.MODAL_IMAGE_DETAIL)} />,
      true
    );
  };

  const handleDownload = async (): Promise<void> => {
    showLoader();
    try {
      const response = await mutateAsync({
        body: {
          imageUrl: data.fullImageUrl
        }
      });

      if (!response) {
        console.error("No response received from the server.");
        openNotification("error", t("Error!"), t("No response received from the server."));
        return;
      }

      const blob = new Blob([response], { type: "image/jpeg" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "image.jpg";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      hideLoader();
      openNotification("success", t("Success!"), t("Image downloaded successfully"));
    } catch (error) {
      console.error("Download error:", error);
      hideLoader();
    }
  };

  const galeryMenu: MenuItemProps[] = [
    {
      id: "1",
      render: () => (
        <Text variant="text-12-bold" className="pr-3">
          {t("Edit Attributes")}
        </Text>
      ),
      onClick: openMopdalImageDetail
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
    {
      id: "3",
      render: () => (
        <Text variant="text-12-bold" className="pr-3">
          {t("Make Cover")}
        </Text>
      )
    },
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
  ];

  return (
    <div {...rest} className={classNames("relative overflow-hidden rounded-xl bg-background", className)}>
      <ImageWithChildren
        imageSrc={{
          src: data.thumbnailImageUrl,
          height: 211,
          width: 1440
        }}
        isGeotagged={data.isGeotagged}
        className="h-[226px] rounded-t-xl"
      >
        <div className="flex justify-between p-3">
          {/* Left */}
          {!data.isPublic && <Icon name={IconNames.LOCK_CIRCLE} height={32} width={32} className="fill-neutral-700" />}

          {/* Right */}

          <div className="ml-auto flex items-center">
            <Menu menu={galeryMenu} placement={MENU_PLACEMENT_BOTTOM_RIGHT}>
              <Icon
                name={IconNames.ELIPSES}
                className="h-8 w-8 rotate-90 cursor-pointer rounded-full bg-[#6f6d6d80] p-1 text-white hover:text-primary"
              ></Icon>
            </Menu>
          </div>
        </div>
      </ImageWithChildren>

      <div className="p-4 text-darkCustom">
        <div className="flex items-center justify-between gap-1">
          <Text variant="text-14-bold" className="flex items-center gap-1">
            Uploaded via:{" "}
            <Text variant="text-14-light" className="capitalize">
              {getReadableEntityName(data?.raw?.model_name as SingularEntityName, true)}
            </Text>
          </Text>
          <button
            className="rounded-lg p-1 text-darkCustom hover:bg-grey-800 hover:text-primary"
            onClick={openMopdalImageDetail}
          >
            <Icon name={IconNames.EDIT} height={24} width={24} className="" />
          </button>
        </div>
        <Text variant="text-14-bold" className="flex items-center gap-1">
          Date uploaded:{" "}
          <Text variant="text-14-light" className="capitalize">
            {format(new Date(Date.parse(data.raw?.created_date)), "dd/MM/Y")}
          </Text>
        </Text>
        <Text variant="text-14-bold" className="flex items-center gap-1">
          Visibility:{" "}
          <Text variant="text-14-light" className="capitalize">
            {data.isPublic ? "Public" : "Private"}
          </Text>
        </Text>
      </div>
    </div>
  );
};

export default ImageGalleryItem;
