// @ts-ignore
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Stack,
  Typography
} from "@mui/material";
import { useCallback } from "react";
import { useNotify, useRecordContext, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useUserAssociationCreation } from "@/connections/UserAssociation";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import ApiSlice from "@/store/apiSlice";
import { first } from "@/utils/array";

interface InviteMonitoringPartnerDialogProps extends DialogProps {
  handleClose: () => void;
}
const schema = yup.object({
  email: yup.string().email().required()
});

type FormValues = yup.InferType<typeof schema>;

export const InviteMonitoringPartnerDialog = ({ handleClose, ...props }: InviteMonitoringPartnerDialogProps) => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();

  const {
    register,
    formState: { errors },
    setError,
    reset,
    handleSubmit
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const [, { isCreating, createFailure, create: invitePartner }] = useUserAssociationCreation({
    uuid: record.id as string,
    model: "projects"
  });

  useRequestComplete(
    isCreating,
    createFailure,
    useCallback(
      failure => {
        if (failure != null) {
          setError("email", {
            message: first(failure.message) as string,
            type: "validate"
          });
        } else {
          notify("Invitation sent successfully");
          ApiSlice.pruneCache("associatedUsers");
          refresh();
          reset();
          handleClose();
        }
      },
      [notify, reset, refresh, handleClose, setError]
    )
  );

  const onSubmit = (data: FormValues) => {
    invitePartner({
      emailAddress: data.email,
      isManager: false
    });
  };

  return (
    <Dialog {...props} fullWidth>
      <DialogTitle>Invite Monitoring Partner</DialogTitle>

      <DialogContent>
        <Typography variant="body2">
          Here, you can invite someone to create a TerraMatch account as an observer. This will allow them to access all
          your project data and reports.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <FormControl fullWidth>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input {...register("email")} id="email" />
            <FormHelperText id="my-helper-text" error={!!errors.email}>
              {errors.email?.message}
            </FormHelperText>
          </FormControl>
          <DialogActions>
            <Stack direction="row" gap={4} padding={2}>
              <Button onClick={handleClose}>Close</Button>
              <Button variant="contained" type="submit">
                Invite
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
