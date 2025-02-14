import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { useGetV2ImpactStoriesId } from "@/generated/apiComponents";

import SectionShare from "../components/SectionShare";

const ImpactStoryLanding = () => {
  const router = useRouter();
  const t = useT();
  const uuid = router.query.uuid as string;

  const {
    data: storyData,
    isLoading,
    error
  } = useGetV2ImpactStoriesId({
    pathParams: {
      id: uuid
    }
  });

  const data: any = storyData;

  const transformedData = {
    title: data?.data?.title,
    date: data?.data?.date,
    content: data?.data?.content ? JSON.parse(data?.data?.content) : [],
    category: data?.data?.category ? JSON.parse(data?.data?.category) : [],
    thumbnail:
      data?.data?.thumbnail instanceof File ? URL.createObjectURL(data?.data?.thumbnail) : data?.data?.thumbnail || "",
    organization: {
      name: data?.data?.organization?.name,
      category: data?.data?.category ? JSON.parse(data?.data?.category) : [],
      country: data?.data?.organization?.countries,
      facebook_url: data?.data?.organization?.facebook_url,
      instagram_url: data?.data?.organization?.instagram_url,
      linkedin_url: data?.data?.organization?.linkedin_url,
      twitter_url: data?.data?.organization?.twitter_url
    },
    status: data?.data?.status
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Text variant="text-16">{t("Loading...")}</Text>
      </div>
    );
  }

  if (error || !transformedData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Text variant="text-16">{t("Failed to load impact story")}</Text>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white bg-impactStoryBg bg-cover bg-center bg-no-repeat text-darkCustom">
      <div className="border-b-[0.375rem] border-grey-950 py-6 px-13">
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
      <div className="flex h-full w-full flex-1 overflow-hidden">
        <div className="absolute ml-13 mt-[20vh] w-1/6">
          <SectionShare data={transformedData.organization} className="my-auto" />
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto w-2/4">
            <Text variant="text-40-bold" className="leading-[normal] text-darkCustom">
              {transformedData.title}
            </Text>
            <Text variant="text-14-light" className="mt-4 leading-[normal] text-darkCustom">
              <b>{t("Date Added: ")}</b>
              {transformedData.date}
            </Text>
            <Text variant="text-16" className="mt-6 leading-8 text-darkCustom" containHtml>
              {transformedData.content}
            </Text>
            <When condition={transformedData.thumbnail.url}>
              <div className="mt-8">
                <img
                  src={transformedData.thumbnail.url}
                  alt={transformedData.title}
                  className="h-[45vh] w-full rounded-2xl lg:h-[50vh]"
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
