import { Create, Edit, SimpleForm } from "react-admin";

import ImpactStoryForm from "./ImpactStoryForm";

const transformData = (data: any) => {
  const transformedData = {
    organization_id: data.organization?.uuid,
    title: data.title,
    date: data.date,
    category: data.category,
    content: data.content,
    status: data.status,
    thumbnail: data.thumbnail
  };

  return Object.fromEntries(Object.entries(transformedData).filter(([_, value]) => value != null));
};
export const ImpactStoriesCreate: React.FC = () => (
  <Create
    transform={transformData}
    sx={{
      "& .MuiToolbar-regular": {
        display: "none"
      }
    }}
  >
    <SimpleForm>
      <ImpactStoryForm mode="create" />
    </SimpleForm>
  </Create>
);

export const ImpactStoriesEdit: React.FC = () => (
  <Edit
    transform={transformData}
    sx={{
      "& .MuiToolbar-regular": {
        display: "none"
      }
    }}
  >
    <SimpleForm>
      <ImpactStoryForm mode="edit" />
    </SimpleForm>
  </Edit>
);
