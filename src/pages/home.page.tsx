import { useT } from "@transifex/react";
import Head from "next/head";

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
import { useFundingProgrammes } from "@/connections/FundingProgramme";
import { useMyOrg } from "@/connections/Organisation";
import { useAcceptInvitation } from "@/hooks/useInviteToken";
import { fundingProgrammeToFundingCardProps } from "@/utils/dataTransformation";

const HomePage = () => {
  const t = useT();
  const [, { organisation, organisationId }] = useMyOrg();
  const tourSteps = useGetHomeTourItems();
  useAcceptInvitation();

  const [loaded, { data: fundingProgrammes }] = useFundingProgrammes({});

  return (
    <PageBody>
      <Head>
        <title>{t("Home")}</title>
      </Head>
      <PageSection>
        <Text variant="text-36-bold" className="text-center">
          {t("What would you like to do?")}
        </Text>
      </PageSection>
      <PageSection>
        <ActionTracker />
      </PageSection>
      {organisation?.status === "approved" ? (
        <LoadingContainer loading={!loaded}>
          <PageSection hasCarousel>
            <FundingCarouselList
              title={t("Opportunities")}
              items={
                fundingProgrammes
                  ?.filter(item => item.status !== "disabled")
                  .map(item => fundingProgrammeToFundingCardProps(item)) || []
              }
            />
          </PageSection>
          <WelcomeTour tourId="home" tourSteps={tourSteps} />
        </LoadingContainer>
      ) : null}
      {organisationId != null ? (
        <PageSection className="flex justify-center bg-white pb-10" hasFull>
          <TaskList
            title={t(`Get Ready for <br> Funding Opportunities`)}
            subtitle={t("Keep your information updated to have more chances of having a successful application.")}
            items={[
              {
                title: t("Organizational Information"),
                subtitle: t("Keep your profile updated to have more chances of having a successful application. "),
                actionText: t("View"),
                actionUrl: `/organization/${organisationId}`,
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
                actionUrl: `/organization/${organisationId}?tab=pitches`,
                iconProps: {
                  name: IconNames.LIGHT_BULB_CIRCLE,
                  className: "fill-success"
                }
              }
            ]}
          />
        </PageSection>
      ) : null}
      <PageFooter />
    </PageBody>
  );
};

export default HomePage;
