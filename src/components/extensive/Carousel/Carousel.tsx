import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { When } from "react-if";
import { Navigation, Pagination, SwiperOptions } from "swiper";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";

import Icon, { IconNames } from "../Icon/Icon";

export interface CarouselProps<T> extends SwiperProps {
  items: T[];
  carouselItem: (item: T, index: number) => JSX.Element | null;
  className?: string;
  swiperClassName?: string;
  swiperSlideClassName?: string;
  swiperButtonsClassName?: string;
  hidePaginationBullet?: boolean;
  breakpoints?: CarouselBreakPoints;
  selectedImage?: number;
  setSelectedImage?: (index: number) => void;
  buttonsOutside?: boolean;
  smallSwiperButtons?: boolean;
  numberSlidesPerView?: number | "auto";
}

export type CarouselBreakPoints = {
  [width: number]: SwiperOptions;
  [ratio: string]: SwiperOptions;
};

const Carousel = <T extends Record<any, any>>({
  breakpoints,
  items,
  carouselItem,
  className,
  swiperClassName,
  swiperSlideClassName,
  swiperButtonsClassName,
  hidePaginationBullet,
  selectedImage,
  setSelectedImage,
  buttonsOutside = false,
  numberSlidesPerView,
  smallSwiperButtons,
  ...swiperProps
}: CarouselProps<T>) => {
  const t = useT();

  const swiperButtonSize = smallSwiperButtons ? 12 : 24;
  const swiperRef = useRef<any | null>(null);
  const handleSlideChange = (swiper: { activeIndex: any; slideTo: any }) => {
    if (setSelectedImage) {
      setSelectedImage(swiper.activeIndex);
    }
  };

  useEffect(() => {
    if (selectedImage !== undefined && swiperRef.current) {
      swiperRef.current.slideTo(selectedImage);
    }
  }, [selectedImage]);

  return (
    <div className={classNames("relative mx-auto", className)}>
      <div className={classNames("flex h-full items-center justify-center", smallSwiperButtons ? "gap-1.5" : "gap-4")}>
        <button
          className={classNames(
            "swiper-button-prev",
            smallSwiperButtons ? "!h-8 !w-8" : "!h-12 !w-12",
            swiperButtonsClassName,
            buttonsOutside ? "!static" : "!absolute left-0"
          )}
          aria-label={t("Previous")}
        >
          <Icon
            name={IconNames.CHEVRON_LEFT}
            className={classNames("fill-white", smallSwiperButtons ? "mr-0.5" : "mr-1")}
            height={swiperButtonSize}
            width={swiperButtonSize}
          />
        </button>
        <Swiper
          onSwiper={swiper => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          className={classNames(swiperClassName, "flex-1")}
          modules={[Navigation, Pagination]}
          spaceBetween={smallSwiperButtons ? 8 : 25}
          slidesPerView={numberSlidesPerView || 3}
          navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            bulletActiveClass: "swiper-pagination-bullet-active"
          }}
          breakpoints={breakpoints}
          {...swiperProps}
        >
          {items.map((item, i) => (
            <SwiperSlide key={item.id} className={swiperSlideClassName}>
              {carouselItem(item, i)}
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className={classNames(
            "swiper-button-next",
            smallSwiperButtons ? "!h-8 !w-8" : "!h-12 !w-12",
            swiperButtonsClassName,
            buttonsOutside ? "!static" : "!absolute right-0"
          )}
          aria-label={t("Next")}
        >
          <Icon
            name={IconNames.CHEVRON_RIGHT}
            className={classNames("fill-white", smallSwiperButtons ? "ml-0.5" : "ml-1")}
            height={swiperButtonSize}
            width={swiperButtonSize}
          />
        </button>
      </div>
      <When condition={!hidePaginationBullet}>
        <div className="swiper-pagination !relative mt-8">
          <span className="swiper-pagination-bullet"></span>
        </div>
      </When>
    </div>
  );
};

export default Carousel;
