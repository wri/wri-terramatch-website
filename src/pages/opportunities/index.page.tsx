import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
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
import PitchesTable from "@/components/extensive/Tables/PitchesTable";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useMyOrg } from "@/connections/Organisation";
import { useGetV2FundingProgramme, useGetV2MyApplications } from "@/generated/apiComponents";
import { fundingProgrammeToFundingCardProps } from "@/utils/dataTransformation";

const OpportunitiesPage = () => {
  const t = useT();
  const route = useRouter();
  const [, { organisation, organisationId }] = useMyOrg();
  const [pitchesCount, setPitchesCount] = useState<number>();

  const { data: fundingProgrammes, isLoading: loadingFundingProgrammes } = useGetV2FundingProgramme({
    queryParams: {
      //@ts-ignore
      lang: route.locale,
      per_page: 1000
    }
  });

  const { data: applications } = useGetV2MyApplications({
    queryParams: {
      page: 1,
      per_page: 5
    }
  });

  return (
    <>
      <Head>
        <title>{t("Opportunities")}</title>
      </Head>
      <PageHeader className="h-[203px]" title="Opportunities" />
      <PageBody>
        <If condition={organisation?.status === "approved"}>
          <Then>
            <LoadingContainer loading={loadingFundingProgrammes}>
              <PageSection hasCarousel>
                <FundingCarouselList
                  items={
                    //@ts-ignore
                    fundingProgrammes?.data
                      ?.filter(item => item.status !== "disabled")
                      .map(item => fundingProgrammeToFundingCardProps(item)) || []
                  }
                />
              </PageSection>
            </LoadingContainer>

            <PageSection>
              <If condition={applications?.data?.length! > 0}>
                <Then>
                  <PageCard
                    //@ts-ignore
                    title={t("Active Applications") + ` (${applications?.meta?.total})`}
                    subtitle={t(
                      "You can use pitches to apply for funding opportunities. By creating a pitch, you will have a ready-to-use resource that can be used to submit applications for funding opportunities."
                    )}
                  >
                    <ApplicationsTable />
                  </PageCard>
                </Then>
                <Else>
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
                </Else>
              </If>
            </PageSection>

            <PageSection>
              <If condition={pitchesCount === undefined || pitchesCount > 0}>
                <Then>
                  <PageCard
                    title={t("Pitches ({count})", { count: pitchesCount || 0 })}
                    subtitle={t(
                      "You can use pitches to apply for funding opportunities. By creating a pitch, you will have a ready-to-use resource that can be used to submit applications when funding opportunities are announced."
                    )}
                    headerChildren={
                      <Button as={Link} href={`/organization/${organisationId}/project-pitch/create/intro`}>
                        {t("Create Project Pitch")}
                      </Button>
                    }
                  >
                    <PitchesTable
                      organisationUUID={organisationId!}
                      onFetch={data => setPitchesCount((data.meta as any)?.total)}
                    />
                  </PageCard>
                </Then>
                <Else>
                  <div>
                    <Text variant="text-bold-headline-1000" className="mb-8">
                      {t("Pitches")}
                    </Text>
                    <EmptyState
                      title={t("Create a pitch")}
                      subtitle={t(
                        "Your organization currently does not have any available pitches. To apply for funding opportunities, you need to create a pitch. By creating a pitch, you will have a ready-to-use resource for funding opportunities."
                      )}
                      iconProps={{ name: IconNames.LIGHT_BULB_CIRCLE, className: "fill-success" }}
                      ctaProps={{
                        as: Link,
                        href: `/organization/${organisationId}/project-pitch/create/intro`,
                        children: t("Create Pitch")
                      }}
                    />
                  </div>
                </Else>
              </If>
            </PageSection>
          </Then>
          <Else>
            <PageSection>
              <EmptyState
                iconProps={{ name: IconNames.LIGHT_BULB_CIRCLE, className: "fill-success" }}
                title={t("Explore Funding Opportunities")}
                subtitle={t(
                  "Your organization's approval is currently pending, which is why you can't view any listed funding opportunities here. Once your organization receives approval, this page will showcase all available opportunities, enabling you to apply for them. In the meantime, if you have questions or require assistance, please don't hesitate to contact our support team through the help center."
                )}
              />
            </PageSection>
          </Else>
        </If>
        <br />
        <br />
      </PageBody>

      <PageFooter />
    </>
  );
};

export default OpportunitiesPage;
