import { combineReducers } from 'redux';

import app from './modules/app';
import filters from './modules/filters';
import editPitch from './modules/editPitch';
import sort from './modules/sort';

import auth, {
  LOGIN,
  LOGOUT,
  VERIFY,
  GET_ME,
  REQUEST_PASSWORD_RESET,
  CHANGE_PASSWORD
} from './modules/auth';

import {
  GET_ADMINS,
  INVITE_ADMIN,
  ACCEPT_ADMIN_INVITE,
  GET_ORGANISATION_TASKS,
  GET_PITCH_TASKS,
  GET_MATCH_TASKS,
  APPROVE_ORGANISATION_TASKS,
  REJECT_ORGANISATION_TASKS,
  APPROVE_PITCH_TASKS,
  REJECT_PITCH_TASKS
} from './modules/admin';

import {
  CREATE_DRAFT,
  UPDATE_DRAFT,
  GET_OFFER_DRAFTS,
  GET_PITCH_DRAFTS,
  DELETE_DRAFT,
  PUBLISH_DRAFT
} from './modules/drafts';

import {
  GET_NOTIFICATIONS,
  PATCH_NOTIFICATION
} from './modules/notifications';

import {
  CREATE_USER,
  INVITE_USER,
  ACCEPT_USER_INVITE,
  PATCH_USER
} from './modules/users';

import {
  CREATE_ORGANISATION,
  PATCH_ORGANISATION,
  UPLOAD_ORGANISATION_AVATAR,
  UPLOAD_ORGANISATION_COVER,
  GET_ORGANISATION,
  GET_ORGANISATIONS,
  GET_ORGANISATION_VERSIONS,
  GET_ORGANISATION_VERSIONS_NAV_BAR,
  GET_ORGANISATION_VERSION
} from './modules/organisation';

import {
  CREATE_TEAM_MEMBER,
  PATCH_TEAM_MEMBER,
  REMOVE_TEAM_MEMBER,
  UPLOAD_TEAM_MEMBER_AVATAR,
  GET_TEAM_MEMBERS,
  GET_INSPECT_TEAM_MEMBERS
} from './modules/teamMembers';

import {
  GET_CARBON_CERTIFICATIONS,
  GET_CARBON_CERTIFICATIONS_INSPECT,
  CREATE_CARBON_CERTIFICATES,
  PATCH_CARBON_CERTIFICATES,
  DELETE_CARBON_CERTIFICATE
} from './modules/carbonCertifications';

import {
  GET_CASE_STUDIES,
  GET_NEWS_ITEMS,
  GET_TESTIMONIALS,
  GET_PROJECTS,
} from './modules/wp';

import {
  UPLOAD_PITCH_AVATAR,
  UPLOAD_PITCH_COVER,
  UPLOAD_PITCH_VIDEO,
  CREATE_PITCH,
  CREATE_PITCH_CONTACTS,
  GET_PITCH_CONTACTS,
  DELETE_PITCH_CONTACT,
  GET_ORGANISATION_PITCHES,
  GET_PITCH_VERSIONS,
  GET_PITCH_VERSION,
  GET_INSPECT_PITCHES,
  GET_PITCHES,
  GET_PITCH,
  PATCH_PITCH,
  ARCHIVE_PITCH,
  UPDATE_PITCH_VISIBILITY
} from './modules/pitch';

import {
  GET_ORGANISATION_OFFERS,
  GET_ORGANISATION_OFFERS_INSPECT,
  CREATE_OFFER,
  PATCH_OFFER,
  CREATE_OFFER_CONTACTS,
  GET_OFFER,
  GET_OFFERS,
  ARCHIVE_OFFER,
  GET_OFFER_CONTACTS,
  DELETE_OFFER_CONTACT,
  UPDATE_OFFER_VISIBILITY
} from './modules/offer';

import {
  CREATE_METRICS,
  GET_METRICS,
  GET_METRICS_INSPECT,
  PATCH_METRICS,
  DELETE_METRIC
} from './modules/metrics';

import {
  CREATE_TREE_SPECIES,
  GET_TREE_SPECIES,
  GET_TREE_SPECIES_INSPECT,
  PATCH_TREE_SPECIES,
  DELETE_TREE_SPECIES
} from './modules/treeSpecies';

import {
  CREATE_INTEREST,
  GET_RECIEVED_INTERESTS,
  GET_INITIATED_INTERESTS
} from './modules/interests';

