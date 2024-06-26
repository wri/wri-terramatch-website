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
    <div {...rest} className={classNames("relative overflow-hidden rounded-lg border border-neutral-200", className)}>
      <ImageWithChildren
        imageSrc={{
          src: data.thumbnailImageUrl,
          height: 211,
          width: 1440
        }}
        className="m-2 h-[211px] w-[calc(100%-16px)] rounded-lg"
      >
        <div className="flex justify-between p-3">
          {/* Left */}
          {!data.isPublic && <Icon name={IconNames.LOCK_CIRCLE} height={32} width={32} className="fill-neutral-700" />}

          {/* Right */}
          <div className="ml-auto flex items-center">
            <Link href={data.downloadUrl ?? data.fullImageUrl} target="_blank" className="z-10 mr-2.5">
              <Icon
                name={IconNames.DOWNLOAD_CIRCLE}
                height={32}
                width={32}
                className="fill-primary-500 hover:opacity-60"
              />
            </Link>

            <IconButton
              iconProps={{
                name: IconNames.TRASH_CIRCLE,
                width: 32,
                height: 32,
                className: "fill-error"
              }}
              onClick={handleDelete}
              className="z-10 hover:opacity-60"
            />
          </div>
        </div>
      </ImageWithChildren>

      <div className="px-2 py-4">
        <Text variant="text-16-bold" className="flex items-center gap-1">
          {data.label.split(":")[0]}:<Text variant="text-16-light">{data.label.split(":")[1]}</Text>
        </Text>

        {data.subtitle && (
          <Text variant="text-16-bold" className="flex items-center gap-1">
            {data.subtitle.split(":")[0]}:<Text variant="text-16-light">{data.subtitle.split(":")[1]}</Text>
          </Text>
        )}
      </div>

      <div className="absolute inset-0 cursor-pointer" onClick={handlePreview} />
    </div>
  );
};

export default ImageGalleryItem;
