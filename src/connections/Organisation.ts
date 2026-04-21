import { createSelector } from "reselect";

import { selectMe, useMyUser } from "@/connections/User";
import {
  DataConnection,
  LoadFailureConnection,
  UpdateConnection,
  v3Resource
} from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator, resourceUpdater } from "@/connections/util/resourceMutator";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  createUserAssociation,
  organisationCreation,
  organisationDelete,
  organisationExportCsv,
  organisationIndex,
  OrganisationIndexQueryParams,
  organisationShow,
  organisationUpdate,
  updateUserAssociation
} from "@/generated/v3/userService/userServiceComponents";
import {
  FileDownloadDto,
  FinancialIndicatorDto,
  FinancialReportLightDto,
  FundingTypeDto,
  LeadershipDto,
  OrganisationFullDto,
  OrganisationLightDto,
  OrganisationUpdateAttributes,
  OwnershipStakeDto,
  TreeSpeciesDto,
  UserAssociationDto
} from "@/generated/v3/userService/userServiceSchemas";
import { V3ApiEndpoint } from "@/generated/v3/utils";
import { useConnection } from "@/hooks/useConnection";
import ApiSlice, { ApiDataStore } from "@/store/apiSlice";
import { Connected, Connection, Filter } from "@/types/connection";
import { loadConnection } from "@/utils/loadConnection";

type OrganisationConnection = {
  organisation?: OrganisationLightDto | OrganisationFullDto;
};

type FinancialIndicator = FinancialIndicatorDto & {
  organisationUuid?: string;
};

type UserStatus = "approved" | "rejected" | "requested";

export type MyOrganisationConnection = OrganisationConnection & {
  organisationId?: string;
  userStatus?: UserStatus;
};

type OrgJoinProps = {
  organisationUuid?: string;
};

type OrganisationUserUpdateProps = {
  organisationUuid: string;
  userUuid: string;
};

type OrganisationFinancialIndicatorsConnection = {
  financialIndicators: Array<FinancialIndicatorDto & { uuid: string }>;
};

type OrganisationFundingTypesConnection = {
  fundingTypes: FundingTypeDto[];
};

type OrganisationMediaConnection = {
  media: MediaDto[];
};

type OrganisationMediaByCollectionConnection = {
  media: MediaDto[];
};

type OrganisationTreeSpeciesConnection = {
  treeSpecies: TreeSpeciesDto[];
};

type OrganisationLeadershipConnection = {
  leadership: LeadershipDto[];
};

type OrganisationOwnershipStakesConnection = {
  ownershipStakes: OwnershipStakeDto[];
};

type OrganisationFinancialReportsConnection = {
  financialReports: FinancialReportLightDto[];
};

const selectOrganisations = (store: ApiDataStore) => store.organisations;
const selectFinancialIndicators = (store: ApiDataStore) => store.financialIndicators;
const selectFundingTypes = (store: ApiDataStore) => store.fundingTypes;
const selectMedia = (store: ApiDataStore) => store.media;
const selectTreeSpecies = (store: ApiDataStore) => store.treeSpecies;
const selectLeaderships = (store: ApiDataStore) => store.leaderships;
const selectOwnershipStakes = (store: ApiDataStore) => store.ownershipStakes;
const selectFinancialReports = (store: ApiDataStore) => store.financialReports;

const myOrganisationConnection: Connection<MyOrganisationConnection> = {
  selector: createSelector([selectMe, selectOrganisations], (user, orgs) => {
    const { id, meta } = user?.relationships?.org?.[0] ?? {};
    if (id == null) return {};

    return {
      organisationId: id,
      organisation: orgs?.[id]?.attributes,
      userStatus: meta?.userStatus as UserStatus
    };
  })
};

export const indexOrgsConnection = v3Resource("organisations", organisationIndex)
  .index<OrganisationLightDto>(() => ({ queryParams: { lightResource: true } }))
  .pagination()
  .filter<Filter<OrganisationIndexQueryParams>>()
  .buildConnection();

const organisationConnection = v3Resource("organisations", organisationShow)
  .singleFullResource<OrganisationFullDto & { lightResource: boolean }>(({ id }) =>
    id == null ? undefined : { pathParams: { uuid: id } }
  )
  .sideloads()
  .isLoading()
  .loadFailure()
  .update(organisationUpdate)
  .buildConnection();

const orgCreationConnection = v3Resource("organisations", organisationCreation)
  .create<OrganisationLightDto>()
  .buildConnection();

