import { useT } from "@transifex/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useTimer } from "use-timer";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { usePostAuthReset } from "@/generated/apiComponents";

const SignupConfirmPage = ({ email }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useT();
  const timer = useTimer({ initialTime: 30, timerType: "DECREMENTAL", autostart: true, endTime: 0 });
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");

  const baseAuthPath = isAdmin ? "/admin/auth" : "/auth";

  const { mutateAsync: requestResetPassword } = usePostAuthReset({
    onSuccess(_, variables) {
      timer.reset();
      timer.start();
    }
  });

  const handleResend = async () =>
    requestResetPassword({
      body: { email_address: email, callback_url: window.location.origin + `${baseAuthPath}/reset-password/` }
    });

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="flex w-full flex-col items-center gap-8 bg-white px-16 py-15">
          <Icon name={IconNames.MAIL_SENT} className="fill-black" width={50} />
          <Text variant="text-heading-700">{t("Your Request Has Been Sent")}</Text>
          <Text variant="text-body-1000" className="text-center" containHtml>
            {t(
              "Your request to change your password has been sent successfully to <strong>{email}</strong>. Please check your email for the link to reset your password. After you've completed the process, you will be able to log in with your new password.",
              { email }
            )}
          </Text>
          <Text variant="text-body-600">{t("Haven't received your email? Click the button below to resend it.")}</Text>
          <Button disabled={timer.status === "RUNNING"} onClick={handleResend}>
            {timer.status === "STOPPED" ? t("Resend Email") : t(`Try again in {time}s`, { time: timer.time })}
          </Button>
        </div>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const email = ctx.query.email;

  let options = {};
  if (!email)
    options = {
      redirect: {
        permanent: false,
        destination: "/auth/reset-password"
      }
    };

  return {
    ...options,
    props: {
      email: email as string
    }
  };
};

export default SignupConfirmPage;
