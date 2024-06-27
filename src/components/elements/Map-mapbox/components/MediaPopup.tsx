import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import ImagePreview from "../../ImageGallery/ImagePreview";
import ImageWithPlaceholder from "../../ImageWithPlaceholder/ImageWithPlaceholder";

const client = new QueryClient();

export const MediaPopup = ({
  uuid,
  name,
  created_date,
  file_url,
  onClose
}: {
  uuid: string;
  name: string;
  created_date: string;
  file_url: string;
  onClose: () => void;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const t = useT();
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

          <div className="w-full overflow-hidden">
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
