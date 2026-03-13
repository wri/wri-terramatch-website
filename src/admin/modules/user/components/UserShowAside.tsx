import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { BooleanField, RaRecord, SelectField, TextField, useNotify, useRefresh, useShowContext } from "react-admin";

import Aside from "@/admin/components/Aside/Aside";
import { sendRequestPasswordReset } from "@/connections/ResetPassword";
import { usePostAuthSendLoginDetails, usePostV2UsersResend } from "@/generated/apiComponents";
import { V2AdminUserRead } from "@/generated/apiSchemas";

import { localeChoices, userPrimaryRoleChoices } from "../const";

export const UserShowAside = () => {
  const notify = useNotify();
  const refresh = useRefresh();

  const { record } = useShowContext<V2AdminUserRead & RaRecord>();

  const { mutate: resendVerificationEmail } = usePostV2UsersResend({
    onSuccess() {
      notify(`Verification email has been sent successfully.`, { type: "success" });
      refresh();
    }
  });

  const handleSendPasswordResetEmail = async () => {
    try {
      if (record?.email_address == null) {
        notify(`User email is not available.`, { type: "warning" });
        return;
      }
      await sendRequestPasswordReset(record.email_address, window.location.origin + "/auth/reset-password/");
      notify(`Reset password email has been sent successfully.`, { type: "success" });
      refresh();
    } catch (error) {
      notify(`Failed to send reset password email.`, { type: "error" });
    }
  };

  const { mutate: sendLoginDetails } = usePostAuthSendLoginDetails({
    onSuccess() {
      notify(`Login details email has been sent successfully.`, { type: "success" });
      refresh();
    }
  });

  return (
    <div className="user-aside">
      <Aside title="User Review">
        <Grid container spacing={2} marginY={2}>
          <Grid item xs={6}>
            <Typography variant="h6" className="admin-text-16 text-darkCustom/60">
              First Name
            </Typography>
            <TextField source="first_name" className="admin-text-16 !font-medium text-darkCustom" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" className="admin-text-16 text-darkCustom/60">
              Last Name
            </Typography>
            <TextField source="last_name" className="admin-text-16 !font-medium text-darkCustom" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" className="admin-text-16 text-darkCustom/60">
              Type
            </Typography>
            <SelectField
              source="role"
              choices={userPrimaryRoleChoices}
              emptyText="Not Provided"
              className="admin-text-16 !font-medium text-darkCustom"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" className="admin-text-16 text-darkCustom/60">
              Locale
            </Typography>
            <SelectField
              source="locale"
              choices={localeChoices}
              emptyText="Not Provided"
              className="admin-text-16 !font-medium text-darkCustom"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" className="admin-text-16 text-darkCustom/60">
              Verified
            </Typography>
            <BooleanField source="verified" className="admin-text-16 !font-medium text-darkCustom" />
          </Grid>
        </Grid>
        <Divider />
        <Box pt={2}>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              className="!rounded-lg !bg-primary"
              onClick={() =>
                sendLoginDetails({
                  body: {
                    email_address: record?.email_address,
                    callback_url: window.location.origin + "/auth/set-password/"
                  }
                })
              }
            >
              Send Login Details
            </Button>
            <Button
              variant="contained"
              className="!rounded-lg !bg-primary"
              onClick={() =>
                resendVerificationEmail({
                  body: {
                    callback_url: window.location.origin + "/auth/verify/email/",
                    email_address: record?.email_address
                  }
                })
              }
            >
              Resend Verification Email
            </Button>
            <Button variant="contained" className="!rounded-lg !bg-primary" onClick={handleSendPasswordResetEmail}>
              Send Reset Password Email
            </Button>
            <Button variant="contained" className="!rounded-lg !bg-primary" onClick={handleSendPasswordResetEmail}>
              Reset Password
            </Button>
          </Stack>
        </Box>
      </Aside>
    </div>
  );
};
