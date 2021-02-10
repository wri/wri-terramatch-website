import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';
import {
  OrganisationCreate,
  OrganisationsApi,
  OrganisationVersionsApi,
  UploadsApi,
  UploadCreate,
  OrganisationRead,
  OrganisationVersionReadAll,
  OrganisationVersionRead,
  OrganisationReadAll,
  OrganisationUpdate
} from 'wrm-api';
import { getMe } from './auth';
import moment from 'moment';

// Actions
export const CREATE_ORGANISATION = 'organisation/CREATE_ORGANISATION';
export const PATCH_ORGANISATION = 'organisation/PATCH_ORGANISATION';
export const UPLOAD_ORGANISATION_AVATAR = 'organisation/UPLOAD_ORGANISATION_AVATAR';
export const UPLOAD_ORGANISATION_COVER = 'organisation/UPLOAD_ORGANISATION_COVER';
export const GET_ORGANISATION = 'organisation/GET_ORGANISATION';
export const GET_ORGANISATIONS = 'organisation/GET_ORGANISATIONS';
export const GET_ORGANISATION_VERSIONS = 'organisation/GET_ORGANISATION_VERSIONS';
export const GET_ORGANISATION_VERSIONS_NAV_BAR = 'organisation/GET_ORGANISATION_VERSIONS_NAV_BAR';
export const GET_ORGANISATION_VERSION = 'organisation/GET_ORGANISATION_VERSION';

// Action Creators
export function createOrganisation(model) {
  return (dispatch, getState) => {
    const data = OrganisationCreate.constructFromObject(model);
    data.founded_at = moment(model.founded_at).format('YYYY-MM-DD');

    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: CREATE_ORGANISATION,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OrganisationsApi(), 'organisationsPost', data, token).then(
          async (resp) => {
            await dispatch(getMe());
            resolve(resp);
          }).catch((err) => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function uploadOrganisationAvatar(attributes) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: UPLOAD_ORGANISATION_AVATAR,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new UploadsApi(), 'uploadsPost', attributes.file, token).then(
          async (resp) => {
            resolve(UploadCreate.constructFromObject(resp));
          }).catch((err) => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function uploadOrganisationCover(attributes) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: UPLOAD_ORGANISATION_COVER,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new UploadsApi(), 'uploadsPost', attributes.file, token).then(
          async (resp) => {
            resolve(UploadCreate.constructFromObject(resp));
          }).catch((err) => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getOrganisation(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATION,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OrganisationsApi(), 'organisationsIDGet', null, token, id).then(
          async (resp) => {
            resolve(OrganisationRead.constructFromObject(resp));
          }).catch((err) => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getOrganisations() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATIONS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OrganisationsApi(), 'organisationsGet', null, token).then(
          async (resp) => {
            resolve(OrganisationReadAll.constructFromObject(resp, []));
          }).catch((err) => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getOrganisationVersions(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATION_VERSIONS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OrganisationVersionsApi(), 'organisationsIDOrganisationVersionsGet', null, token, id).then(
          (resp) => {
            resolve(OrganisationVersionReadAll.constructFromObject(resp, []));
          }).catch((err) => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getOrganisationVersionsNavBar(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATION_VERSIONS_NAV_BAR,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OrganisationVersionsApi(), 'organisationsIDOrganisationVersionsGet', null, token, id).then(
          (resp) => {
            resolve(OrganisationVersionReadAll.constructFromObject(resp, []));
          }).catch((err) => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getOrganisationVersion(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATION_VERSION,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OrganisationVersionsApi(), 'organisationVersionsIDGet', null, token, id).then(
          async (resp) => {
            resolve(OrganisationVersionRead.constructFromObject(resp));
          }).catch((err) => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};


export function patchOrganisation(model, id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const organisation = OrganisationUpdate.constructFromObject(model);
    organisation.founded_at = moment(model.founded_at).format('YYYY-MM-DD');

    const action = createAsyncAction({
      type: PATCH_ORGANISATION,
      payload: {
        promise: new apiPromiseWrapper(new OrganisationsApi(), 'organisationsIDPatch', organisation, token, id)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function clearCreateOrganisation() {
  return {
    type: CREATE_ORGANISATION + '_clear'
  };
}

export function clearOrganisationVersions() {
  return {
    type: GET_ORGANISATION_VERSIONS + '_clear'
  };
};

export function clearGetOrganisation() {
  return {
    type: GET_ORGANISATION + '_clear'
  };
};

export function clearGetOrganisations() {
  return {
    type: GET_ORGANISATIONS + '_clear'
  };
};

export function clearOrganisationVersion() {
  return {
    type: GET_ORGANISATION_VERSION + '_clear'
  };
};

export function clearPatchOrganisation() {
  return {
    type: PATCH_ORGANISATION + '_clear'
  }
};

export function clearGetOrganisationVersionsNavBar() {
  return {
    type: GET_ORGANISATION_VERSIONS_NAV_BAR + '_clear'
  }
};
