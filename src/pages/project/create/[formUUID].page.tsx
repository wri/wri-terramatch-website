import { useT } from "@transifex/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2FormsUUID, usePostV2FormsProjectsUUID } from "@/generated/apiComponents";
import { FormRead } from "@/generated/apiSchemas";

/**
 * Use this route to create a project with a given form_uuid
 */
const ProjectIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const formUUID = router.query.formUUID as string;

  const { data: formData, isError } = useGetV2FormsUUID<{ data: FormRead }>({
    pathParams: { uuid: formUUID },
    queryParams: { lang: router.locale }
  });

  const {
    mutate: createProject,
    isLoading,
    isSuccess
  } = usePostV2FormsProjectsUUID({
    onSuccess(data) {
      //@ts-ignore
      router.replace(`/entity/projects/edit/${data.data.uuid}`);
    }
  });

  if (isError) {
    return notFound();
  }

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={!formData?.data}>
          <WizardFormIntro
            title={formData?.data.title!}
            //@ts-ignore
            imageSrc={formData?.data?.banner?.url}
            description={formData?.data.description}
            deadline={formData?.data.deadline_at}
            ctaProps={{
              children: formData?.data.documentation_label || t("View list of questions"),
              as: Link,
              href: formData?.data.documentation,
              target: "_blank"
            }}
            submitButtonProps={{
              children: t("Continue"),
              disabled: isLoading || isSuccess,
              onClick: () => {
                createProject({
                  pathParams: {
                    uuid: formUUID
                  }
                });
              }
            }}
            backButtonProps={{
              children: t("Cancel"),
              onClick: () => router.back()
            }}
          />
        </LoadingContainer>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ProjectIntroPage;
