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

interface AddManagerDialogProps extends DialogProps {
  handleClose: () => void;
}
const schema = yup.object({
  email: yup.string().email().required()
});

type FormValues = yup.InferType<typeof schema>;

export const AddManagerDialog = ({ handleClose, ...props }: AddManagerDialogProps) => {
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

  const [, { isCreating, createFailure, create: createUserAssociation }] = useUserAssociationCreation({
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
            message: first(failure.message),
            type: "validate"
          });
        } else {
          notify("Manager was added successfully");
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
    createUserAssociation({
      emailAddress: data.email,
      isManager: true
    });
  };

  return (
    <Dialog {...props} fullWidth>
      <DialogTitle>Add Project Manager</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Here you can add a Project Manager to the project. They will be able to act as an admin for all entities
          related to this project.
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
                Add
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
