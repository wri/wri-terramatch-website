import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";

const RequestMoreInformationSuccessPage = () => {
  const t = useT();
  const router = useRouter();
  const uuid = router.query.id as string;

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="flex w-full flex-col items-center gap-8 bg-white px-16 py-15">
          <Icon name={IconNames.CHECK_CIRCLE} className="stroke-success" width={60} />
          <div className="flex flex-col gap-4">
            <Text variant="text-heading-700" className="text-center uppercase">
              {t("THANK YOU FOR RESUBMITTING YOUR APPLICATION!")}
            </Text>
            <Text variant="text-body-1000" className="text-center">
              {t("The WRI team will review your updates and will be in touch with updates.")}
            </Text>
          </div>
          <div className="flex flex-col gap-4">
            <Text variant="text-heading-200">{t("Next Steps:")}</Text>
            <Text variant="text-body-1000">
              {t("Once your application updates have been reviewed, there are several scenarios that can happen.")}
            </Text>
            <ul className="ml-4 flex list-disc flex-col gap-2">
              <li>
                <Text variant="text-body-1000">
                  {t(
                    "Further information may be requested by one of the WRI members to continue reviewing your application."
                  )}
                </Text>
              </li>
              <li>
                <Text variant="text-body-1000">
                  {t(
                    "Your application may be successful, in which case, you will be contacted to explain how to transition your project to the next phase."
                  )}
                </Text>
              </li>
              <li>
                <Text variant="text-body-1000">
                  {t(
                    "Your application may be rejected, in which case, you will be contacted to offer you alternatives."
                  )}
                </Text>
              </li>
            </ul>
          </div>
          <Button as={Link} href={`/applications/${uuid}`}>
            {t("View My Application")}
          </Button>
        </div>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default RequestMoreInformationSuccessPage;
