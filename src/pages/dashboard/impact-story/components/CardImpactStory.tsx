import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { CARD_IMPACT_STORY_MOCKED_DATA } from "../../mockedData/impactStory";

const CardImpactStory = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const t = useT();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="-ml-2 flex flex-1 overflow-visible">
      <div className="mt-5 flex max-h-[62vh] min-h-0 flex-1 overflow-scroll pb-4 pl-2 pr-2 duration-500 lg:mt-8">
        <div className="grid h-max w-full grid-cols-2 gap-x-10 gap-y-10 pb-6 mobile:grid-cols-1 mobile:gap-y-6 mobile:pb-4">
          {CARD_IMPACT_STORY_MOCKED_DATA.map((item, index) => {
            return (
              <div
                key={index}
                className={`group rounded-2xl pb-7 transition-shadow duration-300 hover:bg-white ${
                  hoveredIndex === index ? "shadow-monitored" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={item.image ?? "/images/no-image-available.png"}
                  alt={item.title}
                  className={classNames(
                    "h-[39vh] w-full rounded-2xl object-cover ",
                    "mobile:h-[216px] mobile:rounded-lg"
                  )}
                />
                <div className="w-full px-0 transition-all duration-300 group-hover:px-4">
                  <div className="h-[147px] lg:h-[167px] wide:h-[180px] mobile:h-auto">
                    <Text
                      variant={isMobile ? "text-16-bold" : "text-20-bold"}
                      className="two-line-text mt-6 leading-[normal] transition-colors"
                    >
                      {t(item.title)}
                    </Text>
                    <Text
                      variant={isMobile ? "text-14-light" : "text-16-light"}
                      className="mt-3 flex items-center gap-1.5 capitalize text-grey-700"
                    >
                      <Icon name={IconNames.BRIEFCASE} className="h-4.5 w-4.5" /> {item.organization} Organization
                    </Text>
                    <Text
                      variant={isMobile ? "text-14-light" : "text-16-light"}
                      className="flex items-center gap-1.5 capitalize text-grey-700"
                    >
                      <Icon name={IconNames.PIN} className="h-4.5 w-4.5" /> {item.country}
                    </Text>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => {
                        return (
                          <Text
                            variant="text-12"
                            className="rounded bg-grey-500 bg-opacity-10 py-1 px-1.5 capitalize leading-[normal] text-grey-500"
                            as="span"
                            key={index}
                          >
                            {t(tag)}
                          </Text>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      router.push(`/dashboard/impact-story/${item.uuid}`);
                    }}
                    className="text-18-semibold group/button mt-3.5 flex items-center gap-2 hover:text-primary"
                  >
                    {t("Read story")}
                    <Icon
                      name={IconNames.ARROW_UP_RIGHT}
                      className="h-3 w-3 transition-transform delay-100 duration-100 group-hover/button:rotate-45 lg:h-4 lg:w-4 wide:h-5 wide:w-5"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CardImpactStory;
