import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Navigation } from "swiper/modules";
import { twMerge as tw } from "tailwind-merge";

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
  WrapperClassName?: string;
}

const ModalImageGallery: FC<ModalImageGalleryProps> = ({
  primaryButtonProps,
  secondaryButtonProps,
  WrapperClassName,
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

  return ReactDOM.createPortal(
    <div className={tw("fixed left-0 top-0 z-50 flex h-screen w-screen bg-black bg-opacity-50", WrapperClassName)}>
      <ModalBaseImageGallery {...rest}>
        <header className="mb-6 flex w-full items-center justify-between">
          <div className="flex items-center gap-7">
            {tabItems.map(item => (
              <Button key={item.id} variant="text" onClick={() => setSelectedTab(item.id)}>
                <Text
                  variant="text-16-light"
                  className={classNames("text-darkCustom border-b-2 border-transparent pb-3", {
                    "!border-darkCustom !font-bold": selectedTab === item.id
                  })}
                >
                  {item.title}
                </Text>
              </Button>
            ))}
          </div>
          <button onClick={onClose} className="hover:bg-grey-800 ml-2 rounded p-1">
            <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
          </button>
        </header>
        <div className="flex h-full max-h-[calc(100%_-_62px)] w-full gap-6">
          <div className="flex-[2] overflow-auto">
            <div className="grid-col-2 grid grid-flow-row auto-rows-[100px] gap-4 overflow-auto">
              {currentTab.images.map((image: ImageItem, index: number) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={classNames(
                    "bg-primary-200 h-full overflow-hidden rounded-xl border-2 border-transparent",
                    {
                      "col-span-2 row-span-2": (index + 1) % 3 === 0,
                      "!border-black": selectedImage === index
                    }
                  )}
                >
                  <ImageWithPlaceholder alt={t("Image not available")} imageUrl={image.src} />
                </button>
              ))}
              {currentTab.images.length === 0 && (
                <>
                  <div
                    className={classNames("bg-primary-200 h-full rounded-xl border-2 !border-black border-transparent")}
                  />
                  <div className={classNames("bg-primary-200 h-full rounded-xl border-2 border-transparent")} />
                  <div
                    className={classNames(
                      "bg-primary-200 col-span-2 row-span-2 h-full rounded-xl border-2  border-transparent"
                    )}
                  />
                  <div className={classNames("bg-primary-200 h-full rounded-xl border-2 border-transparent")} />
                  <div className={classNames("bg-primary-200 h-full rounded-xl border-2 border-transparent")} />
                  <div
                    className={classNames(
                      "bg-primary-200 col-span-2 row-span-2 h-full rounded-xl border-2  border-transparent"
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
                selectedImage={selectedImage}
                carouselItem={item => (
                  <div className="relative h-full px-24">
                    <div className="bg-blueCustom-200 wide:max-w-[500px] absolute left-[120px] top-[24px] z-10 flex max-w-[250px] flex-col items-start justify-center gap-[2px] rounded-xl border border-white p-3 lg:max-w-[350px]">
                      <Text variant="text-12-bold" className="max-w-full break-words text-black">
                        {currentImage?.title}
                      </Text>
                      <Text variant="text-12-light" className="text-black">
                        {currentImage?.dateCreated}
                      </Text>
                    </div>
                    <div className="wide:max-w-[500px] absolute right-[120px] top-[24px] z-10 flex max-w-[250px] items-center justify-center rounded-xl bg-red-100 px-3 py-[2px] lg:max-w-[350px]">
                      <Text variant="text-12-semibold" className="text-red-200">
                        {currentImage?.geoTag}
                      </Text>
                    </div>
                    <ImageWithPlaceholder
                      className="bg-primary-200 h-full rounded-xl"
                      alt={t("Image not available")}
                      imageUrl={item.src}
                    />
                    <div className="bg-darkCustom absolute bottom-[24px] left-[calc(50%_-_32px)] z-10 flex items-center justify-center rounded-xl px-[8px] py-[5px]">
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
              <div className="bg-primary-200 flex h-full w-full items-center justify-center"></div>
            )}
          </div>
        </div>
      </ModalBaseImageGallery>
    </div>,
    document.body
  );
};

export default ModalImageGallery;
