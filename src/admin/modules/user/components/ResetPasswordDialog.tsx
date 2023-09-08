import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
  TextField
} from "@mui/material";
import { useNotify } from "react-admin";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { usePutV2AdminUsersResetPasswordUUID } from "@/generated/apiComponents";

interface ResetPasswordDialogProps extends DialogProps {
  userUUID: string;
  onHide: () => void;
}

interface FormValue {
  password: string;
  password_confirmation: string;
}

const schema = yup
  .object({
    password: yup
      .string()
      .min(10, param => `Password must contain at least ${param.min} character(s)`)
      .matches(/^(?=.*[a-z])/, "Must Contain One Lowercase Character")
      .matches(/^(?=.*[A-Z])/, "Must Contain One Uppercase Character")
      .matches(/^(?=.*[0-9])/, "Must Contain One Number Character")
      .required(),
    password_confirmation: yup.string().oneOf([yup.ref("password"), null], "Passwords must match.")
  })
  .required();

export const ResetPasswordDialog = (props: ResetPasswordDialogProps) => {
  const { userUUID, onHide, ...dialogProps } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm
  } = useForm<FormValue>({
    resolver: yupResolver(schema)
  });
  const notify = useNotify();
  ``;

  const { mutate: resetPassword, isLoading } = usePutV2AdminUsersResetPasswordUUID({
    onSuccess(data, variables, context) {
      notify("Password changed successfully.", { type: "success", undoable: false });
      hideModal();
    },
    onError(error, variables, context) {
      notify(error?.errors?.[0]?.detail || "something went wrong", { type: "error" });
    }
  });

  const onSubmit = (data: FormValue) =>
    //@ts-ignore
    resetPassword({ pathParams: { uuid: userUUID }, body: { password: data.password } });

  const hideModal = () => {
    resetForm();
    onHide();
  };

  return (
    <Dialog {...dialogProps} fullWidth>
      <DialogTitle>Reset password</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            {...register("password")}
            autoFocus
            id="request"
            type="text"
            fullWidth
            multiline
            variant="standard"
            label="Enter New Password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            {...register("password_confirmation")}
            id="request"
            type="text"
            fullWidth
            multiline
            variant="standard"
            label="Repeat New Password"
            error={!!errors.password_confirmation}
            helperText={errors.password_confirmation?.message}
          />
        </DialogContent>

        <DialogActions>
          <Stack direction="row" gap={4} padding={2}>
            <Button onClick={hideModal}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={isLoading}>
              Reset Password
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};
