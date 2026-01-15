import { useT } from "@transifex/react";
import { last } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useApplication } from "@/connections/Application";
import ApplicationHeader from "@/pages/applications/components/ApplicationHeader";
import ApplicationOverview from "@/pages/applications/components/ApplicationOverview";
import ApplicationStatus from "@/pages/applications/components/ApplicationStatus";

import ApplicationTimeline from "./components/ApplicationTimeline";

const ApplicationPage = () => {
  const t = useT();
  const router = useRouter();
  const uuid = router.query.id as string;

  const [applicationLoaded, { data: application }] = useApplication({ id: uuid });
  const currentSubmission = last(application?.submissions);
  const applicationName =
    application != null ? `${application.organisationName} - ${application.fundingProgrammeName}` : "N/A";
  const applicationStatus = currentSubmission?.status ?? undefined;
  const submissionUuids = useMemo(
    () => application?.submissions.map(({ uuid }) => uuid) ?? [],
    [application?.submissions]
  );

  return (
    <>
      <div className="min-h-screen bg-background">
        <Head>
          <title>{t("Application details")}</title>
        </Head>
        <LoadingContainer loading={!applicationLoaded}>
          <ApplicationHeader name={applicationName} status={applicationStatus} uuid={uuid} />

          <div className="m-auto flex max-w-[82vw] flex-col gap-15 py-15">
            <ApplicationStatus application={application} />
            <ApplicationTimeline applicationUuid={application?.uuid} />
            <ApplicationOverview
              submissionUuids={submissionUuids}
              organisationUuid={application?.organisationUuid ?? undefined}
            />
          </div>
        </LoadingContainer>
      </div>
      <PageFooter />
    </>
  );
};

export default ApplicationPage;
