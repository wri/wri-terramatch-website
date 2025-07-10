import { FC } from "react";
import { AutocompleteInput, Create, ReferenceInput, required, SimpleForm, TextInput } from "react-admin";

import modules from "@/admin/modules";

export const ReportingFrameworkCreate: FC = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" label="Name" fullWidth validate={required()} />
        <TextInput source="access_code" label="Access Code" fullWidth validate={required()} />
        <ReferenceInput source="project_form_uuid" reference={modules.form.ResourceName} filter={{ type: "project" }}>
          <AutocompleteInput optionText="title" label="Project Establishment Form" fullWidth validate={required()} />
        </ReferenceInput>

        <ReferenceInput source="site_form_uuid" reference={modules.form.ResourceName} filter={{ type: "site" }}>
          <AutocompleteInput optionText="title" label="Site Establishment Form" fullWidth validate={required()} />
        </ReferenceInput>

        <ReferenceInput source="nursery_form_uuid" reference={modules.form.ResourceName} filter={{ type: "nursery" }}>
          <AutocompleteInput
            optionText="title"
            label="Nursery Establishment Form"
            fullWidth
            helperText="If this reporting framework doesn't require nurseries, please leave this section blank."
          />
        </ReferenceInput>

        <ReferenceInput
          source="project_report_form_uuid"
          reference={modules.form.ResourceName}
          filter={{ type: "project-report" }}
        >
          <AutocompleteInput optionText="title" label="Project Reporting Form" fullWidth validate={required()} />
        </ReferenceInput>

        <ReferenceInput
          source="site_report_form_uuid"
          reference={modules.form.ResourceName}
          filter={{ type: "site-report" }}
        >
          <AutocompleteInput optionText="title" label="Site Reporting Form" fullWidth validate={required()} />
        </ReferenceInput>

        <ReferenceInput
          source="nursery_report_form_uuid"
          reference={modules.form.ResourceName}
          filter={{ type: "nursery-report" }}
        >
          <AutocompleteInput
            optionText="title"
            label="Nursery Reporting Form"
            fullWidth
            helperText="If this reporting framework doesn't require nurseries, please leave this section blank."
          />
        </ReferenceInput>
        <ReferenceInput
          source="financial_report_form_uuid"
          reference={modules.form.ResourceName}
          filter={{ type: "financial-report" }}
        >
          <AutocompleteInput
            optionText="title"
            label="Financial Reporting Form"
            fullWidth
            helperText="please leave this section blank."
          />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