import { GET_COUNTRIES } from './modules/countries';

import { UPLOAD } from './modules/upload';

import {
  CREATE_ORGANISATION_DOCUMENTS_AWARDS,
  GET_INSPECT_DOCUMENTS,
  GET_ORGANISATION_DOCUMENTS,
  CREATE_PITCH_DOCUMENTS,
  GET_INSPECT_PITCH_DOCUMENTS,
  GET_PITCH_DOCUMENTS,
  REMOVE_ORGANISATION_DOCUMENT,
  REMOVE_PITCH_DOCUMENT
} from './modules/documentAwards';

import {
  GET_MATCHES,
  UNMATCH
} from './modules/matches';

import {
  GET_COMPATIBILITY_SCORE
} from './modules/compatibilityScore';

import { asyncActionReducer, asyncPaginatedActionReducer } from './asyncActionReducer';

const authReducers = combineReducers({
  login: asyncActionReducer.bind(this, LOGIN, null),
  logout: asyncActionReducer.bind(this, LOGOUT, null),
  verify: asyncActionReducer.bind(this, VERIFY, null),
  requestPasswordReset: asyncActionReducer.bind(this, REQUEST_PASSWORD_RESET, null),
  changePassword: asyncActionReducer.bind(this, CHANGE_PASSWORD, null),
  me: asyncActionReducer.bind(this, GET_ME, null),
  jwt: auth
});

const adminReducers = combineReducers({
  getAdmins: asyncActionReducer.bind(this, GET_ADMINS, null),
  inviteAdmin: asyncActionReducer.bind(this, INVITE_ADMIN, null),
  acceptAdmin: asyncActionReducer.bind(this, ACCEPT_ADMIN_INVITE, null),
  getOrganisationTasks: asyncActionReducer.bind(this, GET_ORGANISATION_TASKS, null),
  getPitchTasks: asyncActionReducer.bind(this, GET_PITCH_TASKS, null),
  getMatchTasks: asyncActionReducer.bind(this, GET_MATCH_TASKS, null),
  approveOrganisationTasks: asyncActionReducer.bind(this, APPROVE_ORGANISATION_TASKS, null),
  rejectOrganisationTasks: asyncActionReducer.bind(this, REJECT_ORGANISATION_TASKS, null),
  approvePitchTasks: asyncActionReducer.bind(this, APPROVE_PITCH_TASKS, null),
  rejectPitchTasks: asyncActionReducer.bind(this, REJECT_PITCH_TASKS, null)
});

const countryReducers = combineReducers({
  getCountries: asyncActionReducer.bind(this, GET_COUNTRIES, null)
});

const draftReducers = combineReducers({
  createDraft: asyncActionReducer.bind(this, CREATE_DRAFT, null),
  updateDraft: asyncActionReducer.bind(this, UPDATE_DRAFT, null),
  getPitchDrafts: asyncActionReducer.bind(this, GET_PITCH_DRAFTS, null),
  getOfferDrafts: asyncActionReducer.bind(this, GET_OFFER_DRAFTS, null),
  deleteDraft: asyncActionReducer.bind(this, DELETE_DRAFT, null),
  publishDraft: asyncActionReducer.bind(this, PUBLISH_DRAFT, null)
});

const userReducers = combineReducers({
  createUser: asyncActionReducer.bind(this, CREATE_USER, null),
  patchUser: asyncActionReducer.bind(this, PATCH_USER, null),
  inviteUser: asyncActionReducer.bind(this, INVITE_USER, null),
  acceptUser: asyncActionReducer.bind(this, ACCEPT_USER_INVITE, null)
});

const organisationReducers = combineReducers({
  createOrganisation: asyncActionReducer.bind(this, CREATE_ORGANISATION, null),
  patchOrganisation: asyncActionReducer.bind(this, PATCH_ORGANISATION, null),
  getOrganisation: asyncActionReducer.bind(this, GET_ORGANISATION, null),
  getOrganisations: asyncActionReducer.bind(this, GET_ORGANISATIONS, null),
  getOrganisationVersions: asyncActionReducer.bind(this, GET_ORGANISATION_VERSIONS, null),
  getOrganisationVersionsNavBar: asyncActionReducer.bind(this, GET_ORGANISATION_VERSIONS_NAV_BAR, null),
  getOrganisationVersion: asyncActionReducer.bind(this, GET_ORGANISATION_VERSION, null),
  uploadOrganisationAvatar: asyncActionReducer.bind(this, UPLOAD_ORGANISATION_AVATAR, null),
  uploadOrganisationCover: asyncActionReducer.bind(this, UPLOAD_ORGANISATION_COVER, null)
});

