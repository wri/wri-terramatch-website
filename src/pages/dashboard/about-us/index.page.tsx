import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const Homepage = () => {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const sideVideoRef = useRef<HTMLDivElement>(null);
  const [isVideoIntersecting, setIsVideoIntersecting] = useState(false);
  const sec1Ref = useRef<HTMLDivElement>(null);
  const sec2Ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    const sideVideo = sideVideoRef.current;

    if (video && sideVideo) {
      const intersectionObserver = new IntersectionObserver(
        entries => {
          entries.map(entry => {
            video.style.opacity = entry.isIntersecting ? "1" : "0";
            sideVideo.style.opacity = entry.isIntersecting ? "1" : "0";
            setIsVideoIntersecting(entry.isIntersecting);
            console.log(entry.isIntersecting);
          });
        },
        { threshold: 0.15 }
      );

      intersectionObserver.observe(video);
      return () => {
        intersectionObserver.disconnect();
      };
    }
  }, []);

  return (
    <div className="w-full overflow-auto bg-white pt-16 pb-20 pl-13 pr-26">
      <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      <div className="mt-5 grid gap-16">
        <div className="flex w-full gap-8">
          <div className="h-min w-2/5 text-darkCustom" ref={sec1Ref}>
            <Text variant="text-72-bold" as="h1" className="mb-8">
              About Page
            </Text>
            <div className="grid gap-2">
              <Text variant="text-20-semibold" as="p">
                About the platform
              </Text>

              <Text variant="text-14" as="p" className="opacity-80">
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
              <Text variant="text-14" as="p" className="opacity-80">
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
                Landscapes programme of 2024. Please note that the dashboard is pre-filtered upon page load to display
                only projects from the TerraFund Landscapes programme. Each project reports 12 times over six years.
              </Text>
            </div>
          </div>
          <div className="w-3/5 pr-5">
            <img
              src="/images/_AJL2963.jpg"
              alt="tree"
              className="mt-5 w-full rounded-2xl object-cover"
              style={{ maxHeight: sec1Ref.current ? `${sec1Ref.current.clientHeight - 20}px` : "auto" }}
            />
          </div>
        </div>
        <div className="flex w-full gap-8">
          <div className="w-2/5" style={{ height: sec2Ref.current ? `${sec2Ref.current.clientHeight}px` : "auto" }}>
            <When condition={!!sec2Ref.current}>
              <div className="flex h-full w-full flex-wrap gap-4">
                <img
                  src="/images/upcoming-opportunities-explainer.webp"
                  alt="tree"
                  className="max-h-[100%] w-[calc(50%-8px)] rounded-2xl  object-cover"
                  style={{ height: sec2Ref.current ? `${sec2Ref.current.clientHeight / 2 - 8}px` : "auto" }}
                />
                <img
                  src="/images/usign-platform.png"
                  alt="tree"
                  className="max-h-[100%] w-[calc(50%-8px)] rounded-2xl object-cover"
                  style={{ height: sec2Ref.current ? `${sec2Ref.current.clientHeight / 2 - 8}px` : "auto" }}
                />

                <img
                  src="/images/priceless-planet-coalition-explainer.webp"
                  alt="tree"
                  className="col-span-2 max-h-[50%] w-full rounded-2xl object-cover "
                  style={{ height: sec2Ref.current ? `${sec2Ref.current.clientHeight / 2 - 8}px` : "auto" }}
                />
              </div>
            </When>
          </div>

          <div className="grid w-3/5 gap-2 pr-5 text-darkCustom" ref={sec2Ref}>
            <Text variant="text-20-semibold" as="p">
              Using the platform
            </Text>
            <Text variant="text-14" as="p" className="opacity-80">
              When accessing the dashboard, you can see a high-level overview of select key performance indicators. You
              can filter the data by programme, landscape, country, and organization type to gather targeted insights.
            </Text>
            <Text variant="text-14" as="p" className="opacity-80">
              Financial partners, government agencies, TerraFund staff members, and funded organizations can access
              geolocation data and other detailed information about each project through project pages. These are
              accessible through the Project Profile section on the left navigation bar or through the map and Active
              Projects table.
            </Text>
            <Text variant="text-14" as="p" className="opacity-80">
              In early 2025, more features will come. Impact stories, taken from narrative reports, will give color and
              context to the numerical data on project profiles. And the Project Insights section will contain
              additional analyses showing trends and insights across the portfolio, tapping into the rich data housed on
              TerraMatch.
            </Text>
            <Text variant="text-14" as="p" className="opacity-80">
              If you have questions or would like to provide feedback, please email our support team at&nbsp;
              <a
                href="mailto:info@terramatch.org"
                target="_blank"
                className="text-14-bold underline underline-offset-4"
                rel="noreferrer"
              >
                info@terramatch.org
              </a>
              .
            </Text>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-yellow-500 bg-yellow p-8">
          <Text variant="text-20-semibold">Accessing the platform</Text>
          <Text variant="text-14-light" className="text-darkCustom text-opacity-80">
            Access the public dashboard{" "}
            <a
              href="/"
              target="_blank"
              className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
            >
              here
            </a>{" "}
            or by clicking &ldquo;Dashboards&quot; on the navigation bar on the left of the screen. The dashboard is
            pre-filtered to display projects from the TerraFund Landscapes programme. This filter can be removed by
            using the clear filters button.
          </Text>
          <Text variant="text-14-light" className="text-darkCustom text-opacity-80">
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
            , and
            <a
              href="/"
              target="_blank"
              className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
            >
              Lake Kivu & Rusizi River Basin
            </a>
            . These pages show relevant projects from both programmes, Top 100 and Landsacpes.
          </Text>
          <Text variant="text-14-light" className="text-darkCustom text-opacity-80">
            Are you a current funder, government official, TerraFund staff member, or a funded organization? If so,
            click here to request an account or login to see additional data.
          </Text>
          <Text variant="text-14-light" className="text-darkCustom text-opacity-80">
            Are you interested in becoming a funder, a restoration champion, or getting invovled in another way? If so,
            please email our support team at{" "}
            <a
              href="mailto:info@terramatch.org"
              target="_blank"
              className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
              rel="noreferrer"
            >
              info@terramatch.org
            </a>
            .
          </Text>
        </div>
        <div className="relative flex w-full items-end overflow-hidden">
          <iframe
            ref={videoRef}
            className="z-10 h-[500px] w-1/2 min-w-0 rounded-3xl transition-all duration-500 ease-in-out"
            src="https://www.youtube.com/embed/nvgPWq2-l9M"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div
            ref={sideVideoRef}
            className={classNames(
              "flex h-fit w-1/2 flex-col gap-3 overflow-hidden rounded-r-3xl bg-neutral-40 p-12 transition-all duration-500 ease-in-out",
              {
                "translate-x-0": isVideoIntersecting,
                "translate-x-[-100%]": !isVideoIntersecting
              }
            )}
          >
            <Text variant="text-32-bold" className="text-darkCustom-150">
              About the data
            </Text>
            <Text variant="text-14-light" className="text-darkCustom-150">
              The dashboard displays data collected through the{" "}
              <a
                href="/"
                target="_blank"
                className="text-14-bold text-darkCustom text-opacity-80 underline underline-offset-4"
              >
                TerraFund Monitoring
              </a>
              ,{" "}
              <a
                href="/"
                target="_blank"
                className="text-14-bold text-darkCustom text-opacity-80 underline underline-offset-4"
              >
                Reporting, and Verification (MRV) Framework
              </a>
              . Data are sourced from funding applications, quality assured project reports, and validated geospatial
              boundaries of project sites. Future iterations of the dashboard will include remote sensing data and field
              monitoring insights. As the quality of each dataset is reviewed and improved with restoration champions,
              additional self-reported and verified data will become available.
            </Text>
            <Text variant="text-14-light" className="text-darkCustom-150">
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
