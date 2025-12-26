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
import { FC, useCallback, useMemo } from "react";
import { AutocompleteInput, Form } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import * as yup from "yup";

import { useExportContext } from "@/admin/modules/application/context/export.provider";
import { Choice } from "@/admin/types/common";
import { validateForm } from "@/admin/utils/forms";
import { useFundingProgrammes } from "@/connections/FundingProgramme";
import { useValueChanged } from "@/hooks/useValueChanged";
import { Option } from "@/types/common";
import Log from "@/utils/log";
import { optionToChoices } from "@/utils/options";

interface ApplicationsExportModalProps extends DialogProps {
  handleClose: () => void;
}

const validationSchema = yup.object({
  fundingProgrammeUuid: yup.string(),
  stageUuid: yup.string()
});

const FormContent: FC<{ handleClose: ApplicationsExportModalProps["handleClose"] }> = ({ handleClose }) => {
  const { control, setValue } = useFormContext();
  const fundingProgrammeUuid = useWatch({ control, name: "fundingProgrammeUuid" });

  const [fpsLoaded, { data: fundingProgrammes }] = useFundingProgrammes({ translated: false });

  const fpChoices = useMemo(() => {
    const data = fundingProgrammes?.map(({ name, uuid }) => ({ title: name, value: uuid })) as Option[];

    return optionToChoices(data ?? []);
  }, [fundingProgrammes]);

  const stageChoices = useMemo(() => {
    const fundingProgramme =
      fundingProgrammeUuid == null ? undefined : fundingProgrammes?.find(({ uuid }) => uuid === fundingProgrammeUuid);
    if (fundingProgramme == null) return [];

    const defaultChoice: Choice = { name: "All Stages in Funding Programme", id: "all" };
    return [
      defaultChoice,
      ...(fundingProgramme.stages ?? []).map(({ name, uuid }): Choice => ({ name: name ?? "<no name>", id: uuid }))
    ];
  }, [fundingProgrammeUuid, fundingProgrammes]);

  useValueChanged(fpsLoaded, () => {
    if (fpsLoaded) setValue("fundingProgrammeUuid", fpChoices[0]?.id);
  });
  useValueChanged(fundingProgrammeUuid, () => {
    setValue("stageUuid", stageChoices[0]?.id);
  });

  return (
    <>
      <DialogTitle>Please select the funding framework or stage you&apos;d like to export.</DialogTitle>
      <DialogContent>
        {!fpsLoaded ? (
          <CircularProgress size={22} />
        ) : (
          <>
            <DialogContentText>Select Funding Programme and Stage (or all stages)</DialogContentText>
            <AutocompleteInput
              loading={!fpsLoaded}
              source="fundingProgrammeUuid"
              label="Funding Programme"
              choices={fpChoices}
              fullWidth
              margin="dense"
              defaultValue={fpChoices[0]?.id}
              disableClearable
            />
            <AutocompleteInput
              loading={!fpsLoaded}
              source="stageUuid"
              label="Stage"
              choices={stageChoices}
              fullWidth
              margin="dense"
              defaultValue={stageChoices[0]?.id}
              disableClearable
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit" disabled={!fpsLoaded}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

const ApplicationsExportModal: FC<ApplicationsExportModalProps> = ({ handleClose, ...dialogProps }) => {
  const { exportApplications } = useExportContext();

  const [, { data: fundingProgrammes }] = useFundingProgrammes({ translated: false });

  const handleSave = useCallback(
    ({ fundingProgrammeUuid, stageUuid }: { fundingProgrammeUuid?: string; stageUuid?: string }) => {
      if (fundingProgrammeUuid == null) {
        Log.error("Funding programme uuid is required");
      } else {
        if (stageUuid == null || stageUuid === "all") {
          exportApplications({ fundingProgrammeUuid }, "Applications.csv");
        } else {
          const programme = fundingProgrammes?.find(({ uuid }) => uuid === fundingProgrammeUuid);
          const stage = programme?.stages?.find(({ uuid }) => uuid === stageUuid);
          if (stage?.formUuid == null) {
            Log.error("Unable to find form for stage", { fundingProgrammeUuid, stageUuid });
          } else {
            exportApplications({ formUuid: stage.formUuid }, "Applications.csv");
          }
        }
      }

      handleClose();
    },
    [exportApplications, fundingProgrammes, handleClose]
  );

  return (
    <Dialog {...dialogProps} fullWidth>
      <Form onSubmit={handleSave} validate={validateForm(validationSchema)}>
        <FormContent handleClose={handleClose} />
      </Form>
    </Dialog>
  );
};

export default ApplicationsExportModal;
