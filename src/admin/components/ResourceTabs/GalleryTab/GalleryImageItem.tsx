import { Card } from "@mui/material";
import classNames from "classnames";
import { format } from "date-fns";
import Link from "next/link";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import { ImageGalleryItemData } from "@/components/elements/ImageGallery/ImageGalleryItem";
import ImageWithChildren from "@/components/elements/ImageWithChildren/ImageWithChildren";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface GalleryImageItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: ImageGalleryItemData;
}

const GalleryImageItem: FC<GalleryImageItemProps> = ({ data, className }) => {
  return (
    <Card variant="outlined" className={classNames("relative overflow-hidden", className)}>
      <ImageWithChildren
        imageSrc={{
          src: data.thumbnailImageUrl,
          height: 211,
          width: 1440
        }}
        className="h-[211px] w-full"
      >
        <div className="flex justify-between p-3">
          {/* Right */}
          <div className="ml-auto flex items-center">
            <Link href={data.downloadUrl ?? data.fullImageUrl} target="_blank" className="z-10 mr-2.5">
              <Icon name={IconNames.DOWNLOAD_CIRCLE} height={32} width={32} className="fill-primary-500" />
            </Link>
          </div>
        </div>
      </ImageWithChildren>

      <div className="px-8 py-4">
        <Text variant="text-bold-body-300">
          Uploaded via: <span className="capitalize">{data.raw?.model_name?.replaceAll("-", " ")}</span>
        </Text>
        <Text variant="text-bold-body-300">
          Created:{" "}
          <span className="capitalize">
            {format(new Date(Date.parse(data.raw?.created_date)), "dd/MM/yyyy HH:mm:ss")}
          </span>
        </Text>
        <Text variant="text-bold-body-300">
          Visibility: <span className="capitalize">{data.isPublic ? "Public" : "Private"}</span>
        </Text>
      </div>
    </Card>
  );
};

export default GalleryImageItem;
