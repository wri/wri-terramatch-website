import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useTimer } from "use-timer";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Confirmation from "@/components/extensive/Confirmation/Confirmation";
import { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { useResendVerification } from "@/connections/VerificationUser";
import { zendeskSupportLink } from "@/constants/links";
import { useOnMount } from "@/hooks/useOnMount";
import { useQueryString } from "@/hooks/useQueryString";

const SignupConfirmPage = () => {
  const t = useT();
  const timer = useTimer({ initialTime: 30, timerType: "DECREMENTAL", autostart: true, endTime: 0 });
  const router = useRouter();
  const email = useQueryString().email as string;

  const { create, isCreating } = useResendVerification({}, () => {
    timer.reset();
    timer.start();
  });

  useOnMount(() => {
    if (email == null) router.push("/auth/signup");
  });

  const handleResend = () =>
    create({
      emailAddress: email,
      callbackUrl: window.location.origin + "/auth/verify/email/"
    });

  return email == null ? null : (
    <BackgroundLayout>
      <ContentLayout>
        <Confirmation icon={IconNames.MAIL_SENT} title={t("Confirm your email address")}>
          <div className="flex w-full flex-col items-center gap-8 border-b border-neutral-200 pb-8">
            <Text variant="text-light-body-300" className="text-center" containHtml>
              {t(
                "Thank you for signing up. We have sent a confirmation email to <b class='font-bold'>{email}</b>. Check your email and click on the confirmation link to start using TerraMatch.",
                { email }
              )}
            </Text>
            <Text variant="text-light-body-300" className="text-center" containHtml>
              {t(
                `If you encounter any issues with verifying your email address, please reach out to TerraMatch Support by clicking <a href="${zendeskSupportLink}" target="_blank" rel="noopenner noreferrer">here</a>.`
              )}
            </Text>
          </div>
          <Text variant="text-light-body-300" className="mt-13">
            {t("Haven't received your email? Click the button below to resend it.")}
          </Text>
          <Button disabled={timer.status === "RUNNING" || isCreating} onClick={handleResend} className="mt-6">
            {timer.status === "STOPPED" ? t("Resend Email") : t(`Try again in {time}s`, { time: timer.time })}
          </Button>
        </Confirmation>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default SignupConfirmPage;
