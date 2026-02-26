import { FC } from "react";
import { ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

import modules from "@/admin/modules";

export const ReportingFrameworkShow: FC = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="name" label="Name" emptyText="Not provided" />

        <TextField source="slug" label="Access Code" emptyText="Not provided" />

        <ReferenceField
          source="projectFormUuid"
          reference={modules.form.ResourceName}
          label="Project establishment flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="siteFormUuid"
          reference={modules.form.ResourceName}
          label="Site establishment flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="nurseryFormUuid"
          reference={modules.form.ResourceName}
          label="Nursery establishment flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="projectReportFormUuid"
          reference={modules.form.ResourceName}
          label="Project reporting flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="siteReportFormUuid"
          reference={modules.form.ResourceName}
          label="Site reporting flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="nurseryReportFormUuid"
          reference={modules.form.ResourceName}
          label="Nursery reporting flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>
      </SimpleShowLayout>
    </Show>
  );
};
