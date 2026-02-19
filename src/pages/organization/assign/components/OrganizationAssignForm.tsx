import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { When } from "react-if";

import Input from "@/components/elements/Inputs/Input/Input";
import Form from "@/components/extensive/Form/Form";
import { useOrganisations, useOrgCreate } from "@/connections/Organisation";
import { usePostV2OrganisationsJoinExisting } from "@/generated/apiComponents";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { useInputDelay } from "@/hooks/useInputDelay";

import { useOrganizationCreateContext } from "../context/OrganizationCreate.provider";
import OrganizationAssignPanel from "./OrganizationCreatePanel";

const DEFAULT_ORG_FILTER = {
  lightResource: true,
  listing: true
} as const;

const OrganizationAssignForm = () => {
  const t = useT();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { type, form, selectedOrganization } = useOrganizationCreateContext();

  const [searchedTerm, setSearchTerm] = useState<string>("");

  const [, { create: createOrganisation, isCreating: organisationCreateLoading, data: createdOrg, createFailure }] =
    useOrgCreate({});
  const { mutate: joinOrganisation, isLoading: joinOrganisationLoading } = usePostV2OrganisationsJoinExisting({
    onSuccess: async () => {
      queryClient.refetchQueries({ queryKey: ["auth", "me"] });
      router.push(`/organization/status/pending`);
    }
  });

  const shouldSearch = useMemo(() => searchedTerm.trim().length > 0, [searchedTerm]);
  const orgFilter = useMemo(
    () => ({
      ...DEFAULT_ORG_FILTER,
      ...(shouldSearch ? { search: searchedTerm } : {})
    }),
    [shouldSearch, searchedTerm]
  );

  const [orgsLoaded, { data: organisationsData }] = useOrganisations({ filter: orgFilter });

  const { isTyping } = useInputDelay({
    when: searchedTerm,
    callback: () => {}
  });

  /**
   * Handle successful organization creation
   */
  useRequestSuccess(
    organisationCreateLoading,
    createFailure,
    useCallback(() => {
      if (createdOrg?.uuid != null) {
        queryClient.refetchQueries({ queryKey: ["auth", "me"] });
        router.push(`/organization/create?uuid=${createdOrg.uuid}`);
      }
    }, [createdOrg?.uuid, queryClient, router]),
    "Failed to create organization"
  );

  /**
   * Handle creation errors and clear form errors on typing
   */
  useEffect(() => {
    if (createFailure != null && !organisationCreateLoading) {
      const errorMessage = createFailure.message ?? "Failed to create organization";
      form.setError("name", { message: errorMessage });
    } else if (isTyping && Object.keys(form.formState.errors).length > 0) {
      form.clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createFailure, organisationCreateLoading, isTyping]);

  /**
   * Handle Join Organization Button Click
   */
  const handleJoin = useCallback(async () => {
    if (selectedOrganization?.uuid == null) return;
    joinOrganisation({
      body: {
        organisation_uuid: selectedOrganization.uuid
      }
    });
  }, [selectedOrganization?.uuid, joinOrganisation]);

  /**
   * Handle Create Organization Button Click
   */
  const handleCreate = useCallback(() => {
    if (createOrganisation != null) {
      createOrganisation({ status: "draft" });
    }
  }, [createOrganisation]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (type === "join") {
        handleJoin();
      } else if (type === "create") {
        handleCreate();
      }
    },
    [type, handleJoin, handleCreate]
  );

  const loading = isTyping || !orgsLoaded;

  return (
    <Form onSubmit={handleFormSubmit}>
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
          onChange={e => setSearchTerm(e.target.value)}
        />
        <When condition={!type && searchedTerm}>
          <OrganizationAssignPanel
            searchedTerm={searchedTerm}
            organizations={(organisationsData ?? []) as unknown as Array<{ uuid: string; name: string }>}
            loading={loading}
          />
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
                type: "button",
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
