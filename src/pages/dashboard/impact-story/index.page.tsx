import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";

import TabImpactStory from "./components/TabImpactStory";

const ImpactStory = () => {
  const t = useT();
  return (
    <div className="h-screen w-full bg-white bg-impactStoryBg bg-cover bg-center bg-no-repeat">
      <div className="flex w-full flex-col gap-y-6 overflow-hidden pr-[4.375rem] pl-13 pt-14 lg:gap-y-10 lg:pt-[4.375rem] lg:pl-[4.375rem]">
        <Text variant="text-48-bold" className="leading-[normal] text-black">
          {t("Impact Story")}
        </Text>
        <Text variant="text-16-light" className="text-grey-500 lg:text-lg wide:text-2lg">
          Impact stories, drawn from narrative reports, site visits, and updates from project managers, give color to
          the numerical data on the TerraMatch Dashboard. If you are a TerraFund champion and would like to share an
          impact story, please email our support team at&nbsp;
          <a
            href="mailto:info@terramatch.org"
            target="_blank"
            className="font-inherit !font-bold text-primary"
            rel="noreferrer"
          >
            info@terramatch.org
          </a>
          .
        </Text>
        <TabImpactStory />
      </div>
    </div>
  );
};

export default ImpactStory;
