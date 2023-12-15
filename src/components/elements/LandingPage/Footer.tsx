import { useT } from "@transifex/react";
import Link from "next/link";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { privacyPolicyLink, termsAndConditionsLink, zendeskSupportLink } from "@/constants/links";

import Text from "../Text/Text";

export interface FooterProps {}

const Footer = (props: FooterProps) => {
  const t = useT();

  const note = t(
    "WRI would like to thank the German Federal Ministry for Environment, Nature Conservation and Nuclear Safety, Mastercard, and the Bezos Earth Fund for their support for the development of TerraMatch."
  );

  return (
    <footer className="mx-auto flex w-full max-w-[1218px] flex-col items-start gap-12 px-4 py-12 md:flex-row md:gap-29">
      <Icon name={IconNames.WRI_LOGO} width={156} height={42} className="order-1 mb-4" />
      <Text variant="text-heading-200" className="order-3 max-w-[294px] md:order-2">
        {note}
      </Text>
      <div className="order-2 flex flex-col gap-6 md:order-3">
        <Link href="/" className="block">
          <Text variant="text-heading-200">{t("Home")}</Text>
        </Link>
        <Link href={zendeskSupportLink} className="block">
          <Text variant="text-heading-200">{t("Help Center")}</Text>
        </Link>
        <Link href={privacyPolicyLink} className="block">
          <Text variant="text-heading-200">{t("Privacy Policy")}</Text>
        </Link>
        <Link href={termsAndConditionsLink} className="block">
          <Text variant="text-heading-200">{t("Terms of Service")}</Text>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
