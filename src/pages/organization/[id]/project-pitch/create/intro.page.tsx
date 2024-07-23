import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { usePostV2ProjectPitches } from "@/generated/apiComponents";

const IntroPage = () => {
  const t = useT();
  const router = useRouter();
  const orgId = router.query.id as string;

  const { mutate: createProjectPitch } = usePostV2ProjectPitches({
    onSuccess(data) {
      //@ts-ignore
      router.push(`/organization/${orgId}/project-pitch/create/${data.data.uuid}`);
    }
  });

  return (
    <>
      <BackgroundLayout>
        <ContentLayout>
          <WizardFormIntro
            title={t("Add New Pitch")}
            description={t(
              "Create a pitch that you can use in future funding opportunities. <br/> A project pitch should represent a tree growing project that you are seeking funding to execute."
            )}
            backButtonProps={{
              children: t("Back"),
              onClick: router.back
            }}
            submitButtonProps={{
              children: t("Continue"),
              onClick: () => createProjectPitch({ body: { organisation_id: orgId } })
            }}
          />
        </ContentLayout>
      </BackgroundLayout>
      <PageFooter />
    </>
  );
};

export default IntroPage;
