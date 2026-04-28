import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { EditModalBase } from "@/components/extensive/Modal/ModalsBases";
import ConfirmationModal from "@/components/extensive/WizardForm/modals/ConfirmationModal";
import ErrorModal from "@/components/extensive/WizardForm/modals/ErrorModal";
import WizardEditForm from "@/components/extensive/WizardForm/modals/WizardEditForm";
import { useGadmOptions } from "@/connections/Gadm";
import {
  updateOrganisation,
  useOrganisation,
  useOrganisationFundingTypes,
  useOrganisationLeadership,
  useOrganisationMedia,
  useOrganisationOwnershipStakes,
  useOrganisationTreeSpecies
} from "@/connections/Organisation";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { OrganisationFullDto, OrganisationUpdateAttributes } from "@/generated/v3/userService/userServiceSchemas";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";
import { UploadedFile } from "@/types/common";

import { getSteps } from "./getEditOrganisationSteps";

type OrganizationEditModalProps = {
  organization?: OrganisationFullDto;
};

const COLLECTIONS = [
  "additional",
  "reference",
  "legal_registration",
  "logo",
  "cover",
  "bank_statements",
  "previous_annual_reports",
  "historic_restoration"
];

const OrganizationEditModal = ({ organization }: OrganizationEditModalProps) => {
  const router = useRouter();
  const uuid = router.query.id as string;
  const t = useT();
  const { closeModal, openModal } = useModalContext();
  const countryOptions = useGadmOptions({ level: 0 });

  const formSteps = useMemo(() => getSteps(t, countryOptions ?? []), [countryOptions, t]);
  const provider = useLocalStepsProvider(formSteps);

  const [, { media: allMediaFiles }] = useOrganisationMedia({
    organisationUuid: organization?.uuid ?? ""
  });

  const mediaFilesByCollection = useMemo(() => {
    const result: Record<string, UploadedFile[]> = {};

    COLLECTIONS.forEach(collection => {
      result[collection] = allMediaFiles
        .filter(
          media =>
            media.collectionName === collection &&
            media.url != null &&
            media.uuid != null &&
            media.fileName != null &&
            media.size != null
        )
        .map(media => ({
          uuid: media.uuid,
          url: media.url ?? "",
          thumbUrl: media.thumbUrl ?? undefined,
          size: media.size,
          fileName: media.fileName,
          mimeType: media.mimeType ?? "",
          createdAt: media.createdAt,
          collectionName: media.collectionName,
          isPublic: media.isPublic ?? undefined,
          isCover: media.isCover ?? undefined,
          lat: media.lat ?? undefined,
          lng: media.lng ?? undefined
        }));
    });

    return result;
  }, [allMediaFiles]);

  const [, { leadership: leadershipTeam }] = useOrganisationLeadership({
    organisationUuid: organization?.uuid ?? ""
  });

  const [, { treeSpecies: treeSpeciesHistorical }] = useOrganisationTreeSpecies({
    organisationUuid: organization?.uuid ?? ""
  });

  const [, { ownershipStakes }] = useOrganisationOwnershipStakes({
    organisationUuid: organization?.uuid ?? ""
  });

  const [, { fundingTypes }] = useOrganisationFundingTypes({
    organisationUuid: organization?.uuid ?? ""
  });

  const defaultValues = useMemo(() => {
    const orgData = organization ?? {};

    const valuesWithSideloads = {
      ...orgData,
      additional: mediaFilesByCollection.additional,
      reference: mediaFilesByCollection.reference,
      legal_registration: mediaFilesByCollection.legal_registration,
      logo: mediaFilesByCollection.logo,
      cover: mediaFilesByCollection.cover,
      bank_statements: mediaFilesByCollection.bank_statements,
      previous_annual_reports: mediaFilesByCollection.previous_annual_reports,
      historic_restoration: mediaFilesByCollection.historic_restoration,
      leadership_team: leadershipTeam,
      tree_species_historical: treeSpeciesHistorical,
      ownership_stake: ownershipStakes,
      funding_types: fundingTypes
    };
    return formDefaultValues(valuesWithSideloads, provider);
  }, [
    organization,
    mediaFilesByCollection,
    leadershipTeam,
    treeSpeciesHistorical,
    ownershipStakes,
    fundingTypes,
    provider
  ]);

  const [, { updateFailure }] = useOrganisation(uuid != null ? { id: uuid } : {});

  const saveOrganisation = useCallback(
    async (data: unknown, showSuccessModal: boolean) => {
      if (uuid == null) return;

      try {
        const formData = normalizedFormData(data as Record<string, unknown>, provider);
        if (typeof formData.finStartMonth === "string" && formData.finStartMonth.trim() !== "") {
          formData.finStartMonth = Number(formData.finStartMonth);
        }
        const attributes = formData as unknown as OrganisationUpdateAttributes;

        const updatedOrg = await updateOrganisation(attributes, { id: uuid });

        if (updatedOrg?.uuid != null) {
          if (!showSuccessModal) return;
          closeModal(ModalId.ORGANIZATION_EDIT_MODAL);
          return openModal(ModalId.CONFIRMATION_MODAL, <ConfirmationModal />);
        } else {
          return openModal(ModalId.ERROR_MODAL, <ErrorModal />);
        }
      } catch (error) {
        return openModal(ModalId.ERROR_MODAL, <ErrorModal />);
      }
    },
    [closeModal, openModal, provider, uuid]
  );

  const handleStepSave = useCallback(
    async (data: unknown) => {
      await saveOrganisation(data, false);
    },
    [saveOrganisation]
  );

  const handleSubmit = useCallback(
    async (data: unknown) => {
      await saveOrganisation(data, true);
    },
    [saveOrganisation]
  );

  const error =
    updateFailure != null
      ? { statusCode: updateFailure.statusCode, message: updateFailure.message, error: updateFailure.error }
      : undefined;

  const models = useMemo(() => ({ model: "organisations", uuid } as const), [uuid]);

  return (
    <EditModalBase>
      <WizardEditForm
        title={t("Edit Organization Profile")}
        framework={Framework.UNDEFINED}
        models={models}
        fieldsProvider={provider}
        onStepSave={handleStepSave}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        errors={error}
      />
    </EditModalBase>
  );
};

export default OrganizationEditModal;
