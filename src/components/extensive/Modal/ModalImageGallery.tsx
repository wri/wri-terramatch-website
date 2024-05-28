import classNames from "classnames";
import { FC, useState } from "react";
import { Navigation } from "swiper";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import ImageWithPlaceholder from "@/components/elements/ImageWithPlaceholder/ImageWithPlaceholder";
import Text from "@/components/elements/Text/Text";

import Carousel from "../Carousel/Carousel";
import Icon, { IconNames } from "../Icon/Icon";
import { ModalBaseProps, ModalProps } from "./Modal";

export const ModalBaseImageGallery: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "margin-4 z-50 m-auto flex h-[80%] max-h-full w-[80vw] flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white p-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface ImageItem {
  id: string;
  src: string;
}

export interface TabImagesItem {
  id: string;
  title: string;
  images: ImageItem[];
}

export interface ModalImageGalleryProps extends ModalProps {
  tabItems: TabImagesItem[];
  onCLose: () => void;
}

const ModalImageGallery: FC<ModalImageGalleryProps> = ({
  primaryButtonProps,
  secondaryButtonProps,
  children,
  tabItems,
  onCLose,
  ...rest
}) => {
  const [selectedTab, setSelectedTab] = useState(tabItems[0].id);
  const [selectecImage, setSelectecImage] = useState(0);

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
        <button onClick={onCLose} className="ml-2 rounded p-1 hover:bg-grey-800">
          <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
        </button>
      </header>
      <div className="flex h-full max-h-[calc(100%_-_62px)] w-full gap-6">
        <div className="flex-[2] overflow-auto">
          <div className="grid-col-2 grid grid-flow-row auto-rows-[100px] gap-4 overflow-auto">
            {tabItems
              .find(tab => tab.id === selectedTab)
              ?.images.map((image: ImageItem, index: number) => (
                <ImageWithPlaceholder
                  key={image.id}
                  className={classNames("h-full rounded-xl border-2 border-transparent bg-primary-200", {
                    "col-span-2 row-span-2": (index + 1) % 3 === 0,
                    "!border-black": selectecImage === index
                  })}
                  alt={"image no available"}
                  imageUrl={image.src}
                ></ImageWithPlaceholder>
              ))}
          </div>
        </div>

        <div className="flex-[5] overflow-hidden rounded-xl ">
          <Carousel
            className="h-full"
            swiperClassName="h-full"
            swiperSlideClassName="h-full"
            setSelectecImage={setSelectecImage}
            carouselItem={item => {
              return (
                <div className="relative h-full px-24">
                  <div className="absolute left-[calc(50%_-_32px)] bottom-[24px] z-10 flex items-center justify-center rounded-xl bg-darkCustom py-[5px] px-[8px]">
                    <Text variant="text-13" className="text-white">
                      {selectecImage + 1} of {tabItems.find(tab => tab.id === selectedTab)?.images.length}
                    </Text>
                  </div>
                  <ImageWithPlaceholder
                    className="h-full rounded-xl bg-primary-200"
                    alt={"image no available"}
                    imageUrl={item.src}
                  ></ImageWithPlaceholder>
                </div>
              );
            }}
            items={tabItems.find(tab => tab.id === selectedTab)?.images || []}
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={10}
          />
        </div>
      </div>
    </ModalBaseImageGallery>
  );
};

export default ModalImageGallery;
