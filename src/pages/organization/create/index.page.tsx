import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import WizardForm from "@/components/extensive/WizardForm";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { deleteOrganisation, updateOrganisation, useMyOrg, useOrganisation } from "@/connections/Organisation";
import { useMyUser } from "@/connections/User";
import { helpCenterLink } from "@/constants/links";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { logout } from "@/generated/v3/utils";
import { normalizedFormData } from "@/helpers/customForms";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useOrganisationForm } from "@/hooks/useOrganisationForm";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

const CreateOrganisationForm = () => {
  const t = useT();
  const router = useRouter();
  const [, { user }] = useMyUser();
  const [, { organisationId }] = useMyOrg();
  const { openModal, closeModal } = useModalContext();

  const uuid = (organisationId || router?.query?.uuid) as string;

  const [orgLoaded, { data: orgData }] = useOrganisation(uuid != null ? { id: uuid } : {});
  const { models, fieldsProvider, defaultValues, isReady } = useOrganisationForm(uuid);
  const { updateEntityAnswers, entityAnswersUpdating } = useFormUpdate("organisations", uuid);

  const handleSubmit = useCallback(async () => {
    if (uuid == null) return;
    try {
      await updateOrganisation({ status: "pending-approval" }, { id: uuid });
      // users/me may predate the creation of this org; reload it so that useMyOrg reports the new org.
      if (user != null) ApiSlice.pruneCache("users", [user.uuid]);
      router.push("/organization/create/confirm");
    } catch (error) {
      Log.error("Failed to submit organization:", error);
    }
  }, [uuid, user, router]);

  const handleDeleteDraft = useCallback(async () => {
    if (uuid == null) return;
    try {
      await deleteOrganisation(uuid);
      // users/me still relates the user to the deleted organisation; reload it so that useMyOrg
      // reports that the user no longer has one.
      if (user != null) ApiSlice.pruneCache("users", [user.uuid]);
      router.push("/organization/assign");
      closeModal(ModalId.WARNING);
    } catch (error) {
      Log.error("Failed to delete draft organization:", error);
    }
  }, [uuid, user, router, closeModal]);

  const onBackFirstStep = (shouldHideWarning?: boolean) => {
    if (shouldHideWarning) {
      handleDeleteDraft();
      return;
    }
    openModal(
      ModalId.WARNING,
      <Modal
        title={t("Warning")}
        content={t("Leaving this page will cause you to lose your progress. Are you sure?")}
        primaryButtonProps={{
          children: t("Yes"),
          onClick: handleDeleteDraft
        }}
        secondaryButtonProps={{
          children: t("No"),
          onClick: () => closeModal(ModalId.WARNING)
        }}
      />
    );
  };

  // Save and Exit logs the user out; wait for any in-flight save to finish first so it isn't cut off.
  const [exitRequested, setExitRequested] = useState(false);
  useEffect(() => {
    if (exitRequested && !entityAnswersUpdating) logout(router);
  }, [entityAnswersUpdating, exitRequested, router]);

  const saveAndCloseModal = useMemo(
    () => ({
      content: (
        <Text as="span" textStyle="400">
          {t(
            "TerraMatch will save the information you’ve entered, and you’ll be logged out. Next time you log in, you’ll be prompted to complete this form. You must submit your organization profile, and have a reviewer approve it, before you can access any funding opportunities. For additional guidance, you can access the {helpCenter}.",
            {
              helpCenter: (
                <Link href={helpCenterLink} target="_blank" rel="noopener noreferrer" className="underline">
                  {t("TerraMatch Help Center")}
                </Link>
              )
            }
          )}
        </Text>
      ),
      onConfirm: () => setExitRequested(true)
    }),
    [t]
  );

  const onChange = useCallback(
    (data: Dictionary<unknown>) => updateEntityAnswers({ answers: normalizedFormData(data, fieldsProvider) }),
    [fieldsProvider, updateEntityAnswers]
  );

  return (
    <BackgroundLayout>
      <LoadingContainer loading={uuid != null && (!orgLoaded || !isReady)}>
        <WizardForm
          framework={Framework.UNDEFINED}
          models={models}
          fieldsProvider={fieldsProvider}
          formStatus={entityAnswersUpdating ? "saving" : "saved"}
          defaultValues={defaultValues}
          onChange={onChange}
          onSubmit={handleSubmit}
          submitButtonDisable={entityAnswersUpdating}
          onBackFirstStep={onBackFirstStep}
          title={t("Create Organization")}
          saveAndCloseModal={saveAndCloseModal}
          summaryOptions={{
            title: t("Review Details"),
            downloadButtonText: t("Download")
          }}
          roundedCorners
          entity={orgData ?? undefined}
        />
      </LoadingContainer>
    </BackgroundLayout>
  );
};

export default CreateOrganisationForm;
