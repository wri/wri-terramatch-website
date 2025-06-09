import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";

import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { useImpactStory } from "@/connections/ImpactStory";

import SectionShare from "../components/SectionShare";

const ImpactStoryLanding = () => {
  const router = useRouter();
  const t = useT();
  const uuid = router.query.uuid as string;
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const [isLoaded, { impactStory, requestFailed }] = useImpactStory({ uuid });

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Text variant="text-16">{t("Loading...")}</Text>
      </div>
    );
  }

  if (requestFailed || !impactStory) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Text variant="text-16">{t("Failed to load impact story")}</Text>
      </div>
    );
  }

  const transformedData = {
    uuid: impactStory.uuid ?? "",
    title: impactStory.title ?? "",
    date: impactStory.date ?? "",
    content: impactStory.content ? JSON.parse(impactStory.content[0] ?? "{}") : [],
    category: impactStory.category ?? [],
    thumbnail:
      impactStory?.thumbnail instanceof File
        ? URL.createObjectURL(impactStory?.thumbnail)
        : impactStory?.thumbnail ?? "",
    organization: {
      name: impactStory.organization?.name ?? "",
      category: impactStory.category ?? [],
      country:
        impactStory.organization?.countries && impactStory.organization.countries.length > 0
          ? impactStory.organization.countries.map((c: any) => c.label).join(", ")
          : "No country",
      facebook_url: impactStory.organization?.facebook_url ?? "",
      instagram_url: impactStory.organization?.instagram_url ?? "",
      linkedin_url: impactStory.organization?.linkedin_url ?? "",
      twitter_url: impactStory.organization?.twitter_url ?? ""
    },
    status: impactStory.status ?? ""
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white bg-impactStoryBg bg-cover bg-center bg-no-repeat text-darkCustom">
      <div className="border-b-[0.375rem] border-grey-950 py-6 px-13 mobile:p-4">
        <button
          onClick={() => {
            router.push("/dashboard/impact-story?tab=view-all");
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
          <SectionShare data={transformedData} className="my-auto" />
        </div>
        <div className="flex-1 overflow-y-auto p-8 mobile:overflow-y-visible mobile:p-4">
          <div className="mx-auto w-2/4 mobile:m-0 mobile:w-full">
            <Text variant={isMobile ? "text-24-bold" : "text-40-bold"} className="leading-[normal] text-darkCustom">
              {transformedData.title}
            </Text>
            <Text variant="text-14-light" className="mt-4 leading-[normal] text-darkCustom">
              <b>{t("Date Added: ")}</b>
              {transformedData.date}
            </Text>
            <Text variant="text-16" className="modal-impact-story-content mt-6 leading-8 text-darkCustom" containHtml>
              {transformedData.content}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStoryLanding;
