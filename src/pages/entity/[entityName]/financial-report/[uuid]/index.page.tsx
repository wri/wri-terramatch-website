import { notFound } from "next/navigation";
import { useRouter } from "next/router";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import FrameworkProvider from "@/context/framework.provider";
import { useGetV2ENTITYUUID, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

import { MOCKED_FINANCIAL_REPORT_TITLE, STEPS_MOCKED_DATA_FINANCIAL_REPORT } from "./mockedData";

const FinancialReportPage = () => {
  const router = useRouter();
  const entityName = router.query.entityName as EntityName;
  const entityUUID = router.query.uuid as string;

  const { data: entityData, isLoading: getEntityLoading } = useGetV2ENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID }
  });
  const entity = entityData?.data ?? {};

  const { isLoading, isError } = useGetV2FormsENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID },
    queryParams: { lang: router.locale }
  });
  //@ts-ignore

  if (isError) {
    return notFound();
  }

  return (
    <BackgroundLayout>
      <FrameworkProvider frameworkKey={entity.framework_key}>
        <LoadingContainer loading={isLoading || getEntityLoading}>
          <WizardForm
            title={MOCKED_FINANCIAL_REPORT_TITLE}
            steps={STEPS_MOCKED_DATA_FINANCIAL_REPORT}
            onStepChange={Log.info}
            onChange={Log.info}
            onBackFirstStep={() => router.back()}
            nextButtonText="Save and Continue"
            submitButtonText="Submit"
            hideBackButton={false}
            initialStepIndex={1}
            tabOptions={{
              disableFutureTabs: false,
              markDone: true
            }}
          />
        </LoadingContainer>
        <br />
        <PageFooter />
      </FrameworkProvider>
    </BackgroundLayout>
  );
};

export default FinancialReportPage;
