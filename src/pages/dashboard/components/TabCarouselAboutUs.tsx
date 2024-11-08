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
        <div style="margin-top: 8px">If you have questions or would like to provide feedback, please email our support team at <a href="mailto:info@terramatch.org" target="_blank" className="underline text-14-bold underline-offset-4" rel="noreferrer">info@terramatch.org</a>.</div>`
      ),
      url: "/images/about-us-4.png"
    }
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prevTab => (prevTab === aboutUs.length - 1 ? 0 : prevTab + 1));
    }, 15000);
    return () => clearInterval(interval);
  }, [aboutUs.length]);

  return (
    <div className="w-full overflow-auto bg-white py-[58px] pl-[52px] pr-[105px]">
      <SecondaryTabs
        tabItems={[
          {
            key: "about-us",
            title: t("High-Level Metrics"),
            body: <div className="h-12 w-full"></div>
          },
          {
            key: "our-mission",
            title: t("Filter Data"),
            body: <div className="h-12 w-full"></div>
          },
          {
            key: "3",
            title: t("View the Map"),
            body: <div className="h-12 w-full"></div>
          },
          {
            key: "Project Profiles",
            title: t("Project Profiles"),
            body: <div className="h-12 w-full"></div>
          },
          {
            key: "4",
            title: t("Coming Soon"),
            body: <div className="h-12 w-full"></div>
          }
        ]}
        setSelectedIndex={e => {
          setActiveTab(e);
        }}
        variant={VARIANT_TABS_ABOUT_US}
        selectedIndex={activeTab}
      />
      <Carousel
        carouselItem={aboutUs => (
          <div className="flex w-full items-center">
            <div className="w-[61%] pr-16 text-darkCustom-150">
              <Text variant="text-36-bold" className="mb-6 text-darkCustom-150">
                Using the platform
              </Text>
              <Text variant="text-18-light" containHtml={true}>
                {aboutUs.description}
              </Text>
              <Button variant="about-us" className="mt-6" onClick={() => (window.location.href = "/dashboard")}>
                {t("Open Dashboard")}
              </Button>
            </div>
            <img
              src={aboutUs.url}
              alt={aboutUs.title || ""}
              className="h-[40vh] w-[39%] rounded-2xl bg-neutral-40 object-contain"
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
