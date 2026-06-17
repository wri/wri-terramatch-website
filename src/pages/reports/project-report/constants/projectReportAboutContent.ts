import { useT } from "@transifex/react";

const REPORT_PREPARE_SUBMIT_LINK =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/21683197977627-How-to-Prepare-Submit-Your-Reports-on-TerraMatch";

export const useProjectReportAboutContent = () => {
  const t = useT();

  return [
    {
      frameworks: ["terrafund", "terrafund-landscapes", "enterprises", "epa-ghana-pilot", "terrafund-3"],
      paragraphs: [
        t(
          "are how you share your project's overall progress with WRI and your funders every six months. Accurate and detailed reporting is essential, it ensures your work is fairly represented, supports transparency and accountability, and helps TerraFund track progress across the portfolio towards restoration goals, community engagement, and socioeconomic impacts."
        ),
        t(
          "To support your reporting efforts, TerraFund team has created guidance articles to help you report clearly, thoroughly."
        ),
        t("If you have challenges or need assistance, contact your project manager or")
      ],
      links: [
        {
          title: t("How to Prepare & Submit Your Reports on TerraMatch"),
          link: REPORT_PREPARE_SUBMIT_LINK
        },
        {
          title: t("Checklists for your TerraFund Reports"),
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/26920946851227-Checklists-for-your-TerraFund-Project-Nursery-and-Site-Reports"
        },
        {
          title: t("TerraFund Report Quality Assurance Process"),
          link: "https://terramatchsupport.zendesk.com/hc/en-us/categories/12512083927579-TerraFund-Program-Hub"
        },
        {
          title: t("TerraFund Guidance for Socioeconomic Reporting"),
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/27167882984859-TerraFund-Guidance-for-Socioeconomic-Reporting"
        }
      ]
    },
    {
      frameworks: ["ppc"],
      paragraphs: [
        t(
          "are how you share your project's overall progress with your Project Manager/Global Lead each quarter. Accurate and detailed reporting is essential. It ensures your work is fairly represented, supports transparency and accountability, and helps the PPC team track progress across the portfolio."
        ),
        t("Beside you can find guidance to help you with reporting."),
        t("If you encounter challenges or need assistance, contact your Project Manager/Global Lead or")
      ],
      links: [
        {
          title: t("How to Prepare & Submit Your Reports on TerraMatch"),
          link: REPORT_PREPARE_SUBMIT_LINK
        },
        {
          title: t('How to calculate "person-days of work"'),
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13705002950683-How-to-calculcate-person-days-of-work"
        }
      ]
    },
    {
      frameworks: ["hbf"],
      paragraphs: [
        t(
          "are how you share your project's overall progress with WRI and your funders every six months. Accurate and detailed reporting is essential, it ensures your work is fairly represented, supports transparency and accountability, and helps the HBF team track progress across the portfolio towards restoration goals, community engagement, and socioeconomic impacts."
        ),
        t("If you have challenges or need assistance, contact your project manager or")
      ],
      links: [
        {
          title: t("How to Prepare & Submit Your Reports on TerraMatch"),
          link: REPORT_PREPARE_SUBMIT_LINK
        },
        {
          title: t("HBF Reporting Guidance"),
          link: "https://terramatchsupport.zendesk.com/hc/en-us/categories/18003977594523-Harit-Bharat-Fund-Program-Hub"
        },
        {
          title: t("HBF Handbook"),
          link: "https://terramatchsupport.zendesk.com/hc/en-us/categories/18003977594523-Harit-Bharat-Fund-Program-Hub"
        }
      ]
    }
  ];
};
