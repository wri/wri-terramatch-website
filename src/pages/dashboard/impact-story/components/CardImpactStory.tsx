import { useRouter } from "next/router";
import { useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { CARD_IMPACT_STORY_MOCKED_DATA } from "../../mockedData/impactStory";

const CardImpactStory = () => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="mt-5 flex max-h-[62vh] min-h-0 flex-1 overflow-auto pb-4 duration-500  hover:px-2 lg:mt-8">
      <div className="grid h-max w-full grid-cols-2 gap-x-10 gap-y-10 pb-6">
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
                className="h-[39vh] w-full rounded-2xl object-cover"
              />
              <div className="w-full px-0 transition-all duration-300 group-hover:px-4">
                <Text variant="text-20-bold" className="mt-6 leading-[normal] transition-colors">
                  {item.title}
                </Text>
                <Text variant="text-16-light" className="mt-2 leading-[normal] text-grey-500">
                  Youth and Women for Opportunities in&nbsp;
                  <Text variant="text-18-light" className="capitalize leading-[normal]" as="span">
                    {item.country}
                  </Text>
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
                        {tag}
                      </Text>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    router.push(`/dashboard/impact-story/${item.uuid}`);
                  }}
                  className="text-18-semibold group/button mt-3.5 flex items-center gap-2 hover:text-primary"
                >
                  Read story
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
  );
};

export default CardImpactStory;
