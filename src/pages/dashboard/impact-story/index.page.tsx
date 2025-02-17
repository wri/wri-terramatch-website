import { useT } from "@transifex/react";
import { useState } from "react";

import Button from "@/components/elements/Button/Button";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { FILTER_SEARCH_IMPACT_STORY } from "@/components/elements/TableFilters/Inputs/FilterSearchBoxVariants";
import Text from "@/components/elements/Text/Text";

import TabImpactStory from "./components/TabImpactStory";

const ImpactStory = () => {
  const t = useT();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="h-screen w-full bg-white bg-impactStoryBg bg-cover bg-center bg-no-repeat">
      <div className="flex w-full flex-col gap-y-6 overflow-hidden pr-[4.375rem] pl-13 pt-14 lg:gap-y-10 lg:pt-[4.375rem] lg:pl-[4.375rem]">
        <div className="flex items-center justify-between">
          <Text variant="text-48-bold" className="leading-[normal] text-black">
            {t("Impact Story")}
          </Text>
          <FilterSearchBox
            onChange={handleSearch}
            placeholder={t("Search by country or organization")}
            suffix={<Button className="text-16-bold h-full rounded-full py-4 capitalize">{t("Search")}</Button>}
            variant={FILTER_SEARCH_IMPACT_STORY}
            className="w-[35%]"
          />
        </div>
        <Text variant="text-16-light" className="text-grey-500 lg:text-lg wide:text-2lg">
          {t(
            "Impact stories, drawn from narrative reports, site visits, and updates from project managers, give color to the numerical data on the TerraMatch Dashboard. If you are a TerraFund champion and would like to share an impact story, please email our support team at "
          )}
          &nbsp;
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
        <TabImpactStory searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default ImpactStory;
