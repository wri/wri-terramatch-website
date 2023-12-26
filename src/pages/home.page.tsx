import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import ActionTracker from "@/components/extensive/ActionTracker/ActionTracker";
import FundingCarouselList from "@/components/extensive/FundingsCarouselList/FundingsCarouselList";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import PageSection from "@/components/extensive/PageElements/Section/PageSection";
import TaskList from "@/components/extensive/TaskList/TaskList";
import { useGetHomeTourItems } from "@/components/extensive/WelcomeTour/useGetHomeTourItems";
import WelcomeTour from "@/components/extensive/WelcomeTour/WelcomeTour";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2FundingProgramme } from "@/generated/apiComponents";
import { useAcceptInvitation } from "@/hooks/useInviteToken";
import { useMyOrg } from "@/hooks/useMyOrg";
import { fundingProgrammeToFundingCardProps } from "@/utils/dataTransformation";

const HomePage = () => {
  const t = useT();
  const myOrg = useMyOrg();
  const route = useRouter();
  const tourSteps = useGetHomeTourItems();
  useAcceptInvitation();

  const { data: fundingProgrammes, isLoading: loadingFundingProgrammes } = useGetV2FundingProgramme({
    queryParams: {
      //@ts-ignore
      lang: route.locale,
      per_page: 1000
    }
  });

  return (
    <PageBody>
      <Head>
        <title>{t("Home")}</title>
      </Head>
      <PageSection>
        <Text variant="text-heading-700" className="text-center">
          {t("What would you like to do?")}
        </Text>
      </PageSection>
      <PageSection>
        <ActionTracker />
      </PageSection>
      <When condition={!!myOrg && myOrg.status === "approved"}>
        <LoadingContainer loading={loadingFundingProgrammes}>
          <PageSection hasCarousel>
            <FundingCarouselList
              title={t("Opportunities")}
              items={
                //@ts-ignore
                fundingProgrammes?.data
                  ?.filter(item => item.status !== "disabled")
                  .map(item => fundingProgrammeToFundingCardProps(item)) || []
              }
            />
          </PageSection>
          <When condition={myOrg?.status === "approved"}>
            <WelcomeTour tourId="home" tourSteps={tourSteps} />
          </When>
        </LoadingContainer>
      </When>
      <When condition={!!myOrg}>
        <PageSection className="flex justify-center bg-white pb-10" hasFull>
          <TaskList
            title={
              <>
                Get Ready for
                <br />
                Funding Opportunities
              </>
            }
            subtitle={t("Keep your information updated to have more chances of having a successful application.")}
            items={[
              {
                title: t("Organizational Information"),
                subtitle: t("Keep your profile updated to have more chances of having a successful application. "),
                actionText: t("View"),
                actionUrl: `/organization/${myOrg?.uuid}`,
                iconProps: {
                  name: IconNames.BRANCH_CIRCLE,
                  className: "fill-success"
                }
              },
              {
                title: t("Pitches"),
                subtitle: t(
                  'Start a pitch or edit your pitches to apply for funding opportunities. To go to create a pitch, manage your pitches/funding applications, tap on "view".'
                ),
                actionText: t("View"),
                actionUrl: `/organization/${myOrg?.uuid}?tab=pitches`,
                iconProps: {
                  name: IconNames.LIGHT_BULB_CIRCLE,
                  className: "fill-success"
                }
              }
            ]}
          />
        </PageSection>
      </When>
      <PageFooter />
    </PageBody>
  );
};

export default HomePage;
