import { useT } from "@transifex/react";
import Head from "next/head";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import Text from "@/components/elements/Text/Text";
import FundingCarouselList from "@/components/extensive/FundingsCarouselList/FundingsCarouselList";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import PageSection from "@/components/extensive/PageElements/Section/PageSection";
import ApplicationsTable from "@/components/extensive/Tables/ApplicationsTable";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useApplications } from "@/connections/Application";
import { useFundingProgrammes } from "@/connections/FundingProgramme";
import { useMyOrg } from "@/connections/Organisation";
import { fundingProgrammeToFundingCardProps } from "@/utils/dataTransformation";

const OpportunitiesPage = () => {
  const t = useT();
  const [, { organisation }] = useMyOrg();
  const [loaded, { data: fundingProgrammes }] = useFundingProgrammes({});
  const [, { indexTotal }] = useApplications({});

  return (
    <>
      <Head>
        <title>{t("Opportunities")}</title>
      </Head>
      <PageHeader className="h-[203px]" title="Opportunities" />
      <PageBody>
        {organisation?.status === "approved" ? (
          <>
            <LoadingContainer loading={!loaded}>
              <PageSection hasCarousel>
                <FundingCarouselList
                  items={
                    fundingProgrammes
                      ?.filter(item => item.status !== "disabled")
                      .map(item => fundingProgrammeToFundingCardProps(item)) || []
                  }
                />
              </PageSection>
            </LoadingContainer>

            <PageSection>
              {indexTotal != null && indexTotal > 0 ? (
                <PageCard
                  title={t("Active Applications: {indexTotal}", { indexTotal })}
                  subtitle={t(
                    "You can use pitches to apply for funding opportunities. By creating a pitch, you will have a ready-to-use resource that can be used to submit applications for funding opportunities."
                  )}
                >
                  <ApplicationsTable />
                </PageCard>
              ) : (
                <div>
                  <Text variant="text-bold-headline-1000" className="mb-8">
                    {t("Active Applications")}
                  </Text>
                  <EmptyState
                    title={t("No Active Applications")}
                    subtitle={t(
                      "Your organization currently does not have any active applications. To apply for funding opportunities, please review the opportunities listed on this page. After applying, you can track your application's progress here."
                    )}
                    iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                  />
                </div>
              )}
            </PageSection>
          </>
        ) : (
          <PageSection>
            <EmptyState
              iconProps={{ name: IconNames.LIGHT_BULB_CIRCLE, className: "fill-success" }}
              title={t("Explore Funding Opportunities")}
              subtitle={t(
                "Your organization's approval is currently pending, which is why you can't view any listed funding opportunities here. Once your organization receives approval, this page will showcase all available opportunities, enabling you to apply for them. In the meantime, if you have questions or require assistance, please don't hesitate to contact our support team through the help center."
              )}
            />
          </PageSection>
        )}
        <br />
        <br />
      </PageBody>
      <PageFooter />
    </>
  );
};

export default OpportunitiesPage;
