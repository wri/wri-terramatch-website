import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useState } from "react";
import { useNotify, useRecordContext } from "react-admin";
import { useForm } from "react-hook-form";

import { formBuilderToAttributes } from "@/admin/modules/form/components/FormBuilder/types";
import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import Log from "@/utils/log";

const envOptions = [
  {
    title: "Dev",
    value: "https://api-dev.terramatch.org"
  },
  {
    title: "Test",
    value: "https://api-test.terramatch.org"
  },
  {
    title: "Staging",
    value: "https://api-staging.terramatch.org"
  },
  {
    title: "Production",
    value: "https://api.terramatch.org"
  }
];

export const CopyFormToOtherEnv = () => {
  const record: any = useRecordContext();
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const formHook = useForm<any>({
    defaultValues: {
      title: record.title,
      framework_key: record.framework_key
    }
  });
  const { register, handleSubmit, formState, getValues } = formHook;
  Log.info("Copy form values", { ...getValues(), formErrors: formState.errors });

  const copyToDestinationEnv = async ({
    env: baseUrl,
    title: formTitle,
    frameworkKey,
    emailAddress,
    password
  }: any) => {
    const loginResp = await fetch(`${baseUrl}/auth/v3/logins`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        data: {
          type: "logins",
          attributes: { emailAddress, password }
        }
      })
    });
    Log.debug("Login response", loginResp);

    if (loginResp.status !== 201) {
      return notify("Email or password incorrect", { type: "error" });
    }

    const token = (await loginResp.json()).data.attributes.token;
    const formData = { ...record, title: formTitle, frameworkKey };
    const formAttributes = JSON.parse(
      JSON.stringify(formBuilderToAttributes(formData)).replace(
        /"(uuid|stageId|id|formId)":\s?("[^"]+"|null|undefined),?/gim,
        ""
      )
    );

    const response = await fetch(`${baseUrl}/forms/v3/forms`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        //@ts-ignore
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ data: { type: "forms", attributes: formAttributes } })
    });

    if (response.status === 201) {
      notify("Successful");
    }
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Copy across environments</Button>

      <Dialog open={open} fullWidth>
        <DialogTitle>Please Enter Selected Environment Admin User/Pass</DialogTitle>

        <Divider />

        <DialogContent className="flex flex-col gap-8">
          <RHFDropdown
            name="env"
            formHook={formHook}
            control={formHook.control}
            label="Environment"
            options={envOptions}
            required
            rules={{ required: true }}
            description="Please select destination environment"
            //@ts-ignore
            error={formState.errors.env}
          />
          <Input
            type="text"
            {...register("title", { required: true })}
            label="Form title"
            description="use this to update copy form title"
            //@ts-ignore
            error={formState.errors.title}
          />
          <Input
            type="text"
            {...register("emailAddress", { required: true })}
            label="Email Address"
            //@ts-ignore
            error={formState.errors.emailAddress}
          />
          <Input
            type="password"
            {...register("password", { required: true })}
            label="password"
            //@ts-ignore
            error={formState.errors.password}
          />
        </DialogContent>

        <DialogActions sx={{ padding: 3 }}>
          <Button variant="outlined" onClick={handleSubmit(copyToDestinationEnv)}>
            Copy
          </Button>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
