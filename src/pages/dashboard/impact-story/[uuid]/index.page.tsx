import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";

import { CARD_IMPACT_STORY_MOCKED_DATA } from "../../mockedData/impactStory";
import SectionShare from "../components/SectionShare";

const ImpactStoryLanding = () => {
  const router = useRouter();
  const uuid = router.query.uuid as string;
  const t = useT();
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const data = CARD_IMPACT_STORY_MOCKED_DATA.find(item => item.uuid === uuid);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white bg-impactStoryBg bg-cover bg-center bg-no-repeat text-darkCustom">
      <div className="border-b-[0.375rem] border-grey-950 py-6 px-13 mobile:p-4">
        <button
          onClick={() => {
            router.back();
          }}
          className="text-14-bold flex items-center gap-x-2 py-1 uppercase leading-[normal] hover:text-primary"
        >
          <Icon name={IconNames.IC_ARROW_COLLAPSE} className="h-3 w-2.5 -rotate-90" />
          {t("Back to all stories")}
        </button>
      </div>
      <div className="flex h-full w-full flex-1 overflow-hidden mobile:flex-col mobile:overflow-y-auto">
        <div
          className={classNames(
            "absolute ml-13 mt-[20vh] w-1/6 ",
            "mobile:relative mobile:order-2 mobile:m-0 mobile:w-full mobile:p-4 mobile:pb-14"
          )}
        >
          <SectionShare uuid={uuid} className="my-auto" />
        </div>
        <div className="flex-1 overflow-y-auto p-8 mobile:overflow-y-visible mobile:p-4">
          <div className="mx-auto w-2/4 mobile:m-0 mobile:w-full">
            <Text variant={isMobile ? "text-24-bold" : "text-40-bold"} className="leading-[normal] text-darkCustom">
              {data?.title}
            </Text>
            <Text variant="text-14-light" className="mt-4 leading-[normal] text-darkCustom">
              <b>{t("Date Added: ")}</b>
              {data?.date}
            </Text>
            <Text variant="text-16" className="mt-6 leading-8 text-darkCustom" containHtml>
              {data?.description}
            </Text>
            <When condition={data?.image}>
              <div className="mt-8">
                <img
                  src={data?.image}
                  alt={data?.title}
                  className="h-[45vh] w-full rounded-2xl lg:h-[50vh] mobile:h-[216px]"
                />
              </div>
            </When>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStoryLanding;
