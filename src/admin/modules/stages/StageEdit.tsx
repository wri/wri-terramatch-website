import { Edit, useNotify } from "react-admin";
import { useNavigate } from "react-router";

import StageForm from "@/admin/modules/stages/components/StageForm";

export const StageEdit = () => {
  const notify = useNotify();
  const navigate = useNavigate();

  return (
    <Edit
      mutationMode="pessimistic"
      mutationOptions={{
        onSuccess: () => {
          notify("Stage Edited Successfully.", { type: "success" });
          return navigate(-1);
        }
      }}
    >
      <StageForm />
    </Edit>
  );
};
