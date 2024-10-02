import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import ImagePreview from "../../ImageGallery/ImagePreview";
import ImageWithPlaceholder from "../../ImageWithPlaceholder/ImageWithPlaceholder";
import Menu from "../../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../../Menu/MenuVariant";

const client = new QueryClient();

export const MediaPopup = ({
  uuid,
  name,
  created_date,
  file_url,
  onClose,
  handleDownload,
  coverImage,
  handleDelete,
  openModalImageDetail,
  isProjectPath
}: {
  uuid: string;
  name: string;
  created_date: string;
  file_url: string;
  onClose: () => void;
  handleDownload: () => void;
  coverImage: () => void;
  handleDelete: () => void;
  openModalImageDetail: () => void;
  isProjectPath: boolean;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const t = useT();

  const addMenuItems = [
    {
      id: "1",
      render: () => <Text variant="text-12-bold">{t("Edit Attributes")}</Text>,
      onClick: openModalImageDetail
    },
    {
      id: "2",
      render: () => <Text variant="text-12-bold">{t("Download")}</Text>,
      onClick: handleDownload
    },
    ...(isProjectPath
      ? [
          {
            id: "3",
            render: () => <Text variant="text-12-bold">{t("Make Cover")}</Text>,
            onClick: coverImage
          }
        ]
      : []),

    {
      id: "3.5",
      type: "line" as const,
      render: () => null
    },
    {
      id: "4",
      render: () => <Text variant="text-12-bold">{t("Delete")}</Text>,
      onClick: handleDelete
    }
  ];

  return (
    <>
      <QueryClientProvider client={client}>
        <div className="flex h-full w-full flex-col gap-2 bg-white" onClick={() => setOpenModal(!openModal)}>
          <div className="w-full flex-1">
            <ImageWithPlaceholder className="h-full" alt={t("Image not available")} imageUrl={file_url} />
          </div>
          <button
            className="absolute top-3 right-3 z-10 rounded bg-grey-200 p-1 leading-normal"
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
          >
            <Icon name={IconNames.CLEAR} className="h-3 w-3" />
          </button>

          <div className="flex gap-2">
            <div className="w-full overflow-hidden pt-1">
              <Text
                variant="text-12-bold"
                className="overflow-hidden text-ellipsis whitespace-nowrap text-start"
                title={name}
              >
                {name}
              </Text>
              <Text variant="text-12-light" className="text-start">
                {new Date(created_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC"
                })}
              </Text>
            </div>
            <Menu menu={addMenuItems} placement={MENU_PLACEMENT_RIGHT_BOTTOM} classNameContentMenu="!top-auto !gap-0	">
              <Icon
                name={IconNames.ELIPSES}
                className="h-7 w-7 rotate-90 cursor-pointer rounded-full bg-[#f4f4f4] p-1 text-black hover:text-primary"
              ></Icon>{" "}
            </Menu>
          </div>
        </div>
      </QueryClientProvider>

      <ImagePreview
        data={{
          uuid: uuid,
          fullImageUrl: file_url
        }}
        onCLose={() => setOpenModal(false)}
        WrapperClassName={openModal ? "" : "hidden"}
      />
    </>
  );
};
