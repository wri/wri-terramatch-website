import { useT } from "@transifex/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Link from "next/link";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Confirmation from "@/components/extensive/Confirmation/Confirmation";
import { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { fetchPatchV2AuthVerify } from "@/generated/apiComponents";
import Log from "@/utils/log";

const VerifyEmail: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const t = useT();
  return (
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
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const token = query.token as string;
  let options = {};

  try {
    await fetchPatchV2AuthVerify({ body: { token } });
  } catch (e) {
    Log.error("Failed to verify auth", e);
    options = {
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }

  return {
    ...options,
    props: {}
  };
};

export default VerifyEmail;
