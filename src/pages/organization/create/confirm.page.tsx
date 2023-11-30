import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";

const ConfirmPage = () => {
  const t = useT();

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="flex w-full flex-col items-center gap-8 bg-white px-16 py-15">
          <Icon name={IconNames.CHECK_CIRCLE} className="stroke-secondary-500" width={60} />
          <Text variant="text-heading-700">{t("ORGANIZATIONAL PROFILE CREATED")}</Text>
          <Text variant="text-body-1000" className="text-center" containHtml>
            {t(
              "Thank you for setting up your organizational profile on TerraMatch. TerraMatch representatives will be reaching out if they have any questions about your account. <br/><br/>In the meantine, you can complete your organizational profile and read more about the funding opportunities offered in TerraMatch."
            )}
          </Text>
          <Button as="a" href="/">
            {t("Go to terramatch")}
          </Button>
        </div>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ConfirmPage;
