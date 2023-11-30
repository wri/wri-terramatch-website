import { FC } from "react";
import { ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

import modules from "@/admin/modules";

export const ReportingFrameworkShow: FC = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="name" label="Name" emptyText="Not provided" />

        <TextField source="access_code" label="Access Code" emptyText="Not provided" />

        <ReferenceField
          source="project_form_uuid"
          reference={modules.form.ResourceName}
          label="Project establishment flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="site_form_uuid"
          reference={modules.form.ResourceName}
          label="Site establishment flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="nursery_form_uuid"
          reference={modules.form.ResourceName}
          label="Nursery establishment flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="project_report_form_uuid"
          reference={modules.form.ResourceName}
          label="Project reporting flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="site_report_form_uuid"
          reference={modules.form.ResourceName}
          label="Site reporting flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="nursery_report_form_uuid"
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
