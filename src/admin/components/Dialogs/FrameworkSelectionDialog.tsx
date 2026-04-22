import { CheckCircle, InfoOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import { capitalize, split } from "lodash";
import { FC, useCallback, useState } from "react";
import { AutocompleteInput, Form } from "react-admin";
import { FieldValues } from "react-hook-form";
import * as yup from "yup";

import { useGetUserRole } from "@/admin/hooks/useGetUserRole";
import { validateForm } from "@/admin/utils/forms";
import { downloadEntityAllCsv, SupportedEntity } from "@/connections/Entity";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { toFramework } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { fetchGetV2AdminENTITYExportFRAMEWORKPm } from "@/generated/apiComponents";
import { v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";
import { downloadPresignedUrl } from "@/utils/network";

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

  const { isSuperAdmin, isFrameworkAdmin } = useGetUserRole();

  const onExport = useCallback(
    async (framework: string) => {
      setExporting(true);

      const reportError = (error?: any) => {
        Log.error("Export failed", error);
        openToast("Something went wrong!", ToastType.ERROR);
      };

      const exportPrefix = split(entity, "-").map(capitalize).join(" ");
      try {
        const fileName = `${exportPrefix} - ${framework}.csv`;
        if (isSuperAdmin || isFrameworkAdmin) {
          const { data, loadFailure } = await downloadEntityAllCsv(
            v3EntityName(entity) as SupportedEntity,
            toFramework(framework)
          );
          if (loadFailure != null) {
            reportError(loadFailure);
          } else {
            downloadPresignedUrl(data?.url as string, fileName);
          }
        } else {
          const data = await fetchGetV2AdminENTITYExportFRAMEWORKPm({ pathParams: { entity, framework } });
          if (data.url == null) {
            reportError();
          } else {
            downloadPresignedUrl(data.url, fileName);
          }
        }
      } catch (error) {
        reportError(error);
      } finally {
        setExporting(false);
        setModalOpen(false);
      }
    },
    [entity, isSuperAdmin, isFrameworkAdmin, openToast]
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
