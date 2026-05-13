import { Box, Card, Divider, Typography } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import {
  ArrayField,
  Datagrid,
  DateField,
  ImageField,
  NumberField,
  RecordContextProvider,
  SelectField,
  Show,
  ShowBase,
  SimpleShowLayout,
  TabbedShowLayout,
  TextField,
  UrlField,
  useRecordContext,
  useRefresh,
  useShowContext
} from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import { FileArrayField } from "@/admin/components/Fields/FileArrayField";
import SimpleChipFieldArray from "@/admin/components/Fields/SimpleChipFieldArray";
import FinancialDescriptionsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDescriptionsSection";
import FinancialDocumentsSection from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialDocumentsSection";
import FinancialMetrics from "@/admin/components/ResourceTabs/HistoryTab/components/FinancialMetrics";
import FundingSourcesSection from "@/admin/components/ResourceTabs/HistoryTab/components/FundingSourcesSection";
import Accordion from "@/components/elements/Accordion/Accordion";
import { useGadmChoices } from "@/connections/Gadm";
import {
  useOrganisation,
  useOrganisationFinancialIndicators,
  useOrganisationFundingTypes,
  useOrganisationMedia,
  useOrganisationTreeSpecies
} from "@/connections/Organisation";
import {
  getFarmersEngagementStrategyOptions,
  getWomenEngagementStrategyOptions,
  getYoungerThan35EngagementStrategyOptions
} from "@/constants/options/engagementStrategy";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { formatDescriptionData, formatDocumentData } from "@/utils/financialReport";
import { optionToChoices } from "@/utils/options";

import OrganisationApplicationsTable from "./OrganisationApplicationsTable";
import OrganisationFundingProgrammesTable from "./OrganisationFundingProgrammesTable";
import OrganisationPitchesTable from "./OrganisationPitchesTable";
import { OrganisationShowAside } from "./OrganisationShowAside";
import OrganisationUserTable from "./OrganisationUserTable";

const OrganisationShowActions: FC = () => {
  const record = useRecordContext();
  if (!record) return null;
  const { uuid, isTest } = record;
  const refresh = useRefresh();
  const [, { update: updateOrg, isUpdating, updateFailure }] = useOrganisation({ id: uuid });
  useRequestSuccess(isUpdating, updateFailure, refresh);

  const toggleTestStatus = useCallback(() => {
    if (uuid == null) return;
    updateOrg({ isTest: !isTest });
  }, [isTest, updateOrg, uuid]);

  return <ShowActions toggleTestStatus={toggleTestStatus} />;
};

const OrganisationDataConsumer = () => {
  const { record } = useShowContext();
  if (!record) <></>;

  const [, { financialIndicators }] = useOrganisationFinancialIndicators({
    organisationUuid: record?.uuid ?? ""
  });

  const [, { fundingTypes }] = useOrganisationFundingTypes({
    organisationUuid: record?.uuid ?? ""
  });

  const years = Array.isArray(financialIndicators)
    ? Array.from(new Set(financialIndicators?.map(item => item.year).filter(Boolean))).sort()
    : [];

  return (
    <div className="flex flex-col gap-8 p-2">
      <FinancialMetrics data={financialIndicators} years={years} orgModel />
      <Accordion
        title="Financial Documents per Year"
        variant="drawer"
        className="rounded-lg bg-white px-6 py-4 shadow-all"
      >
        <FinancialDocumentsSection files={formatDocumentData(financialIndicators)} />
      </Accordion>
      <Accordion
        title="Descriptions of Financials per Year"
        variant="drawer"
        className="rounded-lg bg-white px-6 py-4 shadow-all"
      >
        <FinancialDescriptionsSection items={formatDescriptionData(financialIndicators)} />
      </Accordion>

      <Accordion
        title="Major Funding Sources by Year"
        variant="drawer"
        className="rounded-lg bg-white px-6 py-4 shadow-all"
      >
        <FundingSourcesSection data={fundingTypes} currency={record?.currency ?? undefined} />
      </Accordion>
    </div>
  );
};

