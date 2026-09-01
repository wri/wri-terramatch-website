import { Button } from "@mui/material";
import { FC } from "react";
import { ReferenceField, Show, SimpleShowLayout, TextField, useRecordContext } from "react-admin";
import { Link } from "react-router-dom";

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

        <ReferenceField
          source="financialReportFormUuid"
          reference={modules.form.ResourceName}
          label="Financial reporting flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <ReferenceField
          source="disturbanceReportFormUuid"
          reference={modules.form.ResourceName}
          label="Disturbance reporting flow"
          emptyText="Not provided"
        >
          <TextField source="title" />
        </ReferenceField>

        <PolygonOptionalAttributesLink />
      </SimpleShowLayout>
    </Show>
  );
};

const PolygonOptionalAttributesLink = () => {
  const record = useRecordContext();
  if (record?.slug == null) return null;

  return (
    <Button
      component={Link}
      to={`/${modules.reportingFramework.ResourceName}/${record.slug}/optional-attributes`}
      variant="text"
      sx={{ justifyContent: "flex-start", px: 0 }}
    >
      Add Polygon Optional Attributes
    </Button>
  );
};
