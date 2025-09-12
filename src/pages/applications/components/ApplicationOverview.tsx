import { useT } from "@transifex/react";

import Tabs from "@/components/elements/Tabs/Default/Tabs";
import Text from "@/components/elements/Text/Text";
import FormSummary from "@/components/extensive/WizardForm/FormSummary";
import FrameworkProvider from "@/context/framework.provider";
import { FormSubmissionRead } from "@/generated/apiSchemas";
import { formDefaultValues } from "@/helpers/customForms";
import { Entity } from "@/types/common";

interface ApplicationOverviewProps {
  submissions?: FormSubmissionRead[];
  organisation?: any;
}

const ApplicationOverview = ({ submissions, organisation }: ApplicationOverviewProps) => {
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
            renderBody: () => <Item submission={sub} organisation={organisation} />,
            title: sub.form?.title ?? ""
          })) || []
        }
      />
    </section>
  );
};

const Item = ({ submission, organisation }: { submission?: FormSubmissionRead; organisation: any }) => {
  const currentPitchEntity: Entity = {
    entityName: "project-pitches",
    entityUUID: submission?.project_pitch_uuid ?? ""
  };
  const frameworkKey = submission?.form!.framework_key;
  const formUuid = submission?.form?.uuid;
  const values = formUuid == null ? {} : formDefaultValues(submission?.answers, formUuid);
  return (
    <FrameworkProvider frameworkKey={frameworkKey}>
      <div className="flex flex-col gap-6 bg-white p-8">
        {formUuid == null ? null : (
          <FormSummary formUuid={formUuid} values={values} entity={currentPitchEntity} organisation={organisation} />
        )}
      </div>
    </FrameworkProvider>
  );
};

export default ApplicationOverview;
