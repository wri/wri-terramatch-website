import Link from "next/link";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import IconButton from "@/components/elements/IconButton/IconButton";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useModalContext } from "@/context/modal.provider";

import ImageWithPlaceholder from "../ImageWithPlaceholder/ImageWithPlaceholder";
import { ImageGalleryItemData } from "./ImageGalleryItem";

export interface ImageGalleryPreviewerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: Omit<ImageGalleryItemData, "label" | "value" | "isPublic" | "thumbnailImageUrl"> & { label?: string };
  onDelete?: (uuid: string) => void;
  backdropClassName?: string;
}

const ImageGalleryPreviewer: FC<ImageGalleryPreviewerProps> = ({
  data,
  onDelete,
  className,
  backdropClassName,
  ...rest
}) => {
  const { closeModal } = useModalContext();

  return (
    <div {...rest} className={twMerge("h-[640px] w-full max-w-7xl overflow-hidden rounded-lg", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between bg-white px-8 py-3.5">
        {/* Left */}
        <div className="flex items-center">
          <Link href={data.downloadUrl ?? data.fullImageUrl} target="_blank" className="mr-2.5">
            <Icon name={IconNames.DOWNLOAD_CIRCLE} height={32} width={32} className="fill-primary-500" />
          </Link>

          {onDelete && (
            <IconButton
              iconProps={{
                name: IconNames.TRASH_CIRCLE,
                width: 32,
                height: 32,
                className: "fill-error"
              }}
              onClick={() => onDelete?.(data.uuid)}
            />
          )}
        </div>

        {/* Right */}
        <IconButton
          iconProps={{
            name: IconNames.X_CIRCLE,
            width: 32,
            height: 32,
            className: "fill-neutral-1000"
          }}
          onClick={closeModal}
        />
      </div>

      {/* Preview */}
      <ImageWithPlaceholder imageUrl={data.fullImageUrl} alt={data.label || ""} />
    </div>
  );
};

export default ImageGalleryPreviewer;