const EnrichedOrganisationShowContent = () => {
  const { record: baseRecord } = useShowContext();
  const countryChoices = useGadmChoices({ level: 0 });

  const [, { media: allMediaFiles }] = useOrganisationMedia({
    organisationUuid: baseRecord?.uuid ?? ""
  });

  const [, { treeSpecies: treeSpeciesHistorical }] = useOrganisationTreeSpecies({
    organisationUuid: baseRecord?.uuid ?? ""
  });

  const enrichedRecord = useMemo(() => {
    if (!baseRecord) return baseRecord;

    const mediaFilesByCollection: Record<string, any[]> = {
      logo: [],
      cover: [],
      reference: [],
      additional: [],
      legal_registration: [],
      previousAnnualReports: [],
      historicRestoration: []
    };

    allMediaFiles.forEach(({ collectionName, url, fileName, uuid }) => {
      if (collectionName && mediaFilesByCollection[collectionName]) {
        mediaFilesByCollection[collectionName].push({ url, fileName, uuid });
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
          : baseRecord.legal_registration,
      previousAnnualReports:
        mediaFilesByCollection.previousAnnualReports.length > 0
          ? mediaFilesByCollection.previousAnnualReports
          : baseRecord.previousAnnualReports,
      historicRestoration:
        mediaFilesByCollection.historicRestoration.length > 0
          ? mediaFilesByCollection.historicRestoration
          : baseRecord.historicRestoration,
      tree_species_historical:
        treeSpeciesHistorical.length > 0 ? treeSpeciesHistorical : baseRecord.tree_species_historical
    };
  }, [baseRecord, allMediaFiles, treeSpeciesHistorical]);

  if (!enrichedRecord) return null;

  return (
    <RecordContextProvider value={enrichedRecord}>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Organization Details">
          <TextField source="name" label="Legal Name" emptyText="Not Provided" />
          <TextField source="status" label="Status" emptyText="Not Provided" className="capitalize" />
          <SelectField
            source="type"
            label="Organization Type"
            choices={optionToChoices(getOrganisationTypeOptions())}
            emptyText="Not Provided"
          />
          <TextField source="hqStreet1" label="Headquarters Street address" emptyText="Not Provided" />
          <TextField source="hqStreet2" label="Headquarters Street address 2" emptyText="Not Provided" />
          <TextField source="hqCity" label="Headquarters City" emptyText="Not Provided" />
          <TextField source="hqState" label="Headquarters address State/Province" emptyText="Not Provided" />
          <TextField source="hqZipcode" label="Headquarters address Zipcode" emptyText="Not Provided" />
          <SelectField
            source="hqCountry"
            label="Headquarters address Country"
            choices={countryChoices}
            emptyText="Not Provided"
          />
          <TextField source="phone" label="Organization WhatsApp Enabled Phone Number" emptyText="Not Provided" />
          <DateField source="foundingDate" label="Date organization founded" emptyText="Not Provided" locales="en-GB" />
          <TextField source="description" label="Organization Details" emptyText="Not Provided" />
          <ImageField source="logo.url" label="Logo" title="logo.fileName" emptyText="Not Provided" />
          <ImageField source="cover.url" label="Cover" title="cover.fileName" emptyText="Not Provided" />

          <FileArrayField source="reference" label="Reference Letters" />
          <FileArrayField source="additional" label="Other additional documents" />
          <FileArrayField source="legal_registration" label="Proof of legal registrations" />
          <Divider />

          <Typography variant="h6" component="h3">
            Social Media
          </Typography>
          <UrlField source="webUrl" label="Website" emptyText="Not Provided" target="_blank" />
          <UrlField source="facebookUrl" label="Facebook" emptyText="Not Provided" target="_blank" />
          <UrlField source="instagramUrl" label="Instagram" emptyText="Not Provided" target="_blank" />
          <UrlField source="linkedinUrl" label="LinkedIn" emptyText="Not Provided" target="_blank" />
          <UrlField source="twitterUrl" label="Twitter" emptyText="Not Provided" target="_blank" />
        </TabbedShowLayout.Tab>

        <TabbedShowLayout.Tab label="Financial History">
          <OrganisationDataConsumer />
        </TabbedShowLayout.Tab>

        <TabbedShowLayout.Tab label="Community Engagement">
          <SimpleChipFieldArray
            source="engagementFarmers"
            label="Enagement: Farmers"
            choices={optionToChoices(getFarmersEngagementStrategyOptions())}
            emptyText="Not Provided"
          />
          <SimpleChipFieldArray
            source="engagementWomen"
            label="Enagement: Women"
            choices={optionToChoices(getWomenEngagementStrategyOptions())}
            emptyText="Not Provided"
          />
          <SimpleChipFieldArray
            source="engagementYouth"
            label="Engagement: Youth"
            choices={optionToChoices(getYoungerThan35EngagementStrategyOptions())}
            emptyText="Not Provided"
          />
          <TextField
            source="communityExperience"
            label="Community Engagement Experience/Approach"
            emptyText="Not Provided"
          />
          <TextField
            source="totalEngagedCommunityMembers3Yr"
            label="Community Engagement Numbers"
            emptyText="Not Provided"
          />
        </TabbedShowLayout.Tab>

        <TabbedShowLayout.Tab label="Restoration Experience">
          <NumberField
            source="relevantExperienceYears"
            label="Years of relevant restoration experience"
            emptyText="Not Provided"
          />
          <NumberField source="haRestoredTotal" label="Total Hectares Restored" emptyText="Not Provided" />
          <NumberField
            source="haRestored3Year"
            label="Hectares Restored in the last 3 years"
            emptyText="Not Provided"
          />
          <NumberField source="treesGrownTotal" label="Total Trees Grown" emptyText="Not Provided" />
          <NumberField source="treesGrown3Year" label="Trees Grown in the last 3 years" emptyText="Not Provided" />
          <ArrayField source="tree_species_historical" label="Tree Species Grown" emptyText="Not Provided">
            <Datagrid
              bulkActionButtons={false}
              empty={
                <Typography component="span" variant="body2">
                  Not Provided
                </Typography>
              }
            >
              <TextField label={false} source="name" />
            </Datagrid>
          </ArrayField>
          <NumberField source="avgTreeSurvivalRate" label="Average Tree Survival Rate" emptyText="Not Provided" />
          <SimpleChipFieldArray
            source="restorationTypesImplemented"
            label="Restoration Intervention Types Implemented"
            choices={optionToChoices(getRestorationInterventionTypeOptions())}
            emptyText="Not Provided"
          />
          <TextField
            source="treeMaintenanceAftercareApproach"
            label="Tree Maintenance & After Care Approach"
            emptyText="Not Provided"
          />
          <TextField source="restoredAreasDescription" label="Description of areas restored" emptyText="Not Provided" />
          <TextField
            source="monitoringEvaluationExperience"
            label="Monitoring and evaluation experience"
            emptyText="Not Provided"
          />
          <FileArrayField
            source="previousAnnualReports"
            label="Previous Annual Reports for Monitored Restoration Projects"
            emptyText="Not Provided"
          />
          <FileArrayField
            source="historicRestoration"
            label="Photos of past restoration work"
            emptyText="Not Provided"
          />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </RecordContextProvider>
  );
};

export const OrganisationShow = () => {
  return (
    <>
      <Show actions={<OrganisationShowActions />} aside={<OrganisationShowAside />}>
        <EnrichedOrganisationShowContent />
      </Show>
      <ShowBase>
        <Box mr="366px">
          <Card sx={{ marginTop: 2, marginBottom: 2 }}>
            <SimpleShowLayout>
              <OrganisationFundingProgrammesTable />
            </SimpleShowLayout>
          </Card>
          <Card sx={{ marginTop: 2, marginBottom: 2 }}>
            <SimpleShowLayout>
              <OrganisationPitchesTable />
            </SimpleShowLayout>
          </Card>
          <Card sx={{ marginTop: 2, marginBottom: 2 }}>
            <SimpleShowLayout>
              <OrganisationApplicationsTable />
            </SimpleShowLayout>
          </Card>
          <Card sx={{ marginTop: 2, marginBottom: "180px", overflow: "visible" }}>
            <SimpleShowLayout>
              <OrganisationUserTable />
            </SimpleShowLayout>
          </Card>
          <br />
        </Box>
      </ShowBase>
    </>
  );
};
