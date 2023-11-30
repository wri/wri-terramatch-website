import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { BooleanField, RaRecord, SelectField, TextField, useNotify, useRefresh, useShowContext } from "react-admin";

import Aside from "@/admin/components/Aside/Aside";
import { ConfirmationDialog } from "@/admin/components/Dialogs/ConfirmationDialog";
import { ResetPasswordDialog } from "@/admin/modules/user/components/ResetPasswordDialog";
import { usePatchV2AdminUsersVerifyUUID, usePostAuthReset, usePostV2UsersResend } from "@/generated/apiComponents";
import { V2AdminUserRead } from "@/generated/apiSchemas";

import { userPrimaryRoleChoices } from "../const";

export const UserShowAside = () => {
  const notify = useNotify();
  const refresh = useRefresh();

  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [showVerifyEmailDialog, setShowVerifyEmailDialog] = useState(false);

  const { record } = useShowContext<V2AdminUserRead & RaRecord>();
  const uuid = record?.uuid as string;

  const { mutate: resendVerificationEmail } = usePostV2UsersResend({
    onSuccess() {
      notify(`Verification email has been sent successfully.`, { type: "success" });
      refresh();
    }
  });

  const { mutate: sendPasswordReset } = usePostAuthReset({
    onSuccess() {
      notify(`Reset password email has been sent successfully.`, { type: "success" });
      refresh();
    }
  });

  const { mutate: verifyUser } = usePatchV2AdminUsersVerifyUUID({
    onSuccess() {
      notify(`User email has been verified successfully.`, { type: "success" });
      refresh();
    }
  });

  return (
    <>
      <Aside title="User Review">
        <Grid container spacing={2} marginY={2}>
          <Grid item xs={6}>
            <Typography variant="h6">First Name</Typography>
            <TextField source="first_name" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Last Name</Typography>
            <TextField source="last_name" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Type</Typography>
            <SelectField source="primary_role" choices={userPrimaryRoleChoices} emptyText="Not Provided" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Verified</Typography>
            <BooleanField source="verified" />
          </Grid>
        </Grid>
        <Divider />
        <Box pt={2}>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() =>
                resendVerificationEmail({
                  body: {
                    //@ts-ignore
                    uuid,
                    callback_url: window.location.origin + "/auth/verify/email/"
                  }
                })
              }
            >
              Resend Verification Email
            </Button>
            <Button variant="contained" onClick={() => setShowVerifyEmailDialog(true)}>
              Verify Email
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                sendPasswordReset({
                  body: {
                    email_address: record?.email_address,
                    callback_url: window.location.origin + "/auth/reset-password/"
                  }
                })
              }
            >
              Send Reset Password Email
            </Button>
            <Button variant="contained" onClick={() => setShowResetPasswordDialog(true)}>
              Reset Password
            </Button>
          </Stack>
        </Box>
      </Aside>
      <ResetPasswordDialog
        open={showResetPasswordDialog}
        userUUID={uuid}
        onHide={() => setShowResetPasswordDialog(false)}
      />
      <ConfirmationDialog
        open={showVerifyEmailDialog}
        title="Email Verification"
        content={`Are you sure you want to verify ${record?.email_address}?`}
        onAgree={() => {
          verifyUser({
            pathParams: { uuid }
          });
          setShowVerifyEmailDialog(false);
        }}
        onDisAgree={() => setShowVerifyEmailDialog(false)}
      />
    </>
  );
};
