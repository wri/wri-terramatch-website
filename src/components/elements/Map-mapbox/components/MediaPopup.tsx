import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { Navigation } from "swiper";

import Text from "@/components/elements/Text/Text";
import Carousel from "@/components/extensive/Carousel/Carousel";
import { dataImageGallery } from "@/components/extensive/Modal/ModalContent/MockedData";
import ModalImageGallery from "@/components/extensive/Modal/ModalImageGallery";
import { useModalContext } from "@/context/modal.provider";

import ImageWithPlaceholder from "../../ImageWithPlaceholder/ImageWithPlaceholder";

const client = new QueryClient();

export const MediaPopup = ({
  uuid,
  name,
  created_date,
  file_url
}: {
  uuid: string;
  name: string;
  created_date: string;
  file_url: string;
}) => {
  const { openModal, closeModal } = useModalContext();

  const openFormModalHandlerImageGallery = () => {
    openModal(<ModalImageGallery onClose={closeModal} tabItems={dataImageGallery} title={""} />);
  };
  const t = useT();
  return (
    <QueryClientProvider client={client}>
      <div className="flex h-full flex-col gap-2 bg-white">
        <div className="w-full flex-1">
          <Carousel
            className="test mb-2 h-full bg-red"
            swiperClassName="h-full"
            swiperSlideClassName="h-full"
            items={[
              {
                id: uuid,
                src: file_url,
                title: name,
                dateCreated: created_date
              }
            ]}
            carouselItem={item => (
              <ImageWithPlaceholder className="h-full" alt={t("Image not available")} imageUrl={item.src} />
            )}
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={10}
            hidePaginationBullet
            smallSwiperButtons
          />
        </div>

        <button onClick={() => openFormModalHandlerImageGallery()}>
          <Text variant="text-12-bold" className="text-start">
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
        </button>
      </div>
    </QueryClientProvider>
  );
};