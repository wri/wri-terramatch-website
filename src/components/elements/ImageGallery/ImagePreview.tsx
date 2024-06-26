import Link from "next/link";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import ReactDOM from "react-dom";
import { twMerge as tw } from "tailwind-merge";

import IconButton from "@/components/elements/IconButton/IconButton";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import ImageWithPlaceholder from "../ImageWithPlaceholder/ImageWithPlaceholder";
import { ImageGalleryItemData } from "./ImageGalleryItem";

export interface ImageGalleryPreviewerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: Omit<ImageGalleryItemData, "label" | "value" | "isPublic" | "thumbnailImageUrl"> & { label?: string };
  onCLose?: () => void;
  backdropClassName?: string;
  WrapperClassName?: string;
}

const ImageGalleryPreviewer: FC<ImageGalleryPreviewerProps> = ({
  data,
  onCLose,
  className,
  WrapperClassName,
  backdropClassName,
  ...rest
}) => {
  return ReactDOM.createPortal(
    <div className={tw("fixed top-0 left-0 z-50 flex h-screen w-screen bg-black bg-opacity-50", WrapperClassName)}>
      <div {...rest} className={tw("m-auto h-[80vh] w-[80vw] overflow-hidden rounded-lg", className)}>
        {/* Controls */}
        <div className="flex items-center justify-between bg-white px-8 py-3.5">
          {/* Left */}
          <div className="flex items-center">
            <Link href={data.downloadUrl ?? data.fullImageUrl} target="_blank" className="mr-2.5">
              <Icon name={IconNames.DOWNLOAD_CIRCLE} height={32} width={32} className="fill-primary-500" />
            </Link>
          </div>

          {/* Right */}
          <IconButton
            iconProps={{
              name: IconNames.X_CIRCLE,
              width: 32,
              height: 32,
              className: "fill-neutral-1000"
            }}
            onClick={onCLose}
          />
        </div>

        {/* Preview */}
        <ImageWithPlaceholder imageUrl={data.fullImageUrl} alt={data.label || ""} />
      </div>
    </div>,
    document.body
  );
};

export default ImageGalleryPreviewer;
