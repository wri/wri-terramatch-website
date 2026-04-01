import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { FunctionField, RaRecord, SelectField, TextField, useNotify, useRefresh, useShowContext } from "react-admin";

import Aside from "@/admin/components/Aside/Aside";
import { ConfirmationDialog } from "@/admin/components/Dialogs/ConfirmationDialog";
import { useAdminUserVerify } from "@/connections/AdminUsers";
import { sendRequestPasswordReset } from "@/connections/ResetPassword";
import { useResendVerification } from "@/connections/VerificationUser";
import { usePostAuthSendLoginDetails } from "@/generated/apiComponents";
import { UserDto } from "@/generated/v3/userService/userServiceSchemas";

import { localeChoices, userPrimaryRoleChoices } from "../const";

export const UserShowAside = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [showVerifyEmailDialog, setShowVerifyEmailDialog] = useState(false);

  const { record } = useShowContext<RaRecord>();

  const [, { create: verifyUser }] = useAdminUserVerify({ uuid: record?.uuid as string });

  const { create: resendVerificationEmail } = useResendVerification(
    {},
    () => {
      notify(`Verification email has been sent successfully.`, { type: "success" });
      refresh();
    },
    "Failed to resend verification email."
  );

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
            <TextField source="firstName" className="admin-text-16 !font-medium text-darkCustom" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" className="admin-text-16 text-darkCustom/60">
              Last Name
            </Typography>
            <TextField source="lastName" className="admin-text-16 !font-medium text-darkCustom" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" className="admin-text-16 text-darkCustom/60">
              Type
            </Typography>
            <SelectField
              source="primaryRole"
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
            <FunctionField
              source="emailAddressVerifiedAt"
              render={(record?: UserDto) => (record?.emailAddressVerifiedAt != null ? "Verified" : "Not Verified")}
              className="admin-text-16 !font-medium text-darkCustom"
            />
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
              onClick={() => {
                if (record?.email_address == null) {
                  notify(`User email is not available.`, { type: "warning" });
                  return;
                }

                resendVerificationEmail({
                  emailAddress: record.email_address,
                  callbackUrl: window.location.origin + "/auth/verify/email/"
                });
              }}
            >
              Resend Verification Email
            </Button>
            <Button
              variant="contained"
              className="!rounded-lg !bg-primary"
              onClick={() => setShowVerifyEmailDialog(true)}
            >
              Verify Email
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
      <ConfirmationDialog
        open={showVerifyEmailDialog}
        title="Email Verification"
        content={`Are you sure you want to verify ${record?.email_address}?`}
        onAgree={() => {
          // @ts-expect-error empty body on a creation hook
          verifyUser();
          setShowVerifyEmailDialog(false);
          refresh();
        }}
        onDisAgree={() => setShowVerifyEmailDialog(false)}
      />
    </div>
  );
};
