import { useT } from "@transifex/react";
import { Dictionary, uniq } from "lodash";
import { useMemo, useState } from "react";

import Tabs from "@/components/elements/Tabs/Default/Tabs";
import Text from "@/components/elements/Text/Text";
import FormSummary from "@/components/extensive/WizardForm/FormSummary";
import { loadForm } from "@/connections/Form";
import FrameworkProvider from "@/context/framework.provider";
import WizardFormProvider, { FormModel, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { FormSubmissionRead } from "@/generated/apiSchemas";
import { formDefaultValues } from "@/helpers/customForms";
import { useValueChanged } from "@/hooks/useValueChanged";
import { isNotNull } from "@/utils/array";

interface ApplicationOverviewProps {
  submissions?: FormSubmissionRead[];
  organisation?: any;
}

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

const ApplicationOverview = ({ submissions, organisation }: ApplicationOverviewProps) => {
  const t = useT();
  const formUuids = useMemo(
    () => uniq(submissions?.map(submission => submission.form_uuid)).filter(isNotNull),
    [submissions]
  );
  const titles = useFormTitles(formUuids);

  return titles == null ? null : (
    <section>
      <Text variant="text-bold-headline-1000">{t("Application Overview")}</Text>
      <Tabs
        className="mt-8 overflow-hidden rounded-lg border-2 border-neutral-100"
        itemOption={{
          width: 240
        }}
        onChangeSelected={() => {}}
        tabItems={
          submissions?.map(sub => ({
            renderBody: () => <Item submission={sub} organisation={organisation} />,
            title: titles[sub.form_uuid ?? ""] ?? ""
          })) || []
        }
      />
    </section>
  );
};

const Item = ({ submission, organisation }: { submission?: FormSubmissionRead; organisation: any }) => {
  const frameworkKey = submission?.framework_key;
  const formUuid = submission?.form_uuid;
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formUuid);
  const values = useMemo(
    () => formDefaultValues(submission?.answers ?? {}, fieldsProvider),
    [fieldsProvider, submission?.answers]
  );
  const model = useMemo<FormModel>(
    () => ({ model: "projectPitches", uuid: submission?.project_pitch_uuid ?? "" }),
    [submission?.project_pitch_uuid]
  );

  return !providerLoaded ? null : (
    <FrameworkProvider frameworkKey={frameworkKey}>
      <WizardFormProvider models={model} fieldsProvider={fieldsProvider}>
        <div className="flex flex-col gap-6 bg-white p-8">
          {formUuid == null ? null : <FormSummary values={values} organisation={organisation} />}
        </div>
      </WizardFormProvider>
    </FrameworkProvider>
  );
};

export default ApplicationOverview;
