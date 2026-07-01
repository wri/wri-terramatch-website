import { useT } from "@transifex/react";
import { useMemo } from "react";

export const useAboutSitesContent = () => {
  const t = useT();

  return useMemo(
    () => [
      {
        frameworks: ["terrafund", "terrafund-landscapes", "enterprises", "epa-ghana-pilot", "terrafund-3"],
        title: t("About Sites"),
        paragraph1: t(
          " are the core units for reporting your restoration work in TerraMatch. Each site can include one or more restoration areas or polygons and should reflect a meaningful geographic grouping for your project."
        ),
        paragraph2: t(
          "Keep your site profiles up to date to track progress, report challenges, and share successes. If you have challenges or need assistance, please reach out to your project manager or"
        ),
        links: [
          {
            title: t("Follow the TerraFund Siting Guide"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/25201750730907-TerraFund-Siting-Guide"
          },
          {
            title: t("Create a Site Profile"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/12512561941915-How-to-Create-a-Site-Profile"
          },
          {
            title: t("Use the Site Profile Polygon Guide"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/27065988566811-How-to-Add-Edit-and-View-Polygons-on-your-Site-Profiles"
          },
          {
            title: t("Download & Use Greenhouse.Flority"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/24537092253467-How-to-Download-Use-greenhouse-Flority"
          }
        ]
      },
      {
        frameworks: ["hbf"],
        title: t("About Sites"),
        paragraph1: t(
          " are the core units for reporting your restoration work in TerraMatch. Each site can include one or more restoration areas or polygons and should reflect a meaningful geographic grouping for your project."
        ),
        paragraph2: t(
          "Keep your site profiles up to date to track progress, report challenges, and share successes. If you have challenges or need assistance, please reach out to your project manager or"
        ),
        links: [
          {
            title: t("How to Create a Site on TerraMatch"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/12512561941915-How-to-Create-a-Site-on-TerraMatch"
          },
          {
            title: t("Citizen Science App User Manual"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/27520000999835-Citizen-Science-App-User-Manual"
          }
        ]
      },
      {
        frameworks: ["ppc"],
        title: t("About Sites"),
        paragraph1: t(
          " are the core units for reporting your restoration work on the IMP. Each site typically includes one restoration area (polygon), but can include multiple areas, based on proximity and other characteristics. Please review your siting approach with your Project Manager or Global Lead to determine how many sites you need to create for your PPC project."
        ),
        paragraph2: t(
          "Keep your site profiles up to date to track progress, report challenges, and share successes. If you have challenges or need assistance, please reach out to"
        ),
        links: [
          {
            title: t("What is the PPC definition of a site? "),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13157025276187-What-is-the-PPC-definition-of-a-site"
          },
          {
            title: t("How to Create a Site Profile"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/12512561941915-How-to-Create-a-Site-Profile"
          },
          {
            title: t("Review the PPC Monitoring Framework"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13319985438363-What-is-the-Tree-Restoration-Monitoring-Framework"
          }
        ]
      }
    ],
    [t]
  );
};
