import { useT } from "@transifex/react";
import Image from "next/image";
import Link from "next/link";
import fondoHaritBharatImage from "public/images/_AJL2963.jpg";
import pricelessPlanetCoalitionExplainerImage from "public/images/priceless-planet-coalition-explainer.webp";
import SupportImage from "public/images/support.webp";
import TerrafundAFR100ExplainerImage from "public/images/terrafund-afr-100-explainer.webp";
import UpcomingOpportunitiesExplainerImage from "public/images/upcoming-opportunities-explainer.webp";

import Button from "@/components/elements/Button/Button";
import ImageCredit from "@/components/elements/ImageCredit/ImageCredit";
import AlternatingSection from "@/components/elements/LandingPage/AlternatingSection";
import ExplainerSection from "@/components/elements/LandingPage/Explainer";
import Footer from "@/components/elements/LandingPage/Footer";
import TwoByOneSection from "@/components/elements/LandingPage/TwoByOneSection";
import Text from "@/components/elements/Text/Text";
import HeroBanner from "@/components/extensive/Banner/Hero/HeroBanner";
import { IconNames } from "@/components/extensive/Icon/Icon";
import LandingPageSectionLayout from "@/components/generic/Layout/LandingPageSectionLayout";
import { zendeskSupportLink } from "@/constants/links";

