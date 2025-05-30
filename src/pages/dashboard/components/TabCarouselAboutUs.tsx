import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import { VARIANT_TABS_ABOUT_US } from "@/components/elements/Tabs/Secondary/SecuandaryTabsVariants";
import Text from "@/components/elements/Text/Text";
import Carousel from "@/components/extensive/Carousel/Carousel";

const TabCarouselAboutUs = () => {
  const t = useT();
  const [activeTab, setActiveTab] = useState<number>(0);
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const aboutUs = [
    {
      id: "1",
      title: t("High-Level Metrics"),
      description: t(
        "When accessing the dashboard, you can see a high-level overview of select key performance indicators. Each indicator (trees, hectares, and jobs) is further broken down in the sections below."
      ),
      url: "/images/about-us-1.png"
    },
    {
      id: "2",
      title: t("Filter Data"),
      description: t(
        "Use filters to view data by programme, landscape, country, and organization type to gather targeted insights. Filtering will update the entire page, including the map."
      ),
      url: "/images/about-us-2.png"
    },
    {
      id: "3",
      title: t("View the Map"),
      description: t(
        "Using the map, you can click on a country to view country-level details or click on a dot to view details on specific projects. Clicking “learn more” will automatically add a country filter to the dashboard."
      ),
      url: "/images/about-us-3.png"
    },
    {
      id: "4",
      title: t("Project Profiles"),
      description: t(
        "Financial partners, government agencies, TerraFund staff members, and funded organizations can access geolocation data and other detailed information about each project through project pages. These are accessible through the Project Profile section on the left navigation bar or through the map and Active Projects table."
      ),
      url: "/images/about-us-4.png"
    },
    {
      id: "5",
      title: t("Coming Soon"),
      description: t(
        `In early 2025, more features will come. Impact stories, taken from narrative reports, will give color and context to the numerical data on project profiles. And the Project Insights section will contain additional analyses showing trends and insights across the portfolio, tapping into the rich data housed on TerraMatch.
        <div style="margin-top: 8px">If you have questions or would like to provide feedback, please email our support team at <a href="mailto:info@terramatch.org" target="_blank" style="font-size: inherit" rel="noreferrer">info@terramatch.org</a>.</div>`
      ),
      url: "/images/about-us-5.png"
    }
  ];
  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setActiveTab(prevTab => (prevTab === aboutUs.length - 1 ? 0 : prevTab + 1));
      }, 10000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [aboutUs.length, isMobile]);

  return (
    <div className="w-full overflow-auto bg-white py-[58px] pl-[52px] pr-[105px] mobile:px-4 mobile:pb-0">
      <SecondaryTabs
        tabItems={[
          {
            key: "about-us",
            title: t("High-Level Metrics"),
            body: <div className="h-12 w-full mobile:h-8"></div>
          },
          {
            key: "our-mission",
            title: t("Filter Data"),
            body: <div className="h-12 w-full mobile:h-8"></div>
          },
          {
            key: "3",
            title: t("View the Map"),
            body: <div className="h-12 w-full mobile:h-8"></div>
          },
          {
            key: "Project Profiles",
            title: t("Project Profiles"),
            body: <div className="h-12 w-full mobile:h-8"></div>
          },
          {
            key: "4",
            title: t("Coming Soon"),
            body: <div className="h-12 w-full mobile:h-8"></div>
          }
        ]}
        setSelectedIndex={e => {
          setActiveTab(e);
        }}
        variant={VARIANT_TABS_ABOUT_US}
        selectedIndex={activeTab}
        scrollable
      />
      <Carousel
        carouselItem={aboutUs => (
          <div className="flex w-full items-center mobile:flex-col mobile:gap-4">
            <div className="w-[61%] pr-16 text-darkCustom-150 mobile:w-full mobile:pr-0">
              <Text variant={isMobile ? "text-32-bold" : "text-36-bold"} className="mb-6 text-darkCustom-150">
                Using the platform
              </Text>
              <Text variant="text-18-light" containHtml={true} className="mobile:min-h-[190px]">
                {aboutUs.description}
              </Text>
              <Button
                variant="about-us"
                className="mt-6 mobile:mb-3"
                onClick={() => (window.location.href = "/dashboard")}
              >
                {t("Open Dashboard")}
              </Button>
            </div>
            <img
              src={aboutUs.url}
              alt={aboutUs.title || ""}
              className="w-[39%] rounded-2xl object-contain mobile:w-full"
            />
          </div>
        )}
        items={aboutUs}
        selectedImage={activeTab}
        swiperSlideClassName="!w-full"
        numberSlidesPerView={1}
        swiperButtonsClassName="!hidden"
        hidePaginationBullet={true}
        setSelectedImage={setActiveTab}
        breakpoints={{
          1000: {
            slidesPerView: 1
          }
        }}
      />
    </div>
  );
};

export default TabCarouselAboutUs;
