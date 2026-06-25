import { useT } from "@transifex/react";

const REPORT_PREPARE_SUBMIT_LINK =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/21683197977627-How-to-Prepare-Submit-Your-Reports-on-TerraMatch";

const SITE_REPORT_CHECKLIST_LINK =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/26920946851227-Checklists-for-your-TerraFund-Project-Nursery-and-Site-Reports";

const HIGH_QUALITY_PHOTOS_LINK =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/29388895801115-Submitting-High-Quality-Photos-on-TerraMatch";

const TREE_SURVIVAL_COUNT_GUIDELINES_LINK =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/23261734402203-Tree-Survival-Count-Guidelines-for-TerraFund-Projects";

export const useSiteReportAboutContent = () => {
  const t = useT();

  return [
    {
      frameworks: ["terrafund", "terrafund-landscapes", "enterprises", "epa-ghana-pilot", "terrafund-3"],
      paragraphs: [
        t(
          "are how you document restoration progress across each of your active sites every six months. You will need to submit a separate report for every active site profile on TerraMatch each reporting period."
        ),
        t(
          "Accurate and detailed site reporting is essential, it ensures your restoration work is fully and fairly represented, supports transparency and accountability, and helps TerraFund verify progress across the portfolio towards restoration goals."
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
          link: SITE_REPORT_CHECKLIST_LINK
        },
        {
          title: t("Submitting High-Quality Photos"),
          link: HIGH_QUALITY_PHOTOS_LINK
        },
        {
          title: t("Tree Survival Count Guidelines for TerraFund Projects"),
          link: TREE_SURVIVAL_COUNT_GUIDELINES_LINK
        }
      ]
    },
    {
      frameworks: ["ppc"],
      paragraphs: [
        t("are how you document restoration progress across each of your sites each quarter."),
        t(
          "Accurate and detailed site reporting is essential. It ensures your restoration work is fully and fairly represented, supports transparency and accountability, and helps the PPC team verify progress across the portfolio."
        ),
        t("If you have challenges or need assistance, contact your Project Manager/Global Lead or")
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
          "are how you document restoration progress across each of your active sites every six months. You will need to submit a separate report for every active site profile on TerraMatch each reporting period. Accurate and detailed site reporting is essential, it ensures your restoration work is fully and fairly represented, supports transparency and accountability, and helps HBF verify progress across the portfolio towards restoration goals."
        ),
        t("If you have challenges or need assistance, contact your project manager or")
      ],
      links: [
        {
          title: t("How to Prepare & Submit Your Reports on TerraMatch"),
          link: REPORT_PREPARE_SUBMIT_LINK
        }
      ]
    }
  ];
};