const teamMemberReducers = combineReducers({
  createTeamMember: asyncActionReducer.bind(this, CREATE_TEAM_MEMBER, null),
  patchTeamMember: asyncActionReducer.bind(this, PATCH_TEAM_MEMBER, null),
  removeTeamMember: asyncActionReducer.bind(this, REMOVE_TEAM_MEMBER, null),
  uploadTeamMemberAvatar: asyncActionReducer.bind(this, UPLOAD_TEAM_MEMBER_AVATAR, null),
  getTeamMembers: asyncActionReducer.bind(this, GET_TEAM_MEMBERS, null),
  getInspectTeamMembers: asyncActionReducer.bind(this, GET_INSPECT_TEAM_MEMBERS, null)
});

const wpReducers = combineReducers({
  getCaseStudies: asyncActionReducer.bind(this, GET_CASE_STUDIES, null),
  getNewsItems: asyncActionReducer.bind(this, GET_NEWS_ITEMS, null),
  getTestimonials: asyncActionReducer.bind(this, GET_TESTIMONIALS, null),
  getProjects: asyncActionReducer.bind(this, GET_PROJECTS, null)
});

const pitchReducers = combineReducers({
  uploadPitchCover: asyncActionReducer.bind(this, UPLOAD_PITCH_COVER, null),
  uploadPitchAvatar: asyncActionReducer.bind(this, UPLOAD_PITCH_AVATAR, null),
  uploadPitchVideo: asyncActionReducer.bind(this, UPLOAD_PITCH_VIDEO, null),
  createPitch: asyncActionReducer.bind(this, CREATE_PITCH, null),
  createPitchContacts: asyncActionReducer.bind(this, CREATE_PITCH_CONTACTS, null),
  deletePitchContact: asyncActionReducer.bind(this, DELETE_PITCH_CONTACT, null),
  getPitchContacts: asyncActionReducer.bind(this, GET_PITCH_CONTACTS, null),
  getOrganisationPitches: asyncActionReducer.bind(this, GET_ORGANISATION_PITCHES, null),
  getPitchVersions: asyncActionReducer.bind(this, GET_PITCH_VERSIONS, null),
  getPitchVersion: asyncActionReducer.bind(this, GET_PITCH_VERSION, null),
  getPitchesInspect: asyncActionReducer.bind(this, GET_INSPECT_PITCHES, null),
  patchPitch: asyncActionReducer.bind(this, PATCH_PITCH, null),
  getPitches: asyncPaginatedActionReducer.bind(this, GET_PITCHES, null),
  getPitch: asyncActionReducer.bind(this, GET_PITCH, null),
  archivePitch: asyncActionReducer.bind(this, ARCHIVE_PITCH, null),
  updatePitchVisibility: asyncActionReducer.bind(this, UPDATE_PITCH_VISIBILITY, null)
});

const offerReducers = combineReducers({
  getOrganisationOffers: asyncActionReducer.bind(this, GET_ORGANISATION_OFFERS, null),
  getOrganisationOffersInspect: asyncActionReducer.bind(this, GET_ORGANISATION_OFFERS_INSPECT, null),
  createOffer: asyncActionReducer.bind(this, CREATE_OFFER, null),
  patchOffer: asyncActionReducer.bind(this, PATCH_OFFER, null),
  createOfferContacts: asyncActionReducer.bind(this, CREATE_OFFER_CONTACTS, null),
  getOffer: asyncActionReducer.bind(this, GET_OFFER, null),
  getOffers: asyncPaginatedActionReducer.bind(this, GET_OFFERS, null),
  archiveOffer: asyncActionReducer.bind(this, ARCHIVE_OFFER, null),
  getOfferContacts: asyncActionReducer.bind(this, GET_OFFER_CONTACTS, null),
  deleteOfferContact: asyncActionReducer.bind(this, DELETE_OFFER_CONTACT, null),
  updateOfferVisibility: asyncActionReducer.bind(this, UPDATE_OFFER_VISIBILITY, null)
});

