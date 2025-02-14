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
import { useVerificationUser } from "@/connections/VerificationUser";
import { useOnMount } from "@/hooks/useOnMount";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

const VerifyEmail = () => {
  const t = useT();
  const router = useRouter();
  const token = router.query.token as string;
  const [verified, setVerified] = useState(false);
  const [load, setLoad] = useState(false);

  const [, { isSuccess, requestFailed, sendVerifyUser }] = useVerificationUser({ token: token });

  useValueChanged(isSuccess, () => {
    if (isSuccess === undefined) return;
    if (isSuccess) {
      setVerified(true);
    } else {
      Log.error("Failed to verify auth");
      router.push("/");
    }
  });

  useValueChanged(requestFailed, () => {
    if (requestFailed) return router.push("/");
  });

  useOnMount(async () => {
    sendVerifyUser();
    setLoad(true);
  });

  return (
    load &&
    verified && (
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
