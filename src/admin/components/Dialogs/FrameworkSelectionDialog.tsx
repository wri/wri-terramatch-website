import { CheckCircle, InfoOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import { FC, useMemo } from "react";
import { AutocompleteInput, Form } from "react-admin";
import { FieldValues } from "react-hook-form";
import * as yup from "yup";

import { validateForm } from "@/admin/utils/forms";
import { useGetV2AdminReportingFrameworks } from "@/generated/apiComponents";
import { Option } from "@/types/common";
import { optionToChoices } from "@/utils/options";

interface FrameworkSelectionDialogContentProps {
  onCancel: () => void;
}

const validationSchema = yup.object({
  reportingFramework: yup.string().required()
});

const FrameworkSelectionDialogContent: FC<FrameworkSelectionDialogContentProps> = ({ onCancel }) => {
  const { data: reportingFrameworksData, isLoading: reportingFrameworksLoading } = useGetV2AdminReportingFrameworks({});

  const frameworkChoices = useMemo(() => {
    const data = reportingFrameworksData?.data?.map(f => ({
      title: f.name ?? "",
      value: f.access_code ?? ""
    })) as Option[];

    return optionToChoices(data ?? []);
  }, [reportingFrameworksData]);

  return (
    <>
      <DialogTitle>Please select the funding framework you&apos;d like to export.</DialogTitle>
      <DialogContent>
        <AutocompleteInput
          loading={reportingFrameworksLoading}
          source="reportingFramework"
          label="Reporting Framework"
          choices={frameworkChoices}
          margin="dense"
          defaultValue={frameworkChoices[0]?.id}
          disableClearable
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} startIcon={<InfoOutlined />}>
          Cancel
        </Button>
        <Button type="submit" disabled={reportingFrameworksLoading} startIcon={<CheckCircle />}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

interface FrameworkSelectionDialogProps extends DialogProps {
  onExport: (framework: string) => void;
  onCancel: () => void;
}

const FrameworkSelectionDialog: FC<FrameworkSelectionDialogProps> = ({ onExport, onCancel, ...props }) => {
  const handleExport = (data: FieldValues) => {
    onExport(data.reportingFramework);
  };

  return (
    <Dialog {...props}>
      <Form onSubmit={handleExport} validate={validateForm(validationSchema)}>
        <FrameworkSelectionDialogContent onCancel={onCancel} />
      </Form>
    </Dialog>
  );
};

export default FrameworkSelectionDialog;
