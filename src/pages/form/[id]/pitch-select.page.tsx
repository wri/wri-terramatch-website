import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { When } from "react-if";
import * as yup from "yup";

import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useMyOrg } from "@/connections/Organisation";
import { useGetV2FormsUUID, useGetV2ProjectPitches, usePostV2FormsSubmissions } from "@/generated/apiComponents";
import { FormRead } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";

const schema = yup.object({
  pitch_uuid: yup.string().required(),
  draft_uuid: yup.string()
});

export type FormData = yup.InferType<typeof schema>;

const FormIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const [, { organisationId }] = useMyOrg();

  const formUUID = router.query.id as string;

  const form = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const selectedPitchUUID = useWatch({ name: "pitch_uuid", control: form.control });

  const { data: formData } = useGetV2FormsUUID<{ data: FormRead }>({
    pathParams: { uuid: formUUID },
    queryParams: { lang: router.locale }
  });

  const { data: pitches } = useGetV2ProjectPitches(
    {
      queryParams: {
        page: 1,
        per_page: 10000,
        //@ts-ignore
        "filter[organisation_id]": organisationId
      }
    },
    {
      enabled: !!organisationId
    }
  );

  const pitchesOptions = useMemo(() => {
    const values =
      pitches?.data?.map(item => ({ title: item.project_name! || t("Untitled Pitch"), value: item.uuid! })) || [];

    return [...values, { title: t("Create a new Pitch"), value: "create" }];
  }, [pitches?.data, t]);

  const { mutate: create, isLoading } = usePostV2FormsSubmissions({
    onSuccess(data) {
      //@ts-ignore
      router.push(`/form/submission/${data.data.uuid}`);
    }
  });

  const handleCreateSubmission = (data: FormData) => {
    if (selectedPitchDrafts.length > 0 && !data.draft_uuid) {
      return;
    } else if (data.draft_uuid && data.draft_uuid !== "create") {
      // Redirect to form
      router.push(`/form/submission/${data.draft_uuid}`);
    } else {
      const body: any = { form_uuid: formUUID };

      if (data.pitch_uuid !== "create") {
        body.project_pitch_uuid = data.pitch_uuid;
      }

      //@ts-ignore
      create({ body });
    }
  };

  const selectedPitchDrafts = useMemo(() => {
    if (selectedPitchUUID && selectedPitchUUID !== "create") {
      const pitch = pitches?.data?.find(item => item.uuid === selectedPitchUUID);

      if (pitch) {
        // @ts-ignore incorrect docs
        const pitchApplicationsInDraft = pitch.form_submissions.filter(
          (item: any) => item.form_uuid === formUUID && item.status === "started"
        );

        return pitchApplicationsInDraft.length
          ? [
              ...pitchApplicationsInDraft.map((item: any) => ({
                title: format(item.created_at, "MMMM, dd, yyyy. HH:mm"),
                value: item.uuid
              })),
              { title: t("Create a new application"), value: "create" }
            ]
          : [];
      }
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formUUID, pitches?.data, selectedPitchUUID, t]);

  /**
   * Ensure that draft_uuid is deregistered when
   * the dropdown isn't required. Also set a default
   * value if it is required
   */
  useEffect(() => {
    if (selectedPitchDrafts.length === 0) {
      form.unregister("draft_uuid");
    } else {
      form.setValue("draft_uuid", selectedPitchDrafts[0]?.value);
    }
  }, [form, selectedPitchDrafts]);

  return (
    <BackgroundLayout>
      <div className="sticky top-[74px] z-10 flex bg-leavesWithOverlay bg-cover bg-center p-6">
        <div className="mx-auto flex w-full min-w-0 max-w-[1200px] items-center gap-8 text-white">
          <Text variant="text-bold-subtitle-600" className="overflow-hidden text-ellipsis whitespace-nowrap">
            {formData?.data.title}
          </Text>
        </div>
      </div>
      <ContentLayout>
        <LoadingContainer loading={!formData?.data}>
          <Form>
            <Form.Header title={t("Select Pitch")} />

            <RHFDropdown
              name="pitch_uuid"
              label={t("Select a pitch for this application")}
              description={t(
                "Select a project pitch for your application. You can use a pitch you have already created or create a new one. Your pitch represents the proposed work you are seeking to fund. <br /><br /> You can update the details of your pitch while you are finalizing your application. If your expression of interest is accepted, you will be asked to provide more details of your project pitch. <br /><br /> Land Accelerator applicants: choose “Create a new pitch,” and then continue with your application. Please disregard the information above, it is not relevant to the Land Accelerator application."
              )}
              options={pitchesOptions}
              control={form.control}
              error={form.formState.errors.pitch_uuid}
              defaultValue={pitchesOptions[0].value}
            />

            <When condition={selectedPitchDrafts.length > 0}>
              <Text variant="text-bold-caption-200" className="-mt-5">
                {t("You already have one or more draft applications for this pitch.")}
              </Text>
              <RHFDropdown
                name="draft_uuid"
                label={t("Select Application Draft *")}
                description={t(
                  "You already have application drafts for this pitch. Please select a draft or create a new one to continue."
                )}
                options={selectedPitchDrafts}
                control={form.control}
                error={form.formState.errors.draft_uuid}
                defaultValue={selectedPitchDrafts[0]?.value}
              />
            </When>

            <Form.Footer
              primaryButtonProps={{
                children: t("Continue to application"),
                className: "px-[5%]",
                onClick: form.handleSubmit(handleCreateSubmission),
                disabled: isLoading || pitchesOptions.length === 0
              }}
              secondaryButtonProps={{
                children: t("Cancel"),
                as: Link,
                href: `/form/${formUUID}`,
                disabled: isLoading
              }}
            />
          </Form>
        </LoadingContainer>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default FormIntroPage;
