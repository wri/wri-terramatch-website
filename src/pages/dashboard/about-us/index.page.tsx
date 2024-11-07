import { useRef } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import TabCarouselAboutUs from "../components/TabCarouselAboutUs";

const Homepage = () => {
  const sec2Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="overflow-auto">
      <div className="w-full bg-white pb-20 pl-13 pr-26 pt-16">
        <Icon
          name={IconNames.WRI_LOGO}
          className="h-[30px] w-[108px] lg:h-[50px] lg:w-[150px] wide:h-[85px] wide:w-[200px]"
        />
        <div className="mt-5 grid gap-16">
          <div className="flex w-full gap-12">
            <div className="h-min w-3/5 text-darkCustom">
              <div className="grid gap-6 lg:gap-8">
                <Text variant="text-14-light" as="p" className="text-darkCustom-150">
                  Welcome to the TerraMatch Dashboard! Here, restoration champions of all shapes and sizes – local
                  organizations that grow trees, their financial and government partners, and the wider public – can
                  access data and insights about projects that are tracked through&nbsp;
                  <a
                    href="https://www.terramatch.org/"
                    target="_blank"
                    className="text-14-bold underline underline-offset-4"
                    rel="noreferrer"
                  >
                    TerraMatch’s monitoring, reporting, and verification system.
                  </a>
                </Text>
                <Text variant="text-14-light" as="p" className="text-darkCustom-150">
                  At launch, the dashboard contains progress data for the nearly 200 projects financed by{" "}
                  <a
                    href="https://www.africa.terramatch.org/"
                    target="_blank"
                    className="text-14-bold underline underline-offset-4"
                    rel="noreferrer"
                  >
                    TerraFund for AFR100
                  </a>
                  . These projects are broken down by the two TerraFund programmes – the Top 100 programme of 2022 and
                  Landscapes programme of 2024.
                </Text>
                <Text variant="text-14-light" as="p" className="text-darkCustom-150">
                  Please note that the dashboard is pre-filtered upon page load to display only projects from the
                  TerraFund Landscapes programme. Each project reports 12 times over six years.
                </Text>
              </div>
            </div>
            <div className="w-2/5 pr-5">
              <div className="grid h-fit w-full grid-cols-2 gap-4" ref={sec2Ref}>
                <img
                  src="/images/upcoming-opportunities-explainer.webp"
                  alt="tree"
                  className="h-full w-full rounded-2xl object-cover"
                />
                <img src="/images/usign-platform.png" alt="tree" className="h-full w-full rounded-2xl object-cover" />
                <img
                  src="/images/priceless-planet-coalition-explainer.webp"
                  alt="tree"
                  className="col-span-2 w-full rounded-2xl object-cover"
                  style={{ height: sec2Ref.current ? `${sec2Ref.current.clientHeight / 2}px` : "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-tree bg-cover px-13 pb-8 pt-13">
        <Text variant="text-40-bold" className="leading-[normal] text-darkCustom-150">
          Accessing the
        </Text>
        <Text variant="text-40-bold" className="mb-10 leading-[normal] text-darkCustom-150">
          platform
        </Text>
        <div className="mb-8 flex gap-12">
          <div className="flex flex-1 flex-col gap-4">
            <Icon name={IconNames.VISIT_DASHBOARD} className="h-16 w-16" />
            <Text variant="text-24" className="text-darkCustom">
              Visit the Public Dashboard
            </Text>
            <Text variant="text-14-light" className="text-darkCustom-150">
              Access the public dashboard{" "}
              <a
                href="/dashboard"
                target="_blank"
                className="text-14-semibold text-darkCustom underline underline-offset-4"
              >
                here
              </a>{" "}
              or by clicking &ldquo;Dashboards&rdquo; on the navigation bar on the left of the screen. The dashboard is
              pre-filtered to display projects from the TerraFund Landscapes programme. This filter can be removed by
              using the clear filters button.
            </Text>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Icon name={IconNames.PRE_FILTERED_PAGE} className="h-16 w-16" />
            <Text variant="text-24" className="text-darkCustom">
              Pre-Filtered Pages
            </Text>
            <Text variant="text-14-light" className="text-darkCustom-150">
              Access pre-filtered pages for each of TerraFund’s target landscapes here-{" "}
              <a
                href="/"
                target="_blank"
                className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
              >
                Ghana Cocoa Belt
              </a>
              ,{" "}
              <a
                href="/"
                target="_blank"
                className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
              >
                Greater Rift Valley of Kenya
              </a>
              , and{" "}
              <a
                href="/"
                target="_blank"
                className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
              >
                Lake Kivu & Rusizi River Basin
              </a>
              . These pages show relevant projects from both programmes, Top 100 and Landsacpes.
            </Text>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Icon name={IconNames.REQUEST_ACCOUNT} className="h-16 w-16" />
            <Text variant="text-24" className="text-darkCustom">
              Request an Account
            </Text>
            <Text variant="text-14-light" className="text-darkCustom-150">
              Are you a current funder, government official, TerraFund staff member, or a funded organization? If so,
              click here to request an account or login to see additional data.
            </Text>
          </div>
        </div>
        <div className="flex w-fit items-center gap-1 rounded-full bg-yellow px-3 py-1.5 opacity-0 transition-all duration-500 ease-in-out">
          <Icon name={IconNames.ORANGE_DOTS} className="h-5 w-5" />
          <div>
            <Text variant="text-14-semibold">
              Are you interested in becoming a funder, a restoration champion, or getting involved in another way? If
              so, or if you have any other questions,
            </Text>
            <Text variant="text-14-semibold">
              please email our support team at{" "}
              <a
                href="mailto:info@terramatch.org"
                target="_blank"
                className="text-14-bold underline underline-offset-4"
                rel="noreferrer"
              >
                info@terramatch.org
              </a>
            </Text>
          </div>
        </div>
      </div>
      <TabCarouselAboutUs />

      <div className="flex w-full items-center gap-12 bg-white pb-20 pl-13 pr-26 pt-16">
        <div className="w-2/5 pr-5">
          <div className="grid h-fit w-full grid-cols-2 gap-4" ref={sec2Ref}>
            <img
              src="/images/upcoming-opportunities-explainer.webp"
              alt="tree"
              className="h-full w-full rounded-2xl object-cover"
            />
            <img src="/images/usign-platform.png" alt="tree" className="h-full w-full rounded-2xl object-cover" />
            <img
              src="/images/priceless-planet-coalition-explainer.webp"
              alt="tree"
              className="col-span-2 w-full rounded-2xl object-cover"
              style={{ height: sec2Ref.current ? `${sec2Ref.current.clientHeight / 2}px` : "auto" }}
            />
          </div>
        </div>
        <div className="h-min w-3/5 text-darkCustom">
          <div className="grid gap-2">
            <Text variant="text-36-bold" className="text-darkCustom-150">
              About the data
            </Text>
            <Text variant="text-14-light" as="p" className="text-darkCustom-150">
              The dashboard displays data collected through the
              <a
                href="https://www.terramatch.org/"
                target="_blank"
                className="text-14-bold underline underline-offset-4"
                rel="noreferrer"
              >
                TerraFund Monitoring, Reporting, and Verification (MRV) Framework
              </a>
              . Data are sourced from funding applications, quality assured project reports, and validated geospatial
              boundaries of project sites. Future iterations of the dashboard will include remote sensing data and field
              monitoring insights. As the quality of each dataset is reviewed and improved with restoration champions,
              additional self-reported and verified data will become available.
            </Text>
            <Text variant="text-14-light" as="p" className="text-darkCustom-150">
              Because the dashboard is directly linked to TerraMatch, numbers update in real-time as new data are
              entered and approved. This happens predominantly after TerraFund projects submit reports in January and
              July of each year, and those data are meticulously checked by experienced project managers and geospatial
              data experts. Projects where no progress data is available are still undergoing quality assurance.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