const orgJoinConnection = v3Resource("associatedUsers", createUserAssociation)
  .create<UserAssociationDto, OrgJoinProps>(({ organisationUuid }) =>
    // model: "organisations" is required by the unified route /userAssociations/v3/{model}/{uuid}
    organisationUuid != null ? { pathParams: { model: "organisations", uuid: organisationUuid } } : undefined
  )
  .buildConnection();

const orgUserAssociationUpdateConnection = v3Resource("associatedUsers", updateUserAssociation)
  .create<UserAssociationDto, OrganisationUserUpdateProps>(({ organisationUuid, userUuid }) =>
    organisationUuid == null || userUuid == null
      ? undefined
      : {
          pathParams: {
            model: "organisations",
            uuid: organisationUuid,
            userUuid
          }
        }
  )
  .buildConnection();

// The "myOrganisationConnection" is only valid once the users/me response has been loaded, so
// this hook depends on the myUserConnection to fetch users/me and then loads the data it needs
// from the store.
export const useMyOrg = (): Connected<MyOrganisationConnection> => {
  const [loaded] = useMyUser();
  const [, orgShape] = useConnection(myOrganisationConnection);
  return loaded ? [true, orgShape] : [false, {}];
};

export const loadOrganisation = connectionLoader(organisationConnection);
export const useOrganisation = connectionHook(organisationConnection);
export const updateOrganisation = resourceUpdater(
  organisationConnection as unknown as Connection<
    DataConnection<OrganisationFullDto> & LoadFailureConnection & UpdateConnection<OrganisationUpdateAttributes>,
    { id?: string }
  >
);
export const deleteOrganisation = deleterAsync("organisations", organisationDelete, uuid => ({
  pathParams: { uuid }
}));

export const loadOrganisations = connectionLoader(indexOrgsConnection);
export const useOrganisations = connectionHook(indexOrgsConnection);

export const createOrg = resourceCreator(orgCreationConnection);
export const useOrgCreate = connectionHook(orgCreationConnection);

export const useOrgJoin = connectionHook(orgJoinConnection);
export const useOrgUserAssociationUpdate = connectionHook(orgUserAssociationUpdateConnection);

const organisationFinancialIndicatorsConnection: Connection<
  OrganisationFinancialIndicatorsConnection,
  { organisationUuid: string }
> = {
  selector: createSelector(
    [selectFinancialIndicators, (_: ApiDataStore, props: { organisationUuid: string }) => props.organisationUuid],
    (financialIndicators, organisationUuid) => {
      if (organisationUuid == null || financialIndicators == null) {
        return { financialIndicators: [] };
      }

      return {
        financialIndicators: Object.entries(financialIndicators)
          .map(([uuid, resource]) => {
            const attrs = resource.attributes as FinancialIndicator;
            return { ...attrs, uuid };
          })
          .filter(indicator => indicator.organisationUuid === organisationUuid)
      };
    }
  )
};

const organisationFundingTypesConnection: Connection<OrganisationFundingTypesConnection, { organisationUuid: string }> =
  {
    selector: createSelector(
      [selectFundingTypes, (_: ApiDataStore, props: { organisationUuid: string }) => props.organisationUuid],
      (fundingTypes, organisationUuid) => {
        if (organisationUuid == null || fundingTypes == null) {
          return { fundingTypes: [] };
        }

        return {
          fundingTypes: Object.values(fundingTypes)
            .filter(resource => resource.attributes.organisationUuid === organisationUuid)
            .map(resource => resource.attributes)
        };
      }
    )
  };

const organisationMediaConnection: Connection<OrganisationMediaConnection, { organisationUuid: string }> = {
  selector: createSelector(
    [selectMedia, (_: ApiDataStore, props: { organisationUuid: string }) => props.organisationUuid],
    (media, organisationUuid) => {
      if (organisationUuid == null || media == null) {
        return { media: [] };
      }

      return {
        media: Object.values(media)
          .filter(
            resource =>
              resource.attributes.entityUuid === organisationUuid && resource.attributes.entityType === "organisations"
          )
          .map(resource => resource.attributes)
          .filter((attrs): attrs is MediaDto => Boolean(attrs))
      };
    }
  )
};

const organisationMediaByCollectionConnection: Connection<
  OrganisationMediaByCollectionConnection,
  { organisationUuid: string; collectionName: string }
> = {
  selector: createSelector(
    [
      selectMedia,
      (_: ApiDataStore, props: { organisationUuid: string; collectionName: string }) => props.organisationUuid,
      (_: ApiDataStore, props: { organisationUuid: string; collectionName: string }) => props.collectionName
    ],
    (media, organisationUuid, collectionName) => {
      if (organisationUuid == null || media == null) {
        return { media: [] };
      }

      return {
        media: Object.values(media)
          .filter(
            resource =>
              resource.attributes.entityUuid === organisationUuid &&
              resource.attributes.entityType === "organisations" &&
              resource.attributes.collectionName === collectionName
          )
          .map(resource => resource.attributes)
          .filter((attrs): attrs is MediaDto => Boolean(attrs))
      };
    }
  )
};

