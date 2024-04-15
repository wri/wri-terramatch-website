import classNames from "classnames";
import { FC, useState } from "react";
import { Navigation } from "swiper";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Carousel from "../Carousel/Carousel";
import Icon, { IconNames } from "../Icon/Icon";
import { ModalBaseProps, ModalProps } from "./Modal";

export const ModalBaseImageGallery: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "margin-4 z-50 m-auto flex h-full max-h-full w-[1200px] flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white p-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface TabImagesItem extends ModalProps {
  id: string;
  title: string;
  images: string[];
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
        <Button variant="transparent-toggle" onClick={onCLose}>
          <Icon name={IconNames.CROSS} width={24} height={24} />
        </Button>
      </header>
      <div className="flex h-full max-h-[calc(100%_-_62px)] w-full gap-6">
        <div className="flex-[2] overflow-auto">
          <div className="grid-col-2 grid grid-flow-row auto-rows-[100px] gap-4 overflow-auto">
            <div className="flex items-center justify-center rounded-xl bg-primary-200">No Image Available</div>
            <div className="flex items-center justify-center rounded-xl bg-primary-200">No Image Available</div>
            <div className="col-span-2 row-span-2 flex items-center justify-center rounded-xl bg-primary-200">
              {" "}
              No Image Available{" "}
            </div>
            <div className="flex items-center justify-center rounded-xl bg-primary-200">No Image Available</div>
            <div className="flex items-center justify-center rounded-xl bg-primary-200">No Image Available</div>
          </div>
        </div>

        <div className="flex-[5] overflow-hidden rounded-xl ">
          <Carousel
            className="h-full"
            swiperClassName="h-full"
            swiperSlideClassName="h-full"
            carouselItem={item => (
              <div className="h-full rounded px-24">
                <div className="h-full bg-primary-200">{item.key}</div>
              </div>
            )}
            items={[
              {
                key: 1
              },
              {
                key: 2
              },
              {
                key: 3
              },
              {
                key: 4
              },
              {
                key: 5
              }
            ]}
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
