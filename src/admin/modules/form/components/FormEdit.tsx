import { Edit, SimpleForm, TextField, useRecordContext } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import ShowTitle from "@/admin/components/ShowTitle";
import { FormBuilderForm } from "@/admin/modules/form/components/FormBuilder";
import { FormToolbar } from "@/admin/modules/form/components/FormToolbar";

export const FormEditActions = () => {
  const record = useRecordContext();

  return !record?.published ? (
    <ShowActions
      titleSource="project_name"
      hasEdit={false}
      deleteProps={{
        confirmTitle: `Delete Form "${record?.title}"?`,
        confirmContent: "This action cannot be undone",
        mutationMode: "pessimistic"
      }}
    />
  ) : null;
};

export const FormEdit = () => {
  return (
    <Edit
      mutationMode="pessimistic"
      actions={<FormEditActions />}
      title={<ShowTitle getTitle={record => record?.title} moduleName="Form" />}
      sx={{ marginBottom: 2 }}
    >
      <TextField source="title" component="h5" variant="h5" className="mt-10" marginX="1rem" paddingTop="1.75rem" />
      <SimpleForm toolbar={<FormToolbar isEdit />} noValidate paddingY="1.5rem">
        <FormBuilderForm />
      </SimpleForm>
    </Edit>
  );
};
