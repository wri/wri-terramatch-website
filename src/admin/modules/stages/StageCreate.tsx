import { Alert } from "@mui/material";
import { Create, useNotify } from "react-admin";
import { When } from "react-if";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

import StageForm from "@/admin/modules/stages/components/StageForm";

export const StageCreate = () => {
  const notify = useNotify();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fundingProgrammeId = searchParams.get("funding_programme_id");

  return (
    <Create
      mutationOptions={{
        onSuccess: () => {
          notify("Stage Created Successfully.", { type: "success" });
          return navigate(-1);
        }
      }}
    >
      <When condition={!fundingProgrammeId}>
        <Alert severity="error" className="mb-8 w-full">
          Funding Programme ID is not present. This Stage cannot be created. Go visit the Funding Programme detail page
          and create a stage from there.
        </Alert>
      </When>
      <StageForm />
    </Create>
  );
};
