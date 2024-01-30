import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useState } from "react";
import { useNotify, useRecordContext } from "react-admin";
import { useForm } from "react-hook-form";

import { normalizeFormCreatePayload } from "@/admin/apiProvider/dataNormalizers/formDataNormalizer";
import { appendAdditionalFormQuestionFields } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import { fetchGetV2FormsLinkedFieldListing, useGetV2AdminReportingFrameworks } from "@/generated/apiComponents";

const envOptions = [
  {
    title: "Dev",
    value: "https://new-wri-dev.wri-restoration-marketplace-api.com"
  },
  {
    title: "Test",
    value: "https://new-wri-test.wri-restoration-marketplace-api.com"
  },
  {
    title: "Staging",
    value: "https://new-wri-staging.wri-restoration-marketplace-api.com"
  },
  {
    title: "Production",
    value: "https://new-wri-prod.wri-restoration-marketplace-api.com"
  }
];

export const CopyFormToOtherEnv = () => {
  const { data: reportingFrameworksData } = useGetV2AdminReportingFrameworks({});
  const frameworkOptions =
    reportingFrameworksData?.data?.map((f: any) => ({
      title: f.name,
      value: f.access_code
    })) || [];
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
  console.log(getValues(), formState.errors);

  const copyToDestinationEnv = async ({ env: baseUrl, title: formTitle, framework_key, ...body }: any) => {
    const linkedFieldsData: any = await fetchGetV2FormsLinkedFieldListing({});
    const loginResp = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    });
    console.log(loginResp);

    if (loginResp.status !== 200) {
      return notify("wrong username password", { type: "error" });
    }

    const token = (await loginResp.json()).data.token;
    const formData = { ...record, title: formTitle };
    const formBody = JSON.parse(
      JSON.stringify(
        normalizeFormCreatePayload(formData, appendAdditionalFormQuestionFields(linkedFieldsData.data) as any),
        null,
        2
      )
        .replace(/"(uuid|stage_id|id|form_id)":\s?("\w.+"|null|undefined),?/gim, "")
        .replace(/,\n\s*(])/gim, "]")
        .replace(/,\n\s*(})/gim, "}")
    );
    if (!formBody.document) {
      delete formBody.document;
    }
    if (!formBody.documentation) {
      delete formBody.documentation;
    }
    if (!formBody.documentation_label) {
      delete formBody.documentation_label;
    }
    if (!formBody.subtitle) {
      delete formBody.subtitle;
    }

    const response = await fetch(`${baseUrl}/api/v2/admin/forms`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        //@ts-ignore
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formBody)
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
          <RHFDropdown
            name="framework_key"
            formHook={formHook}
            control={formHook.control}
            label="Framework key"
            options={frameworkOptions}
            required
            rules={{ required: true }}
            description="Please select a Reporting Framework"
            //@ts-ignore
            error={formState.errors.framework_key}
          />
          <Input
            type="text"
            {...register("email_address", { required: true })}
            label="Username"
            //@ts-ignore
            error={formState.errors.email_address}
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
          <Button variant="outlined" onClick={e => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
