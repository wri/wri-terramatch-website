import { useT } from "@transifex/react";
import { useEffect, useRef } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TERRAFUND_MONITORING_LINK } from "@/constants/dashboardConsts";

import TabCarouselAboutUs from "../components/TabCarouselAboutUs";

const Homepage = () => {
  const first = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);
  const third = useRef<HTMLDivElement>(null);

  const t = useT();

  useEffect(() => {
    const elements = [first, second, third];

    const hasScrolledDownMap = new Map();

    const handleIntersection = (entries: any[]) => {
      entries.forEach((entry: { isIntersecting?: any; boundingClientRect?: any; target?: any }) => {
        const { target } = entry;
        const correspondingElement = elements.find(el => el.current === target);

        if (correspondingElement && entry.isIntersecting && entry.boundingClientRect.top > 0) {
          if (!hasScrolledDownMap.get(target)) {
            if (correspondingElement.current) {
              correspondingElement.current.style.opacity = "1";
            }

            hasScrolledDownMap.set(target, true);
          }
        } else if (entry.boundingClientRect.top > window.innerHeight - 170) {
          hasScrolledDownMap.set(target, false);
          if (correspondingElement && correspondingElement.current) {
            correspondingElement.current.style.opacity = "0";
          }
        }
      });
    };

    const intersectionObserver = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
      rootMargin: "50px"
    });

    elements.forEach(el => {
      if (el.current) {
        hasScrolledDownMap.set(el.current, false);
        intersectionObserver.observe(el.current);
      }
    });

    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

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
                    href={TERRAFUND_MONITORING_LINK}
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
                  Each project reports 12 times over six years.
                </Text>
                <Button variant="about-us" className="mt-6" onClick={() => (window.location.href = "/dashboard")}>
                  {t("Open Dashboard")}
                </Button>
              </div>
            </div>
            <div className="w-2/5 pr-5">
              <div className="grid h-fit w-full grid-cols-2 gap-4">
                <img
                  src="/images/upcoming-opportunities-explainer.webp"
                  alt="tree"
                  className="h-full w-full rounded-2xl object-cover"
                />
                <img src="/images/usign-platform.png" alt="tree" className="h-full w-full rounded-2xl object-cover" />
                <img
                  src="/images/priceless-planet-coalition-explainer.webp"
                  alt="tree"
                  className="col-span-2 max-h-[170px] w-full rounded-2xl object-cover lg:max-h-[220px] wide:max-h-[308px] "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col bg-tree bg-cover px-13 pb-9 pt-13 transition-all duration-500 ease-in-out"
        ref={first}
      >
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
              or by clicking &ldquo;Dashboards&rdquo; on the navigation bar on the left of the screen.
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
                href="/dashboard?landscapes=Ghana+Cocoa+Belt"
                target="_blank"
                className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
              >
                Ghana Cocoa Belt
              </a>
              ,{" "}
              <a
                href="/dashboard?landscapes=Greater+Rift+Valley+of+Kenya"
                target="_blank"
                className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
              >
                Greater Rift Valley of Kenya
              </a>
              , and{" "}
              <a
                href="/dashboard?landscapes=Lake+Kivu+%26+Rusizi+River+Basin"
                target="_blank"
                className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
              >
                Lake Kivu & Rusizi River Basin
              </a>
              . These pages show relevant projects from both programmes, Top 100 and Landscapes.
            </Text>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Icon name={IconNames.REQUEST_ACCOUNT} className="h-16 w-16" />
            <Text variant="text-24" className="text-darkCustom">
              Request an Account
            </Text>
            <Text variant="text-14-light" className="text-darkCustom-150">
              Are you a current funder, government official, TerraFund staff member, or a funded organization? If so,
              click here to{" "}
              <a
                href="https://terramatchsupport.zendesk.com/hc/en-us/requests/new?ticket_form_id=30623040820123&tf_subject=Account%20Access%20Request%20for%20TerraMatch%20Dashboard&tf_description=Please%20provide%20your%20details%20to%20request%20access%20to%20the%20TerraMatch%20Dashboard.%20Once%20your%20information%20is%20submitted,%20our%20team%20will%20review%20your%20request%20and%20set%20up%20an%20account%20for%20you.%20You%E2%80%99ll%20receive%20an%20email%20with%20further%20instructions%20once%20your%20account%20is%20ready"
                target="_blank"
                className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
                rel="noreferrer"
              >
                request an account
              </a>{" "}
              or login to see additional data.
            </Text>
          </div>
        </div>
        <div className="flex w-fit items-center gap-1 gap-2 rounded-full bg-yellow px-3 py-1.5 transition-all duration-500 ease-in-out">
          <Icon name={IconNames.ORANGE_DOTS} className="h-5 w-5" />
          <div>
            <Text variant="text-14">
              Are you interested in becoming a funder, a restoration champion, or getting involved in another way? If
              so, or if you have any other questions,
            </Text>
            <Text variant="text-14">
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

      <div ref={second} className="transition-all duration-500 ease-in-out">
        <TabCarouselAboutUs />
      </div>

      <div
        className="flex w-full items-center gap-12 bg-white pb-20 pl-13 pr-26 pt-16 transition-all duration-500 ease-in-out"
        ref={third}
      >
        <div className="w-2/5 pr-5">
          <div className="grid h-fit w-full grid-cols-2 gap-4">
            <img
              src="/images/learn-more-data-1.jpg"
              alt="tree"
              className="h-full max-h-[170px]  w-full rounded-2xl object-cover lg:max-h-[220px] wide:max-h-[308px]"
            />
            <img
              src="/images/learn-more-data-3.jpg"
              alt="tree"
              className="h-full max-h-[170px]  w-full rounded-2xl object-cover lg:max-h-[220px] wide:max-h-[308px]"
            />
            <img
              src="/images/learn-more-data-2.jpg"
              alt="tree"
              className="col-span-2 max-h-[170px] w-full rounded-2xl object-cover lg:max-h-[220px] wide:max-h-[308px] "
            />
          </div>
        </div>
        <div className="h-min w-3/5 text-darkCustom">
          <div className="grid gap-2">
            <Text variant="text-36-bold" className="text-darkCustom-150">
              About the data
            </Text>
            <Text variant="text-14-light" as="p" className="text-darkCustom-150">
              The dashboard displays data collected through the{" "}
              <a
                href={TERRAFUND_MONITORING_LINK}
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
