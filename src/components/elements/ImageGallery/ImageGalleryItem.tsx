import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import { MenuItemProps } from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

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
  isPublic: boolean;
  raw?: Record<any, any>;
};

export interface ImageGalleryItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: ImageGalleryItemData;
  onClickGalleryItem?: (data: ImageGalleryItemData) => void;
  onDelete?: (id: string) => void;
}

const ImageGalleryItem: FC<ImageGalleryItemProps> = ({ data, onClickGalleryItem, onDelete, className, ...rest }) => {
  const t = useT();

  const handleDelete = () => {
    onDelete?.(data.uuid);
  };

  const galeryMenu: MenuItemProps[] = [
    {
      id: "1",
      render: () => (
        <Text variant="text-12-bold" className="pr-3">
          {t("Edit Attributes")}
        </Text>
      )
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-12-bold" className="pr-3">
          {t("Download")}
        </Text>
      )
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

      <div className="p-4">
        <div className="flex items-center justify-between gap-1">
          <Text variant="text-14-bold" className="flex items-center gap-1 text-darkCustom">
            {data.label.split(":")[0]}:<Text variant="text-14-bold">{data.label.split(":")[1]}</Text>
          </Text>
          <div className="rounded-lg p-1 text-darkCustom hover:bg-grey-800 hover:text-primary">
            <Icon name={IconNames.EDIT} height={24} width={24} className="" />
          </div>
        </div>

        {data.subtitle && (
          <Text variant="text-14-light" className="flex items-center gap-1 text-darkCustom-60">
            {data.subtitle.split(":")[0]}:<Text variant="text-14-light">{data.subtitle.split(":")[1]}</Text>
          </Text>
        )}
      </div>
    </div>
  );
};

export default ImageGalleryItem;
