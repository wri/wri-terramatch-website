import { useMemo } from "react";

import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { useOnUnmount } from "@/hooks/useOnMount";
import ApiSlice from "@/store/apiSlice";

/**
 * Loads the organisation wizard form and its current answers. The organisation form isn't tied to a
 * framework; the same form applies to every organisation.
 *
 * On unmount, the organisation and the associations the form can change are pruned from the cache so
 * that any page displaying them fetches the updated values.
 */
export const useOrganisationForm = (uuid?: string) => {
  const { formData, form, isLoading, loadFailure, formLoadFailure } = useEntityForm(
    uuid == null ? undefined : "organisations",
    uuid
  );
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(form?.uuid);
  const defaultValues = useDefaultValues(formData, fieldsProvider);
  const models = useMemo(() => ({ model: "organisations", uuid: uuid ?? "" } as const), [uuid]);

  useOnUnmount(() => {
    if (uuid == null) return;
    ApiSlice.pruneCache("organisations", [uuid]);
    ApiSlice.pruneCache("formData", [`organisations|${uuid}`]);
    ApiSlice.pruneCache("leaderships");
    ApiSlice.pruneCache("ownershipStakes");
    ApiSlice.pruneCache("fundingTypes");
    ApiSlice.pruneCache("financialIndicators");
    ApiSlice.pruneCache("treeSpecies");
  });

  return {
    models,
    form,
    fieldsProvider,
    defaultValues,
    isReady: !isLoading && providerLoaded,
    loadFailure: loadFailure ?? formLoadFailure
  };
};
