import { useT } from "@transifex/react";

const REPORT_PREPARE_SUBMIT_LINK =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/21683197977627-How-to-Prepare-Submit-Your-Reports-on-TerraMatch";

const NURSERY_REPORT_CHECKLIST_LINK =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/26920946851227-Checklists-for-your-TerraFund-Project-Nursery-and-Site-Reports";

export const useNurseryReportAboutContent = () => {
  const t = useT();

  return [
    {
      frameworks: ["terrafund", "terrafund-landscapes", "enterprises", "epa-ghana-pilot", "terrafund-3"],
      paragraphs: [
        t(
          "capture seedling production progress across any nurseries your project is building, expanding, or managing. You will report on each nursery profile, a profile may represent a single nursery or a grouping, every six months."
        ),
        t(
          "If your organization procures seedlings only from an external source, you do not need to submit nursery reports. Accurate and detailed reporting ensures your work is fully represented, supports transparency and accountability, and helps TerraFund track portfolio progress towards restoration goals."
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
          link: NURSERY_REPORT_CHECKLIST_LINK
        }
      ]
    }
  ];
};
