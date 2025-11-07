import { useT } from "@transifex/react";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFormSubmission } from "@/hooks/useFormGet";

const ConfirmPage = () => {
  const t = useT();
  const router = useRouter();
  const submissionUUID = router.query.submissionUUID as string;

  const { formData, form, isLoading } = useFormSubmission(submissionUUID);

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="w-full rounded-lg border-2 border-neutral-100 bg-white p-15">
          <LoadingContainer loading={isLoading}>
            <Icon name={IconNames.CHECK_CIRCLE} className="m-auto mb-8 stroke-secondary-500" width={60} />
            <div
              className="with-inner-html"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(form?.submissionMessage ?? "")
              }}
            />
            <div className="mt-15 flex w-full justify-between">
              <div />

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