const carbonCertificationReducers = combineReducers({
  getCarbonCertifications: asyncActionReducer.bind(this, GET_CARBON_CERTIFICATIONS, null),
  getCarbonCertificationsInspect: asyncActionReducer.bind(this, GET_CARBON_CERTIFICATIONS_INSPECT, null),
  createCarbonCertificates: asyncActionReducer.bind(this, CREATE_CARBON_CERTIFICATES, null),
  patchCarbonCertificates: asyncActionReducer.bind(this, PATCH_CARBON_CERTIFICATES, null),
  deleteCarbonCertificate: asyncActionReducer.bind(this, DELETE_CARBON_CERTIFICATE, null)
});

const metricReducers = combineReducers({
  createMetrics: asyncActionReducer.bind(this, CREATE_METRICS, null),
  getMetrics: asyncActionReducer.bind(this, GET_METRICS, null),
  getMetricsInspect: asyncActionReducer.bind(this, GET_METRICS_INSPECT, null),
  patchMetrics: asyncActionReducer.bind(this, PATCH_METRICS, null),
  deleteMetric: asyncActionReducer.bind(this, DELETE_METRIC, null)
});

const treeSpecieReducers = combineReducers({
  createTreeSpecies: asyncActionReducer.bind(this, CREATE_TREE_SPECIES, null),
  getTreeSpecies: asyncActionReducer.bind(this, GET_TREE_SPECIES, null),
  getTreeSpeciesInspect: asyncActionReducer.bind(this, GET_TREE_SPECIES_INSPECT, null),
  patchTreeSpecies: asyncActionReducer.bind(this, PATCH_TREE_SPECIES, null),
  deleteTreeSpecies: asyncActionReducer.bind(this, DELETE_TREE_SPECIES, null)
});

const interestReducers = combineReducers({
  createInterest: asyncActionReducer.bind(this, CREATE_INTEREST, null),
  getRecievedInterests: asyncActionReducer.bind(this, GET_RECIEVED_INTERESTS, null),
  getInitiatedInterests: asyncActionReducer.bind(this, GET_INITIATED_INTERESTS, null)
});

const notificationsReducers = combineReducers({
  getNotifications: asyncActionReducer.bind(this, GET_NOTIFICATIONS, null),
  patchNotifications: asyncActionReducer.bind(this, PATCH_NOTIFICATION, null)
});

const uploadReducers = combineReducers({
  upload: asyncActionReducer.bind(this, UPLOAD, null)
});

const documentAwardReducers = combineReducers({
  createDocumentAwards: asyncActionReducer.bind(this, CREATE_ORGANISATION_DOCUMENTS_AWARDS, null),
  getOrganisationDocuments: asyncActionReducer.bind(this, GET_ORGANISATION_DOCUMENTS, null),
  getDocumentsInspect: asyncActionReducer.bind(this, GET_INSPECT_DOCUMENTS, null),
  createPitchDocuments: asyncActionReducer.bind(this, CREATE_PITCH_DOCUMENTS, null),
  getPitchDocuments: asyncActionReducer.bind(this, GET_PITCH_DOCUMENTS, null),
  getPitchDocumentsInspect: asyncActionReducer.bind(this, GET_INSPECT_PITCH_DOCUMENTS, null),
  removeOrganisationDocument: asyncActionReducer.bind(this, REMOVE_ORGANISATION_DOCUMENT, null),
  removePitchDocument: asyncActionReducer.bind(this, REMOVE_PITCH_DOCUMENT, null)
});

const matchesReducers = combineReducers({
  getMatches: asyncActionReducer.bind(this, GET_MATCHES, null),
  unmatchConnection: asyncActionReducer.bind(this, UNMATCH, null)
});

const compatibilityScoreReducers = combineReducers({
  getCompatibilityScore: asyncActionReducer.bind(this, GET_COMPATIBILITY_SCORE, null)
});

const reducer = combineReducers({
  app,
  drafts: draftReducers,
  editPitch,
  filters,
  sort,
  auth: authReducers,
  admin: adminReducers,
  compatibilityScore: compatibilityScoreReducers,
  users: userReducers,
  pitch: pitchReducers,
  offer: offerReducers,
  organisations: organisationReducers,
  carbonCertifications: carbonCertificationReducers,
  teamMembers: teamMemberReducers,
  wp: wpReducers,
  countries: countryReducers,
  metrics: metricReducers,
  treeSpecies: treeSpecieReducers,
  notifications: notificationsReducers,
  upload: uploadReducers,
  documentAwards: documentAwardReducers,
  interests: interestReducers,
  matches: matchesReducers
});

export default reducer;
