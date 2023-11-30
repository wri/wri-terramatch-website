import { NumberInput, SelectInput, SimpleForm, TextInput, useGetList, useRecordContext } from "react-admin";
import { useSearchParams } from "react-router-dom";

import modules from "@/admin/modules";

const StageForm = () => {
  const [searchParams] = useSearchParams();
  const record = useRecordContext();
  const fundingProgrammeId = searchParams.get("funding_programme_id");

  const { data: forms, isLoading } = useGetList(modules.form.ResourceName, { pagination: { page: 1, perPage: 100 } });

  return (
    <SimpleForm>
      <TextInput source="funding_programme_id" defaultValue={fundingProgrammeId} disabled={true} fullWidth />
      <TextInput source="name" fullWidth />
      <NumberInput source="order" />
      <SelectInput
        fullWidth
        source="form_id"
        choices={forms ?? []}
        optionText="title"
        defaultValue={record?.form?.uuid}
        optionValue="uuid"
        isLoading={isLoading}
      />
    </SimpleForm>
  );
};

export default StageForm;
