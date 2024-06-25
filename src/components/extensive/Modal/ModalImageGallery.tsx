import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo, useState } from "react";
import { Navigation } from "swiper";

import Button from "@/components/elements/Button/Button";
import ImageWithPlaceholder from "@/components/elements/ImageWithPlaceholder/ImageWithPlaceholder";
import Text from "@/components/elements/Text/Text";

import Carousel from "../Carousel/Carousel";
import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseImageGallery } from "./ModalsBases";
export interface ImageItem {
  id: string;
  src: string;
  title: string;
  dateCreated: string;
  geoTag: string;
}

export interface TabImagesItem {
  id: string;
  title: string;
  images: ImageItem[];
}

export interface ModalImageGalleryProps extends ModalProps {
  tabItems: TabImagesItem[];
  onClose: () => void;
}

const ModalImageGallery: FC<ModalImageGalleryProps> = ({
  primaryButtonProps,
  secondaryButtonProps,
  children,
  tabItems,
  onClose,
  ...rest
}) => {
  const [selectedTab, setSelectedTab] = useState(tabItems[0].id);
  const [selectedImage, setSelectedImage] = useState(0);
  const t = useT();
  const [currentTab, currentImage] = useMemo(() => {
    const _currentTab = tabItems.find(tab => tab.id === selectedTab)!;
    const _currentImage = _currentTab.images[selectedImage];
    return [_currentTab, _currentImage];
  }, [tabItems, selectedTab, selectedImage]);

  return (
    <ModalBaseImageGallery {...rest}>
      <header className="mb-6 flex w-full items-center justify-between">
        <div className="flex items-center gap-7">
          {tabItems.map(item => (
            <Button key={item.id} variant="text" onClick={() => setSelectedTab(item.id)}>
              <Text
                variant="text-16-light"
                className={classNames("border-b-2 border-transparent pb-3 text-darkCustom", {
                  "!border-darkCustom !font-bold": selectedTab === item.id
                })}
              >
                {item.title}
              </Text>
            </Button>
          ))}
        </div>
        <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
          <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
        </button>
      </header>
      <div className="flex h-full max-h-[calc(100%_-_62px)] w-full gap-6">
        <div className="flex-[2] overflow-auto">
          <div className="grid-col-2 grid grid-flow-row auto-rows-[100px] gap-4 overflow-auto">
            {currentTab.images.map((image: ImageItem, index: number) => (
              <ImageWithPlaceholder
                key={image.id}
                className={classNames("h-full rounded-xl border-2 border-transparent bg-primary-200", {
                  "col-span-2 row-span-2": (index + 1) % 3 === 0,
                  "!border-black": selectedImage === index
                })}
                alt={t("Image not available")}
                imageUrl={image.src}
              ></ImageWithPlaceholder>
            ))}
            {currentTab.images.length === 0 && (
              <>
                <div
                  className={classNames("h-full rounded-xl border-2 border-transparent !border-black bg-primary-200")}
                />
                <div className={classNames("h-full rounded-xl border-2 border-transparent bg-primary-200")} />
                <div
                  className={classNames(
                    "col-span-2 row-span-2 h-full rounded-xl border-2 border-transparent  bg-primary-200"
                  )}
                />
                <div className={classNames("h-full rounded-xl border-2 border-transparent bg-primary-200")} />
                <div className={classNames("h-full rounded-xl border-2 border-transparent bg-primary-200")} />
                <div
                  className={classNames(
                    "col-span-2 row-span-2 h-full rounded-xl border-2 border-transparent  bg-primary-200"
                  )}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex-[5] overflow-hidden rounded-xl ">
          {currentTab.images.length > 0 && (
            <Carousel
              className="h-full"
              swiperClassName="h-full"
              swiperSlideClassName="h-full"
              setSelectedImage={setSelectedImage}
              carouselItem={item => (
                <div className="relative h-full px-24">
                  <div className="absolute left-[120px] top-[24px] z-10 flex max-w-[250px] flex-col items-start justify-center gap-[2px] rounded-xl border border-white bg-blueCustom-200 p-3 lg:max-w-[350px] wide:max-w-[500px]">
                    <Text variant="text-12-bold" className="max-w-full break-words text-black">
                      {currentImage?.title}
                    </Text>
                    <Text variant="text-12-light" className="text-black">
                      {currentImage?.dateCreated}
                    </Text>
                  </div>
                  <div className="absolute right-[120px] top-[24px] z-10 flex max-w-[250px] items-center justify-center rounded-xl bg-red-100 py-[2px] px-3 lg:max-w-[350px] wide:max-w-[500px]">
                    <Text variant="text-12-semibold" className="text-red-200">
                      {currentImage?.geoTag}
                    </Text>
                  </div>
                  <ImageWithPlaceholder
                    className="h-full rounded-xl bg-primary-200"
                    alt={t("Image not available")}
                    imageUrl={item.src}
                  />
                  <div className="absolute left-[calc(50%_-_32px)] bottom-[24px] z-10 flex items-center justify-center rounded-xl bg-darkCustom py-[5px] px-[8px]">
                    <Text variant="text-13" className="text-white">
                      {t("{selected} of {total}", {
                        selected: selectedImage + 1,
                        total: currentTab.images.length
                      })}
                    </Text>
                  </div>
                </div>
              )}
              items={currentTab.images ?? []}
              modules={[Navigation]}
              slidesPerView={1}
              spaceBetween={10}
            />
          )}
          {currentTab.images.length === 0 && (
            <div className="flex h-full w-full items-center justify-center bg-primary-200"></div>
          )}
        </div>
      </div>
    </ModalBaseImageGallery>
  );
};

export default ModalImageGallery;
