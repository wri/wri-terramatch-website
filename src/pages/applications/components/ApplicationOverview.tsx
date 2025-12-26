import { useT } from "@transifex/react";
import { Dictionary, uniq } from "lodash";
import { FC, useMemo, useState } from "react";

import Tabs from "@/components/elements/Tabs/Default/Tabs";
import Text from "@/components/elements/Text/Text";
import FormSummary from "@/components/extensive/WizardForm/FormSummary";
import { loadForm } from "@/connections/Form";
import { loadSubmission } from "@/connections/FormSubmission";
import FrameworkProvider from "@/context/framework.provider";
import WizardFormProvider, { FormModel, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { useGetV2OrganisationsUUID } from "@/generated/apiComponents";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { SubmissionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formDefaultValues } from "@/helpers/customForms";
import { useStableProps } from "@/hooks/useStableProps";
import { useValueChanged } from "@/hooks/useValueChanged";
import { isNotNull } from "@/utils/array";

interface ApplicationOverviewProps {
  submissionUuids?: string[];
  organisationUuid?: string;
}

const useSubmissions = (submissionUuids?: string[]) => {
  const [submissions, setSubmissions] = useState<Dictionary<SubmissionDto>>();
  useValueChanged(submissionUuids, async () => {
    if (submissionUuids == null || submissionUuids.length === 0) return;

    const results = await Promise.all(submissionUuids.map(id => loadSubmission({ id })));
    setSubmissions(
      results.reduce(
        (submissions, { data }) => (data == null ? submissions : { ...submissions, [data.uuid]: data }),
        submissions ?? ({} as Dictionary<SubmissionDto>)
      )
    );
  });

  return submissions;
};

const useFormTitles = (formUuids?: string[]) => {
  const [formTitles, setFormTitles] = useState<Dictionary<string>>();
  useValueChanged(formUuids, async () => {
    if (formUuids == null || formUuids.length === 0) return;

    const results = await Promise.all(formUuids.map(id => loadForm({ id })));
    setFormTitles(
      results.reduce(
        (titles, { data }) => (data == null ? titles : { ...titles, [data.uuid]: data.title }),
        formTitles ?? ({} as Dictionary<string>)
      )
    );
  });

  return formTitles;
};

const ApplicationOverview: FC<ApplicationOverviewProps> = props => {
  const t = useT();
  const { submissionUuids, organisationUuid } = useStableProps(props);
  const submissions = useSubmissions(submissionUuids);
  const formUuids = useMemo(
    () => uniq(Object.values(submissions ?? {}).map(({ formUuid }) => formUuid)).filter(isNotNull),
    [submissions]
  );
  const titles = useFormTitles(formUuids);
  const { data: orgData, isLoading: orgLoading } = useGetV2OrganisationsUUID<{ data: V2OrganisationRead }>(
    { pathParams: { uuid: organisationUuid ?? "" } },
    { enabled: organisationUuid != null }
  );

  return titles == null || orgLoading ? null : (
    <section>
      <Text variant="text-bold-headline-1000">{t("Application Overview")}</Text>
      <Tabs
        className="mt-8 overflow-hidden rounded-lg border-2 border-neutral-100"
        itemOption={{
          width: 240
        }}
        onChangeSelected={() => {}}
        tabItems={(submissionUuids ?? []).map(uuid => {
          const submission = submissions?.[uuid];
          return {
            renderBody: () => <Item submission={submission} organisation={orgData} />,
            title: titles[submission?.formUuid ?? ""] ?? ""
          };
        })}
      />
    </section>
  );
};

const Item = ({ submission, organisation }: { submission?: SubmissionDto; organisation: any }) => {
  const frameworkKey = submission?.frameworkKey;
  const formUuid = submission?.formUuid;
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formUuid);
  const values = useMemo(
    () => formDefaultValues(submission?.answers ?? {}, fieldsProvider),
    [fieldsProvider, submission?.answers]
  );
  const models = useMemo<FormModel[]>(
    () => [
      { model: "projectPitches", uuid: submission?.projectPitchUuid ?? "" },
      { model: "organisations", uuid: organisation?.uuid }
    ],
    [organisation?.uuid, submission?.projectPitchUuid]
  );

  return !providerLoaded ? null : (
    <FrameworkProvider frameworkKey={frameworkKey}>
      <WizardFormProvider models={models} fieldsProvider={fieldsProvider}>
        <div className="flex flex-col gap-6 bg-white p-8">
          {formUuid == null ? null : <FormSummary values={values} organisation={organisation} />}
        </div>
      </WizardFormProvider>
    </FrameworkProvider>
  );
};

export default ApplicationOverview;
