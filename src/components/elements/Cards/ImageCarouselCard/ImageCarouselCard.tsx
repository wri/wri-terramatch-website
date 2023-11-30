import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useRef, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Carousel from "@/components/extensive/Carousel/Carousel";

import ImageWithPlaceholder from "../../ImageWithPlaceholder/ImageWithPlaceholder";

export type ImageCarouselItem = {
  title: string;
  date: string;
  url: string | undefined;
};

export interface ImageCarouselCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  items: ImageCarouselItem[];
}

const ImageCarouselCard: FC<ImageCarouselCardProps> = ({ items, className, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [currentImage, setCurrentImage] = useState<ImageCarouselItem>(items[0]);
  const [slidesPerView, setSlidesPerView] = useState<number>(5);

  /** Select focused image */
  const handleImageClick = (title: string) => {
    setCurrentImage(items.find(item => item.title === title) ?? items[0]);
  };

  const handleResize = () => {
    if (!ref.current) return;

    setSlidesPerView(Math.floor(ref.current.clientWidth / 70) - 1);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize();
  }, []);

  return (
    <div {...rest} className={classNames("rounded-lg p-8 shadow", className)}>
      <ImageWithPlaceholder imageUrl={currentImage.url} alt="" className="!h-44 rounded" />

      <Text variant="text-bold-subtitle-500" className="mt-3">
        {currentImage.title}
      </Text>

      <Text variant="text-light-subtitle-400" className="mb-3">
        {currentImage.date}
      </Text>

      <div ref={ref}>
        <Carousel
          carouselItem={item => (
            <ImageWithPlaceholder
              key={item.url}
              imageUrl={item.url}
              alt={item.title}
              placeholderIconSize={24}
              className={classNames(
                "!h-[70px] !w-[70px] cursor-pointer rounded-2xl border-[3.75px] hover:border-primary-500",
                item === currentImage ? "border-primary-500" : "border-white"
              )}
              onClick={() => handleImageClick(item.title)}
            />
          )}
          items={items}
          slidesPerView={slidesPerView}
          swiperButtonsClassName="!mt-0"
          hidePaginationBullet
          smallSwiperButtons
          buttonsOutside
        />
      </div>
    </div>
  );
};

export default ImageCarouselCard;
