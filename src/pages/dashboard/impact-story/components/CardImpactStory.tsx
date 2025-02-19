import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface CardImpactStoryProps {
  stories: Array<{
    uuid: string;
    title: string;
    country: string;
    organization: string;
    date: string;
    category: string[];
    description: string;
    image?: string;
    tags: string[];
    facebook_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
  }>;
}

const CardImpactStory: React.FC<CardImpactStoryProps> = ({ stories }) => {
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const t = useT();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="-ml-2 flex flex-1 overflow-visible">
      <div className="mt-5 flex max-h-[62vh] min-h-0 flex-1 overflow-scroll pb-4 pl-2 pr-2 duration-500 lg:mt-8">
        <div className="grid h-max w-full grid-cols-2 gap-x-10 gap-y-10 pb-6 mobile:grid-cols-1 mobile:gap-y-6 mobile:pb-4">
          {stories.map((item, index) => (
            <div
              key={item.uuid}
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
                    {item.tags.map((tag, tagIndex) => (
                      <Text
                        key={`${item.uuid}-${tagIndex}`}
                        variant="text-12"
                        className="rounded bg-grey-500 bg-opacity-10 py-1 px-1.5 capitalize leading-[normal] text-grey-500"
                        as="span"
                      >
                        {t(tag)}
                      </Text>
                    ))}
                  </div>
                </div>
                <a
                  href={`/dashboard/impact-story/${item.uuid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-18-semibold group/button mt-3.5 flex items-center gap-2 hover:text-primary"
                >
                  {t("Read story")}
                  <Icon
                    name={IconNames.ARROW_UP_RIGHT}
                    className="h-3 w-3 transition-transform delay-100 duration-100 group-hover/button:rotate-45 lg:h-4 lg:w-4 wide:h-5 wide:w-5"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardImpactStory;
