import { Card } from "@mui/material";
import classNames from "classnames";
import { format } from "date-fns";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import { ImageGalleryItemData } from "@/components/elements/ImageGallery/ImageGalleryItem";
import ImageWithChildren from "@/components/elements/ImageWithChildren/ImageWithChildren";
import Menu, { MenuItemProps } from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_RIGHT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface GalleryImageItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: ImageGalleryItemData;
}

const GalleryImageItem: FC<GalleryImageItemProps> = ({ data, className }) => {
  const galeryMenu: MenuItemProps[] = [
    {
      id: "1",
      render: () => (
        <Text variant="text-12-bold" className="pr-3">
          Edit Attributes
        </Text>
      )
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-12-bold" className="pr-3">
          Download
        </Text>
      )
    },
    {
      id: "3",
      render: () => (
        <Text variant="text-12-bold" className="pr-3">
          Make Cover
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
          Delete
        </Text>
      )
    }
  ];

  return (
    <Card
      variant="outlined"
      className={classNames("relative overflow-hidden !rounded-xl !border-0 !bg-background", className)}
    >
      <ImageWithChildren
        imageSrc={{
          src: data.thumbnailImageUrl,
          height: 211,
          width: 1440
        }}
        className="h-[226px] rounded-t-xl"
      >
        <div className="flex justify-between p-3">
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
        <Text variant="text-14-bold" className="flex items-center gap-1">
          Uploaded via:{" "}
          <Text variant="text-14-light" className="capitalize">
            {data.raw?.model_name?.replaceAll("-", " ")}
          </Text>
        </Text>
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
    </Card>
  );
};

export default GalleryImageItem;
