import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";

const ConfirmPage = () => {
  const t = useT();
  const router = useRouter();
  const uuid = router.query.pitchUUID;

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="flex w-full flex-col items-center gap-8 bg-white px-16 py-15">
          <Icon name={IconNames.CHECK_CIRCLE} className="stroke-secondary-500" width={60} />
          <Text variant="text-heading-700">{t("Pitch Created!")}</Text>
          <Text variant="text-body-1000" className="text-center" containHtml>
            {t(
              "Your pitch has now been created.<br/> You can use it apply to any upcoming opportunities on the platform."
            )}
          </Text>
          <Button as={Link} href={`/project-pitches/${uuid}`}>
            {t("View Pitch")}
          </Button>
        </div>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ConfirmPage;
