import { useT } from "@transifex/react";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2FormsSubmissionsUUID } from "@/generated/apiComponents";
import { FormSubmissionRead } from "@/generated/apiSchemas";

/* Todo: To select actions and their copies based on form's parent(application, project, site, etc) in 2.4 */
const ConfirmPage = () => {
  const t = useT();
  const router = useRouter();
  const submissionUUID = router.query.submissionUUID as string;

  const { data: formData, isLoading } = useGetV2FormsSubmissionsUUID<{ data: FormSubmissionRead }>(
    { pathParams: { uuid: submissionUUID }, queryParams: { lang: router.locale } },
    {
      enabled: !!submissionUUID
    }
  );

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="w-full rounded-lg border-2 border-neutral-100 bg-white p-15">
          <LoadingContainer loading={isLoading}>
            <Icon name={IconNames.CHECK_CIRCLE} className="m-auto mb-8 stroke-secondary-500" width={60} />
            <div
              className="with-inner-html"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(formData?.data.form?.submission_message || "")
              }}
            />
            <div className="mt-15 flex w-full justify-between">
              <div />

              {/* @ts-ignore */}
              <Button as={Link} href={`/applications/${formData?.data.application_uuid}`}>
                {t("View My Application")}
              </Button>
            </div>
          </LoadingContainer>
        </div>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ConfirmPage;
