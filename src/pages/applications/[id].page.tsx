import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2ApplicationsUUID } from "@/generated/apiComponents";
import { ApplicationRead, FormSubmissionRead } from "@/generated/apiSchemas";
import ApplicationHeader from "@/pages/applications/components/ApplicationHeader";
import ApplicationOverview from "@/pages/applications/components/ApplicationOverview";
import ApplicationStatus from "@/pages/applications/components/ApplicationStatus";

import ApplicationTimeline from "./components/ApplicationTimeline";

const ApplicationPage = () => {
  const t = useT();
  const router = useRouter();
  const uuid = router.query.id as string;

  const {
    data: applicationData,
    isLoading: applicationLoading,
    isFetching: applicationFetching
  } = useGetV2ApplicationsUUID<{ data: ApplicationRead }>({
    pathParams: {
      uuid
    }
  });
  const application = applicationData?.data;
  const currentSubmission = application?.current_submission as FormSubmissionRead;
  const applicationName = application
    ? `${application?.organisation?.name} - ${application?.funding_programme?.name}`
    : "N/A";
  const applicationStatus = currentSubmission?.status;

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>{t("Application details")}</title>
      </Head>
      <LoadingContainer loading={applicationLoading || applicationFetching}>
        <ApplicationHeader name={applicationName} status={applicationStatus} uuid={uuid} />

        <div className="m-auto flex max-w-7xl flex-col gap-15 p-15">
          <ApplicationStatus application={application!} />
          <ApplicationTimeline application={application} />
          <ApplicationOverview submissions={application?.form_submissions} />
        </div>
      </LoadingContainer>
    </div>
  );
};

export default ApplicationPage;
