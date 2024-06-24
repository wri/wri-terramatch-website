import { useT } from "@transifex/react";
import classNames from "classnames";
import React, { Dispatch, SetStateAction } from "react";
import { Navigation } from "swiper";

import Carousel from "@/components/extensive/Carousel/Carousel";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { dataImageGallery } from "@/components/extensive/Modal/ModalContent/MockedData";
import ModalImageGallery from "@/components/extensive/Modal/ModalImageGallery";
import { useModalContext } from "@/context/modal.provider";

import ImageWithPlaceholder from "../../ImageWithPlaceholder/ImageWithPlaceholder";
import Text from "../../Text/Text";

export const MiniGallery = ({
  viewImages,
  setViewImages
}: {
  viewImages: boolean;
  setViewImages: Dispatch<SetStateAction<boolean>>;
}) => {
  const { openModal, closeModal } = useModalContext();

  const openFormModalHandlerImageGallery = () => {
    openModal(<ModalImageGallery onClose={closeModal} tabItems={dataImageGallery} title={""} />);
  };
  const t = useT();
  return (
    <div
      className={classNames("absolute right-1/2 bottom-full h-[250px] w-[200px] rounded-lg bg-white p-2", {
        hidden: !viewImages
      })}
    >
      <div className="relative h-[calc(100%_-_48px)]">
        <Carousel
          className="test mb-2 h-full"
          swiperClassName="h-full"
          swiperSlideClassName="h-full"
          items={dataImageGallery[0].images}
          carouselItem={item => (
            <ImageWithPlaceholder className="h-full" alt={t("Image not available")} imageUrl={item.src} />
          )}
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={10}
          hidePaginationBullet
          smallSwiperButtons
        />
        <button
          onClick={() => setViewImages(false)}
          className="absolute right-1 top-1 z-10 rounded bg-grey-750 p-1 drop-shadow-md"
        >
          <Icon name={IconNames.CLEAR} className="h-4 w-4 text-darkCustom-100" />
        </button>
      </div>
      <button onClick={openFormModalHandlerImageGallery}>
        <Text variant="text-12-bold">TerraMatch Sample</Text>
        <Text variant="text-12-light"> December 29, 2023</Text>
      </button>
    </div>
  );
};