const LandingPage = () => {
  const t = useT();

  return (
    <div>
      <HeroBanner
        title={t(
          "People growing trees <span class='font-primary text-4xl font-bold u-font-gold text-tertiary'>the right way</span>"
        )}
        subtitle={t(
          "Connecting the world’s land restoration champions to funding and technical assistance through a trusted system that vets their work, supports their growth, and monitors their progress.​"
        )}
        bgImage="/images/landing-page-hero-banner.webp"
        className="min-h-[330px]"
        ctaText={t("Sign up")}
        ctaLink="auth/signup"
      />
      <LandingPageSectionLayout preTitle={t("APPLY BY MAY 5")} title={""} className="bg-background">
        <div className="mt-8 w-full max-w-[550px] space-y-8">
          <Text variant="text-heading-100" containHtml className="px-8 text-center md:px-0">
            {t(
              "Applications are now live for TerraFund for AFR100: Landscapes. This program will fund locally led land restoration projects based in three African landscapes: the Ghana Cocoa Belt, the Greater Rusizi Basin of Burundi, the Democratic Republic of the Congo, and Rwanda, and the Great Rift Valley of Kenya.<br/><br/><br/>Register your account on TerraMatch today to submit your Expression of Interest (EOI). Applications must be submitted by May 5 to be considered for funding. Successful applicants will  be invited to submit a full Request for Proposal (RFP) application by may 15."
            )}
          </Text>
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            <Button variant="secondary" as={Link} href="https://www.africa.terramatch.org/">
              {t("Learn more")}
            </Button>
          </div>
        </div>
      </LandingPageSectionLayout>
      <LandingPageSectionLayout title={t("How TerraMatch Supports Restoration Project Developers:")}>
        <ExplainerSection
          className="mt-8 md:mt-15"
          items={[
            {
              title: t("1. Apply for Funding"),
              description: t(
                "We are working with dozen of funders who are eager to support locally led restoration projects. We  host requests for proposals on TerraMatch when new capital is ready to be deployed."
              ),
              iconName: IconNames.USER_CIRCLE
            },
            {
              title: t("2. Find Support"),
              description: t(
                "TerraMatch is committed to support the growth of locally led restoration project developers. We  host the application process for cohort-based accelerator programs for champions who are looking to level up their operations. We also offer guidance and support for those who do not match with our existing programs."
              ),
              iconName: IconNames.DOCUMENT_CIRCLE
            },
            {
              title: t("3. Report + Monitor"),
              description: t(
                "Funders who are looking to invest in growing trees the right way rely on TerraMatch’s monitoring and reporting capabilities. The platform combines the best in field-collected data with cutting-edge satellite insights to track how investment in restoration impacts communities and ecosystems."
              ),
              iconName: IconNames.TREE_CIRCLE
            }
          ]}
        />
      </LandingPageSectionLayout>

      <AlternatingSection
        title={t("TerraFund for AFR100: Top 100")}
        description={t(
          "A partnership of World Resources Institute, One Tree Planted, and Realize Impact, TerraFund for AFR100 invested in Africa’s Top 100 locally led land restoration projects in 2022. Located across 27 member countries of the AFR100 Initiative, these community-based non-profits and enterprises received grants or loans of $50,000 to $500,000 each. Now, TerraMatch is tracking their progress by combining field-collected data with insights from WRI’s Land & Carbon Lab."
        )}
        buttonText={t("Learn more")}
        buttonLink="https://www.africa.terramatch.org/"
        imageSrc={TerrafundAFR100ExplainerImage}
        imageCredit={{
          name: "Serrah Galos/WRI",
          position: "right"
        }}
      />
      <AlternatingSection
        title={t("Priceless Planet Coalition")}
        description={t(
          "A partnership with Conservation International, WRI, and Mastercard, the Priceless Planet Coalition aims to restore 100 million trees to degraded land around the world. TerraMatch serves as the Integrated Monitoring Platform for the program’s projects, which range from Guatemala’s most successful farmer cooperative to a large-scale native forest restoration initiative in Malawi."
        )}
        buttonText={t("Learn more")}
        buttonLink="https://www.mastercard.us/en-us/vision/corp-responsibility/priceless-planet.html"
        imageSrc={pricelessPlanetCoalitionExplainerImage}
        className="flex-row-reverse"
        imageCredit={{
          name: "Peter Irungu/WRI",
          position: "left"
        }}
      />
      <AlternatingSection
        title={t("Harit Bharat Fund")}
        description={t(
          "A partnership led by World Resources Institute, Harit Bharat Fund is investing in 20 non-governmental organizations, small enterprises, and and farmer-producer companies that restore land in the Central Indian states of Madhya Pradesh, Maharashtra, and Chhattisgarh. Learning from TerraFund for AFR100, this new initiative uses and adapts TerraMatch's application and monitoring functions. WRI India, India Climate Collaborative, Pune Knowledge Cluster, Sangam, Spectrum Impact, and Transform Rural Impact are implementing partners."
        )}
        buttonText={t("Learn more")}
        buttonLink="https://www.india.terramatch.org"
        imageSrc={fondoHaritBharatImage}
        imageCredit={{
          name: "FOLU India",
          position: "right"
        }}
      />
      <AlternatingSection
        title={t("More Opportunities To Come")}
        description={t(
          "TerraMatch will continue to host new funding and capacity building programs. Prepare for those upcoming opportunities by filling out your profile today.<br/><br/>The first application on TerraMatch is for the TerraFund for AFR100: Landscapes opportunity, featured above."
        )}
        buttonText={t("Sign up")}
        buttonLink="/auth/signup"
        imageSrc={UpcomingOpportunitiesExplainerImage}
        className="flex-row-reverse"
        imageCredit={{
          name: "Sabin Ray/WRI",
          position: "right"
        }}
      />
      <TwoByOneSection.Container className="bg-black">
        <TwoByOneSection.Top className="md:py-16 md:px-20">
          <div className="relative">
            <Image
              alt="support"
              className="m-auto aspect-[16/9] h-[278px] w-full bg-cover bg-no-repeat object-cover md:h-[292px]"
              src={SupportImage}
              placeholder="blur"
            />
            <ImageCredit className="absolute bottom-0 right-5">Sabin Ray/WRI</ImageCredit>
          </div>
        </TwoByOneSection.Top>
        <TwoByOneSection.Bottom>
          <div className="box-content flex max-w-[514px] flex-col items-start justify-center gap-3 py-9 px-12 md:gap-8">
            <Text variant="text-heading-700" className="text-white">
              {t("Access Support Today")}
            </Text>
            <Text variant="text-body-900" className="text-white">
              {t(
                "Behind TerraMatch is a team of project specialists determined to help grow the capacity of locally led organizations that restore land. In our resource library, we gather resources and support materials to help aspiring organizations prepare for upcoming applications and funded projects master monitoring, reporting, and verification techniques."
              )}
            </Text>
            <Button as={Link} href={zendeskSupportLink}>
              {t("Launch Resource Library")}
            </Button>
          </div>
        </TwoByOneSection.Bottom>
      </TwoByOneSection.Container>
      <Footer />
    </div>
  );
};

export default LandingPage;
