import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { AutocompleteInput, Form, SelectInput } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { Case, Else, If, Switch, Then } from "react-if";
import * as yup from "yup";

import { useExportContext } from "@/admin/modules/application/context/export.provider";
import { validateForm } from "@/admin/utils/forms";
import { useGetV2AdminFundingProgramme, useGetV2FundingProgrammeStage } from "@/generated/apiComponents";
import { StageRead } from "@/generated/apiSchemas";
import { Option } from "@/types/common";
import { optionToChoices } from "@/utils/options";

interface ApplicationsExportModalProps extends DialogProps {
  handleClose: () => void;
}

const validationSchema = yup.object({
  funding_programme_uuid: yup.string(),
  stage_uuid: yup.string(),
  export_choice: yup.string().required()
});

const FormContent = ({ handleClose }: { handleClose: ApplicationsExportModalProps["handleClose"] }) => {
  const { control, setValue } = useFormContext();
  const choice = useWatch({ control, name: "export_choice" });

  const { data: fundingProgrammesData, isLoading: fundingProgrammesLoading } = useGetV2AdminFundingProgramme({});
  const { data: stageData, isLoading: stagesLoading } = useGetV2FundingProgrammeStage({
    queryParams: {
      per_page: 1000
    }
  });

  const fpChoices = useMemo(() => {
    const data = fundingProgrammesData?.data?.map(f => ({
      title: f.name ?? "",
      value: f.uuid ?? ""
    })) as Option[];

    return optionToChoices(data ?? []);
  }, [fundingProgrammesData]);

  const stageChoices = useMemo(() => {
    // @ts-ignore incorrect docs
    const data = stageData?.data
      // @ts-ignore incorrect docs
      ?.filter(item => !!item.form)
      // @ts-ignore incorrect docs
      .map(f => ({
        title: f.name ?? "",
        value: f.uuid ?? ""
      })) as Option[];

    return optionToChoices(data ?? []);
  }, [stageData?.data]);

  /**
   * Ensure that fields have a default value when type changes
   */
  useEffect(() => {
    setValue("funding_programme_uuid", fpChoices[0]?.id);
    setValue("stage_uuid", stageChoices[0]?.id);
  }, [fpChoices, setValue, stageChoices, choice]);

  return (
    <>
      <DialogTitle>Please select the funding framework or stage you&apos;d like to export.</DialogTitle>
      <DialogContent>
        <If condition={fundingProgrammesLoading || stagesLoading}>
          <Then>
            <CircularProgress size={22} />
          </Then>
          <Else>
            <DialogContentText>Export type.</DialogContentText>
            <SelectInput
              source="export_choice"
              label="Choose an export type"
              choices={[
                { id: "funding-programme", name: "Funding Programme" },
                { id: "stage", name: "Stage" }
              ]}
              fullWidth
              margin="dense"
            />
            <Switch>
              <Case condition={choice === "funding-programme"}>
                <DialogContentText>You can export one framework at a time.</DialogContentText>

                <AutocompleteInput
                  loading={fundingProgrammesLoading}
                  source="funding_programme_uuid"
                  label="Funding Programme"
                  choices={fpChoices}
                  fullWidth
                  margin="dense"
                  defaultValue={fpChoices[0]?.id}
                  disableClearable
                />
              </Case>
              <Case condition={choice === "stage"}>
                <DialogContentText>You can export one stage at a time.</DialogContentText>
                <AutocompleteInput
                  loading={stagesLoading}
                  source="stage_uuid"
                  label="Stage"
                  choices={stageChoices}
                  fullWidth
                  margin="dense"
                  defaultValue={stageChoices[0]?.id}
                  disableClearable
                />
              </Case>
            </Switch>
          </Else>
        </If>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit" disabled={fundingProgrammesLoading || stagesLoading}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

const ApplicationsExportModal = ({ handleClose, ...dialogProps }: ApplicationsExportModalProps) => {
  const { exportApplications } = useExportContext();

  const { data: stageData } = useGetV2FundingProgrammeStage({
    queryParams: {
      per_page: 1000
    }
  });

  const handleSave = async (data: any) => {
    let form_uuid: string = "";

    if (data.stage_uuid) {
      // Get the form
      // @ts-ignore incorrect docs
      const stage: StageRead = stageData?.data?.find((item: StageRead) => item.uuid === data.stage_uuid);
      // @ts-ignore incorrect docs
      form_uuid = stage?.form?.uuid;
    }
    exportApplications({ ...data, form_uuid }, "Applications.csv");
    handleClose();
  };

  return (
    <Dialog {...dialogProps} fullWidth>
      <Form onSubmit={handleSave} validate={validateForm(validationSchema)}>
        <FormContent handleClose={handleClose} />
      </Form>
    </Dialog>
  );
};

export default ApplicationsExportModal;
