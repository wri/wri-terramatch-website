import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { EditModalBase } from "@/components/extensive/Modal/ModalsBases";
import ConfirmationModal from "@/components/extensive/WizardForm/modals/ConfirmationModal";
import ErrorModal from "@/components/extensive/WizardForm/modals/ErrorModal";
import WizardEditForm from "@/components/extensive/WizardForm/modals/WizardEditForm";
import { useGadmOptions } from "@/connections/Gadm";
import { updateOrganisation, useOrganisation } from "@/connections/Organisation";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import {
  FundingTypeDto,
  LeadershipDto,
  MediaDto,
  OrganisationFullDto,
  OrganisationUpdateAttributes,
  OwnershipStakeDto,
  TreeSpeciesDto
} from "@/generated/v3/userService/userServiceSchemas";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";
import { AppStore } from "@/store/store";
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
  const queryClient = useQueryClient();
  const router = useRouter();
  const uuid = router.query.id as string;
  const t = useT();
  const { closeModal, openModal } = useModalContext();
  const countryOptions = useGadmOptions({ level: 0 });

  const formSteps = useMemo(() => getSteps(t, countryOptions ?? []), [countryOptions, t]);
  const provider = useLocalStepsProvider(formSteps);

  const allMediaFiles = useSelector<AppStore, MediaDto[]>(state => {
    if (organization?.uuid == null || state.api.media == null) return [];

    return Object.values(state.api.media)
      .filter(
        resource =>
          resource.attributes.entityUuid === organization.uuid && resource.attributes.entityType === "organisations"
      )
      .map(resource => resource.attributes)
      .filter((attrs): attrs is MediaDto => Boolean(attrs));
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

  const leadershipTeam = useSelector<AppStore, LeadershipDto[]>(state => {
    if (organization?.uuid == null || state.api.leaderships == null) return [];

    return Object.values(state.api.leaderships)
      .filter(
        resource =>
          resource.attributes.entityUuid === organization.uuid &&
          resource.attributes.entityType === "organisations" &&
          resource.attributes.collection === "leadership-team"
      )
      .map(resource => resource.attributes)
      .filter((attrs): attrs is LeadershipDto => Boolean(attrs));
  });

  const treeSpeciesHistorical = useSelector<AppStore, TreeSpeciesDto[]>(state => {
    if (organization?.uuid == null || state.api.treeSpecies == null) return [];

    return Object.values(state.api.treeSpecies)
      .filter(
        resource =>
          resource.attributes.entityUuid === organization.uuid &&
          resource.attributes.entityType === "organisations" &&
          resource.attributes.collection === "historical-tree-species"
      )
      .map(resource => resource.attributes)
      .filter((attrs): attrs is TreeSpeciesDto => Boolean(attrs));
  });

  const ownershipStakes = useSelector<AppStore, OwnershipStakeDto[]>(state => {
    if (organization?.uuid == null || state.api.ownershipStakes == null) return [];

    return Object.values(state.api.ownershipStakes)
      .filter(
        resource =>
          resource.attributes.entityUuid === organization.uuid && resource.attributes.entityType === "organisations"
      )
      .map(resource => resource.attributes)
      .filter((attrs): attrs is OwnershipStakeDto => Boolean(attrs));
  });

  const fundingTypes = useSelector<AppStore, FundingTypeDto[]>(state => {
    if (organization?.uuid == null || state.api.fundingTypes == null) return [];
    return Object.values(state.api.fundingTypes)
      .filter(resource => resource.attributes.organisationUuid === organization.uuid)
      .map(resource => resource.attributes);
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

  const handleSave = useCallback(
    async (data: unknown) => {
      if (uuid == null) return;

      try {
        const formData = normalizedFormData(data as Record<string, unknown>, provider);
        const attributes = formData as unknown as OrganisationUpdateAttributes;

        const updatedOrg = await updateOrganisation(attributes, { id: uuid });

        if (updatedOrg?.uuid != null) {
          await queryClient.refetchQueries({ queryKey: ["auth", "me"] });

          closeModal(ModalId.ORGANIZATION_EDIT_MODAL);
          return openModal(ModalId.CONFIRMATION_MODAL, <ConfirmationModal />);
        } else {
          return openModal(ModalId.ERROR_MODAL, <ErrorModal />);
        }
      } catch (error) {
        return openModal(ModalId.ERROR_MODAL, <ErrorModal />);
      }
    },
    [closeModal, openModal, provider, uuid, queryClient]
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
        onSave={handleSave}
        defaultValues={defaultValues}
        errors={error}
      />
    </EditModalBase>
  );
};

export default OrganizationEditModal;
