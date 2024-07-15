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

import { usePostV2ProjectsUUIDManagers } from "@/generated/apiComponents";

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

  const { mutate: addManager } = usePostV2ProjectsUUIDManagers({
    onSuccess() {
      notify("Manager was added successfully");
      refresh();
      reset();
      handleClose();
    },
    onError(error) {
      setError("email", {
        // @ts-ignore
        message: error.errors[0]?.detail as string,
        type: "validate"
      });
    }
  });

  const onSubmit = (data: FormValues) => {
    addManager({
      pathParams: { uuid: record.id as string },
      body: {
        email_address: data.email
      }
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
