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
import { FC, useCallback } from "react";
import { useNotify } from "react-admin";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useUser } from "@/connections/User";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import { first } from "@/utils/array";

interface ResetPasswordDialogProps extends DialogProps {
  userUUID: string;
  onHide: () => void;
}

interface FormValue {
  password: string;
  passwordConfirmation: string;
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
    passwordConfirmation: yup.string().oneOf([yup.ref("password")], "Passwords must match.")
  })
  .required();

const ResetPasswordDialog: FC<ResetPasswordDialogProps> = ({ userUUID, onHide, ...dialogProps }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm
  } = useForm<FormValue>({
    resolver: yupResolver(schema)
  });
  const notify = useNotify();

  const hideModal = useCallback(() => {
    resetForm();
    onHide();
  }, [onHide, resetForm]);

  const [, { update, isUpdating, updateFailure }] = useUser({ id: userUUID });
  const onSubmit = useCallback(
    ({ password }: FormValue) => {
      update({ password });
    },
    [update]
  );
  useRequestComplete(
    isUpdating,
    updateFailure,
    useCallback(
      failure => {
        if (failure == null) {
          notify("Password changed successfully.", { type: "success", undoable: false });
          hideModal();
        } else {
          console.log("failure", updateFailure);
          notify(first(failure.message) ?? "Password update failed", { type: "error" });
        }
      },
      [hideModal, notify, updateFailure]
    )
  );

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
            {...register("passwordConfirmation")}
            id="request"
            type="text"
            fullWidth
            multiline
            variant="standard"
            label="Repeat New Password"
            error={!!errors.passwordConfirmation}
            helperText={errors.passwordConfirmation?.message}
          />
        </DialogContent>

        <DialogActions>
          <Stack direction="row" gap={4} padding={2}>
            <Button onClick={hideModal}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={isUpdating}>
              Reset Password
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ResetPasswordDialog;
