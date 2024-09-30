import { useT } from "@transifex/react";
import Link from "next/link";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { useMyOrg } from "@/connections/Organisation";
import { zendeskSupportLink } from "@/constants/links";

const OrganizationRejectedPage = () => {
  const [, { organisation }] = useMyOrg();
  const t = useT();

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="flex w-full flex-col items-center gap-8 bg-white py-15">
          <Icon name={IconNames.X_CIRCLE} className="fill-error-500" width={50} />
          <Text variant="text-heading-700" className="text-center uppercase">
            {t("Your organization request has been rejected.")}
          </Text>
          <div className="px-16">
            <Text variant="text-body-1000" className="text-center">
              {t(
                "Your request to create/join the organization ({ organizationName }) has been rejected. You have been locked out of the platform and your account has been rejected.",
                { organizationName: organisation?.name }
              )}
            </Text>
          </div>
          <Button as={Link} href={zendeskSupportLink}>
            {t("More Info")}
          </Button>
        </div>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default OrganizationRejectedPage;
