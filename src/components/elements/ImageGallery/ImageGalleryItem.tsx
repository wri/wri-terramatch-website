import classNames from "classnames";
import Link from "next/link";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import IconButton from "@/components/elements/IconButton/IconButton";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import ImageWithChildren from "../ImageWithChildren/ImageWithChildren";

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
  const handlePreview = () => {
    onClickGalleryItem?.(data);
  };

  const handleDelete = () => {
    onDelete?.(data.uuid);
  };

  return (
    <div {...rest} className={classNames("relative overflow-hidden rounded-lg shadow", className)}>
      <ImageWithChildren
        imageSrc={{
          src: data.thumbnailImageUrl,
          height: 211,
          width: 1440
        }}
        className="h-[211px] w-full"
      >
        <div className="flex justify-between p-3">
          {/* Left */}
          {!data.isPublic && <Icon name={IconNames.LOCK_CIRCLE} height={32} width={32} className="fill-neutral-700" />}

          {/* Right */}
          <div className="ml-auto flex items-center">
            <Link href={data.downloadUrl ?? data.fullImageUrl} target="_blank" className="z-10 mr-2.5">
              <Icon name={IconNames.DOWNLOAD_CIRCLE} height={32} width={32} className="fill-primary-500" />
            </Link>

            <IconButton
              iconProps={{
                name: IconNames.TRASH_CIRCLE,
                width: 32,
                height: 32,
                className: "fill-error"
              }}
              onClick={handleDelete}
              className="z-10"
            />
          </div>
        </div>
      </ImageWithChildren>

      <div className="px-8 py-4">
        <Text variant="text-bold-body-300">{data.label}</Text>

        {data.subtitle && (
          <Text variant="text-light-body-300" className="mt-2">
            {data.subtitle}
          </Text>
        )}
      </div>

      <div className="absolute inset-0 cursor-pointer" onClick={handlePreview} />
    </div>
  );
};

export default ImageGalleryItem;
