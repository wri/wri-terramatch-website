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
import { useNotify, useRecordContext, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { usePostV2ProjectsUUIDInvite } from "@/generated/apiComponents";

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

  const { mutate: invitePartner } = usePostV2ProjectsUUIDInvite({
    onSuccess() {
      notify("Invitation sent successfully");
      refresh();
      reset();
      handleClose();
    },
    onError() {
      setError("email", {
        message: "This user is already a monitoring partner for this project, please try a different email address.",
        type: "validate"
      });
    }
  });

  const onSubmit = (data: FormValues) => {
    invitePartner({
      pathParams: { uuid: record.id as string },
      queryParams: {
        email_address: data.email,
        callback_url: `${window.location.origin}/auth/reset-password`
      }
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
