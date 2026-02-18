import { useMemo } from "react";
import {
  DateInput,
  Edit,
  RecordContextProvider,
  SelectInput,
  TabbedForm,
  TextInput,
  useEditContext
} from "react-admin";
import { useSelector } from "react-redux";
import * as yup from "yup";

import { FileUploadInput } from "@/admin/components/Inputs/FileUploadInput";
import { ImageUploadInput } from "@/admin/components/Inputs/ImageUploadInput";
import { SelectCountryInput } from "@/admin/components/Inputs/SelectCountryInput";
import { validateForm } from "@/admin/utils/forms";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { MediaDto } from "@/generated/v3/userService/userServiceSchemas";
import { AppStore } from "@/store/store";
import { FileType } from "@/types/common";
import { optionToChoices } from "@/utils/options";

const validationSchema = yup.object({
  name: yup.string().nullable().required(),
  type: yup.string().nullable().required(),
  hqStreet1: yup.string().nullable().required(),
  hqStreet2: yup.string().nullable(),
  hqCity: yup.string().nullable().required(),
  hqState: yup.string().nullable().required(),
  hqCountry: yup.string().nullable().required(),
  phone: yup.string().nullable().required(),
  description: yup.string().nullable().required(),
  logo: yup.object().nullable(),
  cover: yup.object().nullable(),
  reference: yup.array(),
  additional: yup.array(),
  legal_registration: yup.array().min(1).required(),
  webUrl: yup.string().url().nullable(),
  facebookUrl: yup.string().url().nullable(),
  instagramUrl: yup.string().url().nullable(),
  linkedinUrl: yup.string().url().nullable(),
  twitterUrl: yup.string().url().nullable(),
  finStartMonth: yup.number().nullable(),
  haRestoredTotal: yup.number().nullable(),
  haRestored3year: yup.number().nullable(),
  treesGrownTotal: yup.number().nullable(),
  treesGrown3year: yup.number().nullable()
});

const EnrichedOrganisationEditContent = () => {
  const { record: baseRecord } = useEditContext();

  const allMediaFiles = useSelector<AppStore, MediaDto[]>(state => {
    if (baseRecord?.uuid == null || state.api.media == null) return [];

    return Object.values(state.api.media)
      .filter(
        resource =>
          resource.attributes.entityUuid === baseRecord.uuid && resource.attributes.entityType === "organisations"
      )
      .map(resource => resource.attributes)
      .filter((attrs): attrs is MediaDto => Boolean(attrs));
  });

  const enrichedRecord = useMemo(() => {
    if (!baseRecord) return baseRecord;

    const mediaFilesByCollection: Record<string, any[]> = {
      logo: [],
      cover: [],
      reference: [],
      additional: [],
      legal_registration: []
    };

    allMediaFiles.forEach(media => {
      const collectionName = media.collectionName;
      if (collectionName && Object.prototype.hasOwnProperty.call(mediaFilesByCollection, collectionName)) {
        mediaFilesByCollection[collectionName].push({
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
        });
      }
    });

    return {
      ...baseRecord,
      logo: mediaFilesByCollection.logo[0] ?? baseRecord.logo,
      cover: mediaFilesByCollection.cover[0] ?? baseRecord.cover,
      reference: mediaFilesByCollection.reference.length > 0 ? mediaFilesByCollection.reference : baseRecord.reference,
      additional:
        mediaFilesByCollection.additional.length > 0 ? mediaFilesByCollection.additional : baseRecord.additional,
      legal_registration:
        mediaFilesByCollection.legal_registration.length > 0
          ? mediaFilesByCollection.legal_registration
          : baseRecord.legal_registration
    };
  }, [baseRecord, allMediaFiles]);

  if (!enrichedRecord) return null;

  return (
    <RecordContextProvider value={enrichedRecord}>
      <TabbedForm validate={validateForm(validationSchema)}>
        <TabbedForm.Tab label="Organization Details">
          <TextInput source="name" label="Legal Name" fullWidth />
          <SelectInput
            source="type"
            label="Organization Type"
            choices={optionToChoices(getOrganisationTypeOptions())}
            fullWidth
          />
          <TextInput source="hqStreet1" label="Headquarters Street address" fullWidth />
          <TextInput source="hqStreet2" label="Headquarters Street address 2" fullWidth />
          <TextInput source="hqCity" label="Headquarters City" fullWidth />
          <TextInput source="hqState" label="Headquarters address State/Province" fullWidth />
          <TextInput source="hqZipcode" label="Headquarters address Zipcode" fullWidth />
          <SelectCountryInput source="hqCountry" label="Headquarters address Country" fullWidth />
          <TextInput source="phone" label="Organization WhatsApp Enabled Phone Number" fullWidth />
          <DateInput source="foundingDate" label="Date organization founded" fullWidth />
          <TextInput source="description" label="Organization Details" fullWidth multiline />
          <ImageUploadInput source="logo" label="Logo" fullWidth />
          <ImageUploadInput source="cover" label="Cover" fullWidth />

          <FileUploadInput source="reference" label="Reference Letters" multiple accept={FileType.Pdf} />
          <FileUploadInput
            source="additional"
            label="Other additional documents"
            multiple
            accept={FileType.ImagesAndDocs}
          />
          <FileUploadInput
            source="legal_registration"
            label="Proof of legal registrations"
            multiple
            accept={FileType.ImagesAndDocs}
          />
        </TabbedForm.Tab>

        <TabbedForm.Tab label="Social media">
          <TextInput source="webUrl" label="Website" fullWidth />
          <TextInput source="facebookUrl" label="Facebook" fullWidth />
          <TextInput source="instagramUrl" label="Instagram" fullWidth />
          <TextInput source="linkedinUrl" label="LinkedIn" fullWidth />
          <TextInput source="twitterUrl" label="Twitter" fullWidth />
        </TabbedForm.Tab>

        <TabbedForm.Tab label="Financial Scope of Work (Historic)">
          <TextInput source="finStartMonth" label="Start of financial year (month)" type="number" fullWidth />
          <TextInput source="haRestoredTotal" label="Total Hectares Restored" type="number" fullWidth />
          <TextInput source="haRestored3Year" label="Hecatres Restored in the last 3 years" type="number" fullWidth />
          <TextInput source="treesGrownTotal" label="Total Trees Grown" type="number" fullWidth />
          <TextInput source="treesGrown3Year" label="Trees Grown in the last 3 years" type="number" fullWidth />
        </TabbedForm.Tab>
      </TabbedForm>
    </RecordContextProvider>
  );
};

export const OrganisationEdit = () => {
  return (
    <Edit actions={false}>
      <EnrichedOrganisationEditContent />
    </Edit>
  );
};
