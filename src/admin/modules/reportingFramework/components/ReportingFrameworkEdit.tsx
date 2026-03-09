import { FC } from "react";
import { AutocompleteInput, Edit, ReferenceInput, required, SimpleForm, TextInput } from "react-admin";

import modules from "@/admin/modules";

export const ReportingFrameworkEdit: FC = () => {
  return (
    <Edit mutationMode="pessimistic">
      <SimpleForm>
        <TextInput source="name" label="Name" fullWidth />
        <ReferenceInput source="projectFormUuid" reference={modules.form.ResourceName} filter={{ type: "project" }}>
          <AutocompleteInput optionText="title" label="Project Establishment Form" fullWidth validate={required()} />
        </ReferenceInput>

        <ReferenceInput source="siteFormUuid" reference={modules.form.ResourceName} filter={{ type: "site" }}>
          <AutocompleteInput optionText="title" label="Site Establishment Form" fullWidth validate={required()} />
        </ReferenceInput>

        <ReferenceInput source="nurseryFormUuid" reference={modules.form.ResourceName} filter={{ type: "nursery" }}>
          <AutocompleteInput
            optionText="title"
            label="Nursery Establishment Form"
            fullWidth
            helperText="If this reporting framework doesn't require nurseries, please leave this section blank."
          />
        </ReferenceInput>

        <ReferenceInput
          source="projectReportFormUuid"
          reference={modules.form.ResourceName}
          filter={{ type: "project-report" }}
        >
          <AutocompleteInput optionText="title" label="Project Reporting Form" fullWidth validate={required()} />
        </ReferenceInput>

        <ReferenceInput
          source="siteReportFormUuid"
          reference={modules.form.ResourceName}
          filter={{ type: "site-report" }}
        >
          <AutocompleteInput optionText="title" label="Site Reporting Form" fullWidth validate={required()} />
        </ReferenceInput>

        <ReferenceInput
          source="nurseryReportFormUuid"
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
          source="financialReportFormUuid"
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
    </Edit>
  );
};
