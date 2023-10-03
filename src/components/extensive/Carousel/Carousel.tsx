import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useT } from "@transifex/react";
import classNames from "classnames";
import { When } from "react-if";
import { Navigation, Pagination, SwiperOptions } from "swiper";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";

import Icon, { IconNames } from "../Icon/Icon";

export interface CarouselProps<T> extends SwiperProps {
  items: T[];
  carouselItem: (item: T, index: number) => JSX.Element | null;
  className?: string;
  swiperClassName?: string;
  hidePaginationBullet?: boolean;
  breakpoints?: CarouselBreakPoints;
  buttonsOutside?: boolean;
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
  hidePaginationBullet,
  buttonsOutside = false,
  ...swiperProps
}: CarouselProps<T>) => {
  const t = useT();
  return (
    <div className={`relative mx-auto ${className}`}>
      <div className="flex items-center justify-center gap-4">
        <button
          className={classNames("swiper-button-prev", buttonsOutside ? "!static" : "!absolute left-0")}
          aria-label={t("Previous")}
        >
          <Icon name={IconNames.CHEVRON_LEFT} className="mr-1 fill-primary-400" />
        </button>
        <Swiper
          className={classNames(swiperClassName, "flex-1")}
          modules={[Navigation, Pagination]}
          spaceBetween={25}
          slidesPerView={3}
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
            <SwiperSlide key={i}>{carouselItem(item, i)}</SwiperSlide>
          ))}
        </Swiper>

        <button
          className={classNames("swiper-button-next", buttonsOutside ? "!static" : "!absolute right-0")}
          aria-label={t("Next")}
        >
          <Icon name={IconNames.CHEVRON_RIGHT} className="ml-1 fill-primary-400" />
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
