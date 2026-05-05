import { CheckCircle, InfoOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import { FC, useCallback, useState } from "react";
import { AutocompleteInput, Form } from "react-admin";
import { FieldValues } from "react-hook-form";
import * as yup from "yup";

import { validateForm } from "@/admin/utils/forms";
import { SupportedEntity } from "@/connections/Entity";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { toFramework } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { entityExportAll, EntityExportAllQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

interface FrameworkSelectionDialogContentProps {
  onCancel: () => void;
}

const validationSchema = yup.object({
  reportingFramework: yup.string().required()
});

const FrameworkSelectionDialogContent: FC<FrameworkSelectionDialogContentProps> = ({ onCancel }) => {
  const frameworkInputChoices = useUserFrameworkChoices();

  return (
    <>
      <DialogTitle>Please select the funding framework you&apos;d like to export.</DialogTitle>
      <DialogContent>
        <AutocompleteInput
          source="reportingFramework"
          label="Reporting Framework"
          choices={frameworkInputChoices}
          margin="dense"
          defaultValue={frameworkInputChoices?.[0]?.id}
          disableClearable
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} startIcon={<InfoOutlined />}>
          Cancel
        </Button>
        <Button type="submit" disabled={frameworkInputChoices?.length === 0} startIcon={<CheckCircle />}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export function useFrameworkExport(entity: EntityName, choices: any[]) {
  const [exporting, setExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { openToast } = useToastContext();

  const onExport = useCallback(
    async (framework: string) => {
      setExporting(true);

      try {
        const entityName = v3EntityName(entity) as SupportedEntity;
        const frameworkKey = toFramework(framework) as EntityExportAllQueryParams["frameworkKey"];
        await entityExportAll.downloadFile({ pathParams: { entity: entityName }, queryParams: { frameworkKey } });
      } catch (error) {
        Log.error("Export failed", error);
        openToast("Something went wrong!", ToastType.ERROR);
      } finally {
        setExporting(false);
        setModalOpen(false);
      }
    },
    [entity, openToast]
  );

  return {
    exporting,
    onClickExportButton: useCallback(() => {
      if (choices?.length > 1) {
        setModalOpen(true);
      } else {
        onExport(choices[0].id);
      }
    }, [choices, onExport]),
    frameworkDialogProps: {
      open: modalOpen,
      onCancel: useCallback(() => setModalOpen(false), []),
      onExport
    }
  };
}

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
