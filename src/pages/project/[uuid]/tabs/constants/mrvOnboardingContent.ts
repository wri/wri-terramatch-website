import { useT } from "@transifex/react";

export const useMrvOnboardingContent = () => {
  const t = useT();

  return [
    {
      frameworks: ["terrafund", "terrafund-landscapes", "enterprises", "epa-ghana-pilot", "terrafund-3"],
      content: {
        introText: t(
          "Monitoring, Reporting, and Verification refers to the set of processes used to track your project's progress over time. "
        ),
        monitoring: t(
          "The process of collecting and analyzing data and information to measure progress toward specific goals that the restoration effort aims to achieve."
        ),
        reporting: t(
          "The sharing of data collected by restoration champions through project, nursery, and site reports, which are submitted on the TerraMatch platform in a standardized format every six months."
        ),
        verification: t(
          "Periodically subjecting reported information to some form of review, analysis or independent assessment to establish completeness and reliability."
        ),
        mrvLinkPrefix: t("Learn more in the full"),
        mrvLinkText: t("MRV framework"),
        mrvFrameworkLink:
          "https://terramatchsupport.zendesk.com/hc/en-us/articles/21972136717979-Glossary-Monitoring-Reporting-Verification",
        helpfulLinks: [
          {
            title: t("MRV Glossary"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/21972136717979-Glossary-TerraFund-Monitoring-Reporting-Verification"
          },
          {
            title: t("Project Establishment Checklist"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/45890074377755-Checklists-Tips-for-TerraFund-Project-Nursery-and-Site-Establishment"
          },
          {
            title: t("How to Complete Your Project Profile"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/21995497152027-How-to-Create-Your-TerraMatch-Project-Profile"
          },
          {
            title: t("How to Add Partners to Your Project"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/22124468665243-How-to-Add-Partners-to-Your-Project"
          }
        ]
      }
    },
    {
      frameworks: ["hbf"],
      content: {
        introText: t(
          "Monitoring, Reporting, and Verification refers to the set of processes used to track your project's progress over time. "
        ),
        monitoring: t(
          "The process of collecting and analyzing data and information to measure progress toward specific goals that the restoration effort aims to achieve."
        ),
        reporting: t(
          "The sharing of data collected by restoration champions through project and site reports, which are submitted on the TerraMatch platform in a standardized format every six months."
        ),
        verification: t(
          "Periodically subjecting reported information to some form of review, analysis or independent assessment to establish completeness and reliability."
        ),
        mrvLinkPrefix: t("Learn more in the full"),
        mrvLinkText: t("MRV framework"),
        mrvFrameworkLink:
          "https://terramatchsupport.zendesk.com/hc/en-us/articles/21178354112539-The-TerraFund-Monitoring-Reporting-and-Verification-Framework?brand_id=12511322362267",
        helpfulLinks: [
          {
            title: t("MRV Glossary"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/21972136717979-Glossary-TerraFund-Monitoring-Reporting-Verification"
          },
          {
            title: t("How to Complete Your Project Profile "),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/21995497152027-How-to-Create-Your-TerraMatch-Project-Profile"
          },
          {
            title: t("How to Add Partners to Your Project"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/22124468665243-How-to-Add-Partners-to-Your-Project"
          }
        ]
      }
    },
    {
      frameworks: ["ppc"],
      content: {
        introText: t(
          "Monitoring, Reporting, and Verification refers to the set of processes used to track your project's progress over time."
        ),
        monitoring: t(
          "refers to checking your project against a set of indicators (these can be ecological, like “Trees restored” or socioeconomic, like “Workdays created”) at pre-determined intervals (for example, Year 0, Year 2.5, and Year 5 of a project)."
        ),
        reporting: t(
          "refers to your team’s work, filling out project, site, socioeconomic restoration partners, and disturbance reports on TerraMatch."
        ),
        verification: t("refers to remote or field-based measurement of project progress."),
        mrvLinkPrefix: t("Learn more about project tracking in the"),
        mrvLinkText: t("PPC Monitoring Framework"),
        mrvFrameworkLink:
          "https://terramatchsupport.zendesk.com/hc/en-us/articles/13319985438363-What-is-the-Tree-Restoration-Monitoring-Framework",
        helpfulLinks: [
          {
            title: t("How to Submit Your Quarterly Reports"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13322085147035-How-to-Submit-Your-Quarterly-Reports-PPC"
          },
          {
            title: t("How to report (annually) on PPC Socioeconomic Restoration Partners"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13322399098267-How-to-report-annually-on-PPC-Socioeconomic-Restoration-Partners"
          },
          {
            title: t("How to do Field Tree Monitoring"),
            link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13384531523227-How-to-do-Field-Tree-Monitoring-for-the-PPC"
          }
        ]
      }
    }
  ];
};
