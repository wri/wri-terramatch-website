import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Stack } from "@mui/material";

interface ConfirmationDialogProps extends DialogProps {
  title: string;
  content: string;
  onAgree: () => void;
  onDisAgree: () => void;
}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const { title, content, onAgree, onDisAgree, ...dialogProps } = props;

  return (
    <Dialog {...dialogProps} fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>{content}</DialogContent>

      <DialogActions>
        <Stack direction="row" gap={4} padding={2}>
          <Button onClick={() => onDisAgree()}>No</Button>
          <Button variant="contained" onClick={onAgree}>
            Yes
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
