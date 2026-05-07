import { sortBy } from "lodash";
import { FC } from "react";
import { Navigation, Pagination } from "swiper";

import FundingCard, { FundingCardProps } from "@/components/elements/Cards/FundingCard/FundingCard";
import Text from "@/components/elements/Text/Text";

import Carousel from "../Carousel/Carousel";

type FundingCarouselListProps = {
  title?: string;
  items: FundingCardProps[];
  className?: string;
};

const FundingCarouselList: FC<FundingCarouselListProps> = props => (
  <div className={props.className}>
    {props.title != null && (
      <Text variant="text-36-bold" className="mx-auto mb-4 max-w-[82vw] text-center">
        {props.title}
      </Text>
    )}
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

export default FundingCarouselList;
