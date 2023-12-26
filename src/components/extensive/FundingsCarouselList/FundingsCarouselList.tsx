import { sortBy } from "lodash";
import { When } from "react-if";
import { Navigation, Pagination } from "swiper";

import FundingCard, { FundingCardProps } from "@/components/elements/Cards/FundingCard/FundingCard";
import Text from "@/components/elements/Text/Text";

import Carousel from "../Carousel/Carousel";

export interface FundingCarouselListProps {
  title?: string;
  items: FundingCardProps[];
  className?: string;
}

const FundingCarouselList = (props: FundingCarouselListProps) => {
  return (
    <div className={props.className}>
      <When condition={props.title}>
        <Text variant="text-bold-headline-1000" className="mx-auto mb-4 max-w-[82vw] text-center">
          {props.title}
        </Text>
      </When>
      <Carousel
        swiperClassName="!p-4"
        items={sortBy(props.items, "status")}
        carouselItem={item => <FundingCard {...item} />}
        spaceBetween={32}
        slidesPerView={1}
        modules={[Navigation, Pagination]}
        buttonsOutside
        breakpoints={{
          // when window width is >= 860
          1000: {
            slidesPerView: 2
          },
          // when window width is >= 1280
          1390: {
            slidesPerView: 3
          }
        }}
      />
    </div>
  );
};

export default FundingCarouselList;