const organisationTreeSpeciesConnection: Connection<OrganisationTreeSpeciesConnection, { organisationUuid: string }> = {
  selector: createSelector(
    [selectTreeSpecies, (_: ApiDataStore, props: { organisationUuid: string }) => props.organisationUuid],
    (treeSpecies, organisationUuid) => {
      if (organisationUuid == null || treeSpecies == null) {
        return { treeSpecies: [] };
      }
      return {
        treeSpecies: Object.values(treeSpecies)
          .filter(
            resource =>
              resource.attributes.entityUuid === organisationUuid &&
              resource.attributes.entityType === "organisations" &&
              resource.attributes.collection === "historical-tree-species"
          )
          .map(resource => resource.attributes)
          .filter((attrs): attrs is TreeSpeciesDto => Boolean(attrs))
      };
    }
  )
};

const organisationLeadershipConnection: Connection<OrganisationLeadershipConnection, { organisationUuid: string }> = {
  selector: createSelector(
    [selectLeaderships, (_: ApiDataStore, props: { organisationUuid: string }) => props.organisationUuid],
    (leaderships, organisationUuid) => {
      if (organisationUuid == null || leaderships == null) {
        return { leadership: [] };
      }

      return {
        leadership: Object.values(leaderships)
          .filter(
            resource =>
              resource.attributes.entityUuid === organisationUuid &&
              resource.attributes.entityType === "organisations" &&
              resource.attributes.collection === "leadership-team"
          )
          .map(resource => resource.attributes)
          .filter((attrs): attrs is LeadershipDto => Boolean(attrs))
      };
    }
  )
};

const organisationOwnershipStakesConnection: Connection<
  OrganisationOwnershipStakesConnection,
  { organisationUuid: string }
> = {
  selector: createSelector(
    [selectOwnershipStakes, (_: ApiDataStore, props: { organisationUuid: string }) => props.organisationUuid],
    (ownershipStakes, organisationUuid) => {
      if (organisationUuid == null || ownershipStakes == null) {
        return { ownershipStakes: [] };
      }

      return {
        ownershipStakes: Object.values(ownershipStakes)
          .filter(
            resource =>
              resource.attributes.entityUuid === organisationUuid && resource.attributes.entityType === "organisations"
          )
          .map(resource => resource.attributes)
          .filter((attrs): attrs is OwnershipStakeDto => Boolean(attrs))
      };
    }
  )
};

const organisationFinancialReportsConnection: Connection<
  OrganisationFinancialReportsConnection,
  { organisationUuid: string }
> = {
  selector: createSelector(
    [selectFinancialReports, (_: ApiDataStore, props: { organisationUuid: string }) => props.organisationUuid],
    (financialReports, organisationUuid) => {
      if (organisationUuid == null || financialReports == null) {
        return { financialReports: [] };
      }

      return {
        financialReports: Object.values(financialReports)
          .filter(resource => resource.attributes.organisationUuid === organisationUuid)
          .map(resource => resource.attributes)
      };
    }
  )
};

export const useOrganisationFinancialIndicators = connectionHook(organisationFinancialIndicatorsConnection);
export const useOrganisationFundingTypes = connectionHook(organisationFundingTypesConnection);
export const useOrganisationMedia = connectionHook(organisationMediaConnection);
export const useOrganisationMediaByCollection = connectionHook(organisationMediaByCollectionConnection);
export const useOrganisationTreeSpecies = connectionHook(organisationTreeSpeciesConnection);
export const useOrganisationLeadership = connectionHook(organisationLeadershipConnection);
export const useOrganisationOwnershipStakes = connectionHook(organisationOwnershipStakesConnection);
export const useOrganisationFinancialReports = connectionHook(organisationFinancialReportsConnection);

const exportConnection = v3Resource("fileDownloads", organisationExportCsv as V3ApiEndpoint<FileDownloadDto>)
  .singleByCustomId(
    () => ({}),
    () => "organisationsExport"
  )
  .buildConnection();
export const downloadOrganisationCsv = async () => {
  ApiSlice.pruneCache("fileDownloads", ["organisationsExport"]);
  return (await loadConnection(exportConnection)) as DataConnection<FileDownloadDto> & LoadFailureConnection;
};
