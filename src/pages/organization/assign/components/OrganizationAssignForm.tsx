import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { When } from "react-if";

import Input from "@/components/elements/Inputs/Input/Input";
import Form from "@/components/extensive/Form/Form";
import {
  useGetV2OrganisationsListing,
  usePostV2Organisations,
  usePostV2OrganisationsJoinExisting
} from "@/generated/apiComponents";
import { V2OrganisationUpdate } from "@/generated/apiSchemas";
import { useInputDelay } from "@/hooks/useInputDelay";

import { useOrganizationCreateContext } from "../context/OrganizationCreate.provider";
import OrganizationAssignPanel from "./OrganizationCreatePanel";

const OrganizationAssignForm = () => {
  const t = useT();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { type, form, selectedOrganization } = useOrganizationCreateContext();
  const searchedTerm = form.watch("name");

  const { mutate: createOrganisation, isLoading: organisationCreateLoading } = usePostV2Organisations({
    onSuccess: async (data: any) => {
      const orgUUID = data.data.uuid;
      queryClient.refetchQueries({ queryKey: ["auth", "me"] });
      router.push(`/organization/create?uuid=${orgUUID}`);
    }
  });

  // Mutations
  const { mutate: joinOrganisation, isLoading: joinOrganisationLoading } = usePostV2OrganisationsJoinExisting({
    onSuccess: async () => {
      queryClient.refetchQueries({ queryKey: ["auth", "me"] });
      router.push(`/organization/status/pending`);
    }
  });
  // Queries
  const {
    data,
    isLoading,
    isFetching,
    refetch: fetchOrganizations
  } = useGetV2OrganisationsListing(
    {
      queryParams: {
        search: searchedTerm
      }
    },
    {
      enabled: false
    }
  );

  const { isTyping } = useInputDelay({
    when: searchedTerm,
    callback: () => fetchOrganizations()
  });

  /**
   * Clear form errors on start typing
   */
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      form.clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  /**
   * Handle Join Organization Button Click
   */
  const handleJoin = async () => {
    if (!selectedOrganization?.uuid) return;
    joinOrganisation({
      body: {
        organisation_uuid: selectedOrganization?.uuid
      }
    });
  };

  /**
   * Handle Create Organization Button Click
   */
  const handleCreate = async () => {
    try {
      await createOrganisation({ body: {} as V2OrganisationUpdate });
    } catch (err: any) {
      form.setError("name", { message: err.message });
    }
  };

  const loading = isTyping || isFetching || isLoading;

  return (
    <Form
      onSubmit={e => {
        e.preventDefault(); //To prevent form submit default behavior which was causing page to refresh which lead to `Ns_binding_aborted` error moreInfo: https://stackoverflow.com/questions/704561/ns-binding-aborted-shown-in-firefox-with-httpfox
        if (type === "join") {
          handleJoin();
        } else if (type === "create") {
          handleCreate();
        }
      }}
    >
      <Form.Header
        title={t("Join Or Create Organization")}
        subtitle={t(
          "If the organization you belong to is already created within Terramatch you can find and apply to join it. If your organization is new to Terramatch, you can start the organization set up process by creating a new one."
        )}
      />
      <div className="flex flex-col gap-2">
        <Input
          name="name"
          formHook={form}
          type="text"
          label={t("Organization Name")}
          placeholder={t("Type Organization Name")}
          error={form.formState.errors.name}
          clearable
        />
        <When condition={!type && searchedTerm}>
          <OrganizationAssignPanel searchedTerm={searchedTerm} organizations={data?.data ?? []} loading={loading} />
        </When>
      </div>
      <Form.Footer
        secondaryButtonProps={{
          children: "Back",
          onClick: () => router.back()
        }}
        primaryButtonProps={
          type === "join"
            ? {
                type: "submit",
                className: "!w-auto px-8",
                disabled: joinOrganisationLoading,
                children: t("Apply to join organization")
              }
            : {
                type: "submit",
                disabled: organisationCreateLoading,
                children: t("Create Organization"),
                onClick: handleCreate
              }
        }
      />
    </Form>
  );
};

export default OrganizationAssignForm;
