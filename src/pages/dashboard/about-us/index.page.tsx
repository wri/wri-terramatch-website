import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const Homepage = () => {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [isVideoIntersecting, setIsVideoIntersecting] = useState(false);
  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      const intersectionObserver = new IntersectionObserver(
        entries => {
          entries.map(entry => {
            setIsVideoIntersecting(entry.isIntersecting);
            console.log(entry.isIntersecting);
          });
        },
        { threshold: 0.5 }
      );

      intersectionObserver.observe(video);
      return () => {
        intersectionObserver.disconnect();
      };
    }
  }, []);

  return (
    <div className="w-full overflow-auto bg-white pb-20 pl-13 pr-26 pt-16">
      <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      <div className="mt-5 grid gap-16">
        <div>Sec1</div>
        <div>Sec2</div>
        <div>Sec3</div>
      </div>
      <div className="flex flex-col gap-2 rounded-xl border border-yellow-500 bg-yellow p-4">
        <Text variant="text-18-semibold">Accessing the platform</Text>
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
          pre-filtered to display projects from the TerraFund Landscapes programme. This filter can be removed by using
          the clear filters button.
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
          Are you a current funder, government official, TerraFund staff member, or a funded organization? If so, click
          here to request an account or login to see additional data.
        </Text>
        <Text variant="text-14-light" className="text-darkCustom text-opacity-80">
          Are you interested in becoming a funder, a restoration champion, or getting invovled in another way? If so,
          please email our support team at{" "}
          <a
            href="/"
            target="_blank"
            className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
          >
            info@terramatch.org
          </a>
          .
        </Text>
      </div>
      <div className="relative flex w-full items-end overflow-hidden">
        <iframe
          ref={videoRef}
          className="z-10 h-[500px] w-1/2 min-w-0 rounded-3xl"
          src="https://www.youtube.com/embed/nvgPWq2-l9M"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div
          className={classNames(
            "flex h-fit w-1/2 flex-col gap-3 overflow-hidden rounded-r-3xl bg-neutral-40 p-12 transition-all duration-500 ease-in-out",
            {
              "translate-x-0": isVideoIntersecting,
              "translate-x-[-100%]": !isVideoIntersecting
            }
          )}
        >
          <Text variant="text-24-bold" className="text-darkCustom-150">
            About the data
          </Text>
          <Text variant="text-14-light" className="text-darkCustom-150">
            The dashboard displays data collected through the{" "}
            <a
              href="/"
              target="_blank"
              className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
            >
              TerraFund Monitoring
            </a>
            ,{" "}
            <a
              href="/"
              target="_blank"
              className="text-14-semibold text-darkCustom text-opacity-80 underline underline-offset-4"
            >
              Reporting, and Verification (MRV) Framework
            </a>
            . Data are sourced from funding applications, quality assured project reports, and validated geospatial
            boundaries of project sites. Future iterations of the dashboard will include remote sensing data and field
            monitoring insights. As the quality of each dataset is reviewed and improved with restoration champions,
            additional self-reported and verified data will become available.
          </Text>
          <Text variant="text-14-light" className="text-darkCustom-150">
            Because the dashboard is directly linked to TerraMatch, numbers update in real-time as new data are entered
            and approved. This happens predominantly after TerraFund projects submit reports in January and July of each
            year, and those data are meticulously checked by experienced project managers and geospatial data experts.
            Projects where no progress data is available are still undergoing quality assurance.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
