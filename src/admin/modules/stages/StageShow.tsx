import { FunctionField, ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

import modules from "@/admin/modules";

export const StageShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="uuid" />
      <TextField source="name" />
      <ReferenceField
        label="Funding Programme"
        source="funding_programme_id"
        reference={modules.fundingProgramme.ResourceName}
        link="show"
      >
        <FunctionField render={(record: any) => record.name || "No Funding Programme Name"} />
      </ReferenceField>
      <TextField source="form.title" label="Form" />
    </SimpleShowLayout>
  </Show>
);
