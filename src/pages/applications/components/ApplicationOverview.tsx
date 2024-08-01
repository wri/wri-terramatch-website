import { useT } from "@transifex/react";

import Tabs from "@/components/elements/Tabs/Default/Tabs";
import Text from "@/components/elements/Text/Text";
import FormSummary from "@/components/extensive/WizardForm/FormSummary";
import { FormSubmissionRead } from "@/generated/apiSchemas";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";

interface ApplicationOverviewProps {
  submissions?: FormSubmissionRead[];
}

const ApplicationOverview = ({ submissions }: ApplicationOverviewProps) => {
  const t = useT();

  return (
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
            body: <Item submission={sub} />,
            title: sub.form?.title ?? ""
          })) || []
        }
      />
    </section>
  );
};

const Item = ({ submission }: { submission?: FormSubmissionRead }) => {
  const t = useT();
  const formSteps = getCustomFormSteps(submission?.form!, t, {
    entityName: "project-pitch",
    entityUUID: submission?.project_pitch_uuid ?? ""
  });
  const values = normalizedFormDefaultValue(submission?.answers, formSteps);
  return (
    <div className="flex flex-col gap-6 bg-white p-8">
      <FormSummary steps={formSteps} values={values} />
    </div>
  );
};

export default ApplicationOverview;
