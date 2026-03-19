import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Confirmation from "@/components/extensive/Confirmation/Confirmation";
import { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { userVerification } from "@/connections/VerificationUser";
import { useValueChanged } from "@/hooks/useValueChanged";

const VerifyEmail = () => {
  const t = useT();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useValueChanged(router.query.token, async () => {
    try {
      const response = await userVerification({ token: router.query.token as string });
      setIsVerified(response != null);
    } catch (error) {
      router.push("/");
    }
  });

  return (
    isVerified && (
      <BackgroundLayout>
        <ContentLayout>
          <Confirmation
            icon={IconNames.CHECK_CIRCLE_GREEN}
            title={t("Thank you for verifying your email address!")}
            iconProps={{ width: 60 }}
          >
            <Text variant="text-light-body-300" className="text-center">
              {t("You can now log into your account and start using TerraMatch")}
            </Text>
            <Button as={Link} href="/auth/login" className="mt-13">
              {t("Sign in")}
            </Button>
          </Confirmation>
        </ContentLayout>
      </BackgroundLayout>
    )
  );
};

export default VerifyEmail;
