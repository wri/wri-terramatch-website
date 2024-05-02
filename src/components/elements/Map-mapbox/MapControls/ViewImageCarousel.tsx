import { t } from "@transifex/native";
import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";
import { Navigation } from "swiper";

import Carousel from "@/components/extensive/Carousel/Carousel";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { dataImageGallery } from "@/components/extensive/Modal/ModalContent/MockedData";
import ModalImageGallery from "@/components/extensive/Modal/ModalImageGallery";
import { useModalContext } from "@/context/modal.provider";

import Text from "../../Text/Text";

const ViewImageCarousel = ({
  viewImages,
  setViewImages
}: {
  viewImages: boolean;
  setViewImages: Dispatch<SetStateAction<boolean>>;
}) => {
  const { openModal, closeModal } = useModalContext();

  const openFormModalHandlerImageGallery = () => {
    openModal(<ModalImageGallery onCLose={closeModal} tabItems={dataImageGallery} title={""} />);
  };

  return (
    <div className="relative">
      <div
        className={classNames("absolute right-1/2 bottom-0 h-[250px] w-[200px] rounded-lg bg-white p-2", {
          hidden: !viewImages
        })}
      >
        <div className="relative h-[calc(100%_-_48px)]">
          <Carousel
            className="test mb-2 h-full"
            swiperClassName="h-full"
            swiperSlideClassName="h-full"
            items={dataImageGallery[0].images}
            carouselItem={item => <img className="h-full" alt="" src={item.src} />}
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
      <button
        className="text-12-bold h-fit rounded-lg bg-white px-5 py-2 shadow hover:bg-neutral-200"
        onClick={() => setViewImages(!viewImages)}
      >
        {t("View Images")}
      </button>
    </div>
  );
};

export default ViewImageCarousel;
