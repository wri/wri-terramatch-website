import { useT } from "@transifex/react";
import DOMPurify from "isomorphic-dompurify";

import Button from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useMyOrg } from "@/connections/Organisation";
import { useEntityForm } from "@/hooks/useFormGet";

const ConfirmPage = () => {
  const t = useT();
  const [, { organisationId }] = useMyOrg();
  const { form, isLoading } = useEntityForm(organisationId == null ? undefined : "organisations", organisationId);

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="flex w-full flex-col items-center gap-8 bg-white px-16 py-15">
          <LoadingContainer loading={isLoading}>
            <Icon name={IconNames.CHECK_CIRCLE} className="stroke-secondary-500" width={60} />
            <div
              className="with-inner-html text-center"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(form?.submissionMessage == null ? "" : t(form.submissionMessage))
              }}
            />
            <Button as="a" href="/">
              {t("Go to terramatch")}
            </Button>
          </LoadingContainer>
        </div>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ConfirmPage;
