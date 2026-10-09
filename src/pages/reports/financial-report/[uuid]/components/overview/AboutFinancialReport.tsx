import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import ContactSupport from "@/components/extensive/PageElements/ContactSupport/ContactSupport";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

const FINANCIAL_REPORTING_MODULE_URL =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/50430322881563-Module-4B-Financial-Reporting";
const FINANCIAL_REPORTING_FAQ_URL = "https://terramatchsupport.zendesk.com/hc/en-us/article_attachments/52776937846811";
const ENTERPRISE_FINANCIAL_REPORTING_URL =
  "https://terramatchsupport.zendesk.com/hc/en-us/articles/40711356869019-TerraFund-Enterprise-Financial-Reporting";

type AboutFinancialReportProps = {
  /** "stacked" places the helpful links below the description (sidebar); "split" places them beside it. */
  layout: "stacked" | "split";
  isEnterprise: boolean;
};

const AboutFinancialReport: FC<AboutFinancialReportProps> = ({ layout, isEnterprise }) => {
  const t = useT();

  const helpfulLinks = [
    { label: t("Financial Reporting Module"), href: FINANCIAL_REPORTING_MODULE_URL },
    { label: t("Financial Reporting FAQ"), href: FINANCIAL_REPORTING_FAQ_URL },
    ...(isEnterprise
      ? [{ label: t("TerraFund Enterprise Financial Reporting"), href: ENTERPRISE_FINANCIAL_REPORTING_URL }]
      : [])
  ];

  return (
    <Flex
      direction={layout === "split" ? { base: "column", lg: "row" } : "column"}
      gap={layout === "split" ? 12 : 6}
      backgroundColor="neutral.100"
      padding={5}
      borderRadius={1}
    >
      <Flex direction="column" gap={5} flex={layout === "split" ? 1.6 : undefined}>
        <Text color="neutral.900" textStyle="300">
          {t(
            "Your {financialReport} shows your organization's financial health and growth over time. TerraFund Team uses it to track progress across the TerraFund portfolio, demonstrate accountability, and identify further funding and support for champions.",
            {
              financialReport: (
                <Text as="span" textStyle="300-bold">
                  {t("Financial Report")}
                </Text>
              )
            }
          )}
        </Text>
        <Text color="neutral.900" textStyle="300">
          {t(
            "The report is due once a year by July 31 and opens in January. It requires audited financial statements, so plan around when yours will be ready. You can submit early once they are available."
          )}
        </Text>
        <ContactSupport
          message={t(
            "Check that figures are in the correct currency and that supporting documents are attached for each year. Need help? Contact your project manager or"
          )}
          suffix="."
          subject="Support Request for Financial Report"
        />
      </Flex>

      <Flex direction="column" gap={3} flex={layout === "split" ? 1 : undefined}>
        <Flex direction="column" gap={2}>
          <Text color="neutral.900" textStyle="500-bold">
            {t("Helpful Links")}
          </Text>
          <SimpleDivider />
        </Flex>
        <Flex direction="column" alignItems="flex-start" gap={2}>
          {helpfulLinks.map(({ label, href }) => (
            <Button
              key={href}
              as="a"
              href={href}
              variant="borderless"
              size="small"
              rightIcon={<ChevronRightIcon boxSize="0.625rem" />}
              className="justify-start truncate !whitespace-nowrap mobile:max-w-full mobile:[text-wrap:auto]"
            >
              {label}
            </Button>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AboutFinancialReport;
