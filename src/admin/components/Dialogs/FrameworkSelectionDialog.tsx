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
import { entityExportAll, EntityExportAllQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";
import { downloadFileBlob, downloadFileUrl } from "@/utils/network";

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

      try {
        const entityName = v3EntityName(entity) as SupportedEntity;
        const frameworkKey = toFramework(framework);
        if (isSuperAdmin || isFrameworkAdmin) {
          const { data, loadFailure } = await downloadEntityAllCsv(entityName, frameworkKey);
          if (loadFailure != null) {
            reportError(loadFailure);
          } else {
            downloadFileUrl(data?.url as string);
          }
        } else {
          try {
            const { fileName, blob } = await entityExportAll.fetchBlob({
              pathParams: { entity: entityName },
              queryParams: { frameworkKey: frameworkKey as EntityExportAllQueryParams["frameworkKey"] }
            });
            await downloadFileBlob(
              blob,
              fileName ?? `${split(entity, "-").map(capitalize).join(" ")} - ${framework}.csv`
            );
          } catch {
            reportError();
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
