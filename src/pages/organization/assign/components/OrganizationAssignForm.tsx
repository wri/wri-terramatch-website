import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";

import Input from "@/components/elements/Inputs/Input/Input";
import Form from "@/components/extensive/Form/Form";
import { useOrganisations, useOrgCreate, useOrgJoin } from "@/connections/Organisation";
import { useMyUser } from "@/connections/User";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { useInputDelay } from "@/hooks/useInputDelay";
import { first } from "@/utils/array";
import Log from "@/utils/log";

import { useOrganizationCreateContext } from "../context/OrganizationCreate.provider";
import OrganizationAssignPanel from "./OrganizationCreatePanel";

const ORG_LIST_FILTER_BASE = { lightResource: true, view: "public" } as const;

const OrganizationAssignForm = () => {
  const t = useT();
  const router = useRouter();
  const { type, form, selectedOrganization } = useOrganizationCreateContext();

  const searchedTerm = (form.watch("name") ?? "") as string;
  const shouldSearch = searchedTerm.trim().length > 0;

  const [myUserLoaded, { user }] = useMyUser();

  const [, { create: createOrganisation, isCreating: organisationCreateLoading, data: createdOrg, createFailure }] =
    useOrgCreate({});

  const [, { create: joinOrg, isCreating: joinOrganisationLoading, createFailure: joinOrganisationFailure }] =
    useOrgJoin({ organisationUuid: selectedOrganization?.uuid });

  const orgFilter = useMemo(
    () => (shouldSearch ? { ...ORG_LIST_FILTER_BASE, search: searchedTerm } : ORG_LIST_FILTER_BASE),
    [shouldSearch, searchedTerm]
  );
  const [orgsLoaded, { data: organisationsData }] = useOrganisations({ filter: orgFilter });

  const { isTyping } = useInputDelay({ when: searchedTerm, callback: () => {} });

  /**
   * Handle successful organization creation
   */
  useRequestSuccess(
    organisationCreateLoading,
    createFailure,
    useCallback(() => {
      if (createdOrg?.uuid != null) {
        router.push(`/organization/create?uuid=${createdOrg.uuid}`);
      }
    }, [createdOrg?.uuid, router]),
    "Failed to create organization"
  );

  /**
   * Handle successful organization join request
   */
  useRequestSuccess(
    joinOrganisationLoading,
    joinOrganisationFailure,
    useCallback(() => {
      router.push(`/organization/status/pending`);
    }, [router]),
    "Failed to join organization"
  );

  /**
   * Handle creation errors
   */
  useEffect(() => {
    if (createFailure != null && !organisationCreateLoading) {
      const errorMessage = first(createFailure.message) ?? "Failed to create organization";
      form.setError("name", { message: errorMessage });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createFailure, organisationCreateLoading]);

  /**
   * Clear form errors on start typing
   */
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      form.clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  const handleJoin = useCallback(() => {
    if (user?.emailAddress == null) {
      // User email not available - cannot join organization
      Log.error("Cannot join organization: user email not available");
      return;
    }

    // Pass the required attributes for the unified createUserAssociation endpoint
    joinOrg({
      emailAddress: user.emailAddress,
      isManager: false // Self-join is typically not a manager
    });
  }, [joinOrg, user?.emailAddress]);

  const handleCreate = useCallback(() => {
    if (createOrganisation != null) {
      createOrganisation({ status: "draft" });
    }
  }, [createOrganisation]);

  const handleSubmit = useCallback(
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
  const primaryButtonProps = useMemo(
    () =>
      type === "join"
        ? {
            type: "submit" as const,
            className: "!w-auto px-8",
            disabled: joinOrganisationLoading || !myUserLoaded || user?.emailAddress == null,
            children: t("Apply to join organization")
          }
        : {
            type: "button" as const,
            disabled: organisationCreateLoading,
            children: t("Create Organization"),
            onClick: handleCreate
          },
    [type, joinOrganisationLoading, organisationCreateLoading, myUserLoaded, user?.emailAddress, t, handleCreate]
  );

  return (
    <Form onSubmit={handleSubmit}>
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
        {!type && searchedTerm && (
          <OrganizationAssignPanel
            searchedTerm={searchedTerm}
            organizations={(organisationsData ?? []) as unknown as Array<{ uuid: string; name: string }>}
            loading={loading}
          />
        )}
      </div>
      <Form.Footer
        secondaryButtonProps={{
          children: "Back",
          onClick: () => router.back()
        }}
        primaryButtonProps={primaryButtonProps}
      />
    </Form>
  );
};

export default OrganizationAssignForm;
