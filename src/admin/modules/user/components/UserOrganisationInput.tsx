import { FC, useEffect, useRef } from "react";
import { AutocompleteInput, ReferenceInput } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { isProjectDeveloper } from "@/admin/modules/user/const";

import modules from "../..";

/**
 * Only project developers may have an organisation. When the project-developer role is removed, the
 * organisation is blanked and remembered, so that it can be restored if the role is added back before saving.
 */
const UserOrganisationInput: FC = () => {
  const roles = useWatch({ name: "roles" }) as string[] | undefined;
  const { getValues, setValue } = useFormContext();
  const stashedOrganisationUuid = useRef<string | null>(null);
  const showOrganisation = isProjectDeveloper(roles);

  useEffect(() => {
    // Deferred because react-admin initializes the form by resetting it with the record in an effect on the
    // form component. Parent effects run after child effects, so on mount that reset would otherwise undo the
    // blanking below and clear the dirty state, preventing the cleared organisation from being saved.
    const timeout = setTimeout(() => {
      if (showOrganisation) {
        if (stashedOrganisationUuid.current != null) {
          setValue("organisationUuid", stashedOrganisationUuid.current, { shouldDirty: true });
          stashedOrganisationUuid.current = null;
        }
      } else {
        const organisationUuid = getValues("organisationUuid");
        if (organisationUuid != null) {
          stashedOrganisationUuid.current = organisationUuid;
          setValue("organisationUuid", null, { shouldDirty: true });
        }
      }
    });
    return () => clearTimeout(timeout);
  }, [showOrganisation, getValues, setValue]);

  return showOrganisation ? (
    <ReferenceInput source="organisationUuid" reference={modules.organisation.ResourceName}>
      <AutocompleteInput label="Organisation" optionText="name" fullWidth />
    </ReferenceInput>
  ) : null;
};

export default UserOrganisationInput;
