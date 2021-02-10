import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper, { paginatedApiWrapper } from '../services/apiClientPromiseWrapper';
import { getUploadAction } from '../services/uploads';
import { convertReduxFiltersToApiFormat } from '../../helpers';
import {
  PitchCreate,
  PitchUpdate,
  PitchesApi,
  PitchVersionsApi,
  PitchVersionReadAll,
  PitchReadAll,
  PitchRead,
  PitchContactsApi,
  PitchVersionRead,
  PitchContactReadAll
} from 'wrm-api';

export const UPLOAD_PITCH_COVER = 'pitches/UPLOAD_PITCH_COVER';
export const UPLOAD_PITCH_AVATAR = 'pitches/UPLOAD_PITCH_AVATAR';
export const UPLOAD_PITCH_VIDEO = 'pitches/UPLOAD_PITCH_VIDEO';
export const CREATE_PITCH = 'pitches/CREATE_PITCH';
export const GET_PITCH = 'pitches/GET_PITCH';
export const GET_PITCH_CONTACTS = 'pitches/GET_PITCH_CONTACTS';
export const CREATE_PITCH_CONTACTS = 'pitches/CREATE_PITCH_CONTACTS';
export const GET_ORGANISATION_PITCHES = 'pitches/GET_ORGANISATION_PITCHES'
export const GET_PITCH_VERSIONS = 'pitches/GET_PITCH_VERSIONS';
export const GET_PITCH_VERSION = 'pitches/GET_PITCH_VERSION';
export const GET_INSPECT_PITCHES = 'pitches/GET_INSPECT_PITCHES';
export const GET_PITCHES = 'pitches/GET_PITCHES';
export const PATCH_PITCH = 'pitches/PATCH_PITCH';
export const ARCHIVE_PITCH = 'pitches/ARCHIVE_PITCH';
export const UPDATE_PITCH_VISIBILITY = 'pitches/UPDATE_PITCH_VISIBILITY';

export const DELETE_PITCH_CONTACT = 'pitches/DELETE_PITCH_CONTACT';

export const uploadPitchCover = (attributes) => {
  return getUploadAction(UPLOAD_PITCH_COVER, attributes);
};

export const uploadPitchAvatar = (attributes) => {
  return getUploadAction(UPLOAD_PITCH_AVATAR, attributes);
};

export const uploadPitchVideo = (attributes) => {
  return getUploadAction(UPLOAD_PITCH_VIDEO, attributes);
};

// Action Creators
export function createPitch(model) {
  return (dispatch, getState) => {
    const data = PitchCreate.constructFromObject(model);
    const token = getState().auth.login.data.token;

    data.long_term_engagement = null;

    const action = createAsyncAction({
      type: CREATE_PITCH,
      payload: {
        promise: new apiPromiseWrapper(new PitchesApi(), 'pitchesPost', data, token)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getOrganisationPitches(organisationId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATION_PITCHES,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new PitchesApi(), 'organisationsIDPitchesGet', null, token, organisationId).then(
            (resp) => {
              resolve(resp);
            }
          ).catch(reject)
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getPitch(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_PITCH,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new PitchesApi(), 'pitchesIDGet', null, token, id).then(
          (resp) => {
            resolve(PitchRead.constructFromObject(resp));
          }).catch((err) => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
}

export function getPitchVersions(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_PITCH_VERSIONS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new PitchVersionsApi(), 'pitchesIDPitchVersionsGet', null, token, id).then(
          (resp) => {
            resolve(PitchVersionReadAll.constructFromObject(resp, []));
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

export function getPitchVersion(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_PITCH_VERSION,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new PitchVersionsApi(), 'pitchVersionsIDGet', null, token, id).then(
          async (resp) => {
            resolve(PitchVersionRead.constructFromObject(resp));
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

export function getPitchesInspect(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_INSPECT_PITCHES,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new PitchesApi(), 'organisationsIDPitchesInspectGet', null, token, id).then(
          (resp) => {
            resolve(PitchReadAll.constructFromObject(resp, []));
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

export function getPitchContacts(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_PITCH_CONTACTS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new PitchContactsApi(), 'pitchesIDPitchContactsGet', null, token, id).then(
          (resp) => {
            resolve(PitchContactReadAll.constructFromObject(resp, []));
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

export function archivePitch(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: ARCHIVE_PITCH,
      payload: {
        promise: new apiPromiseWrapper(new PitchesApi(), 'pitchesIDCompletePatch', { successful: false }, token, id)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function updatePitchVisibility(id, visibility) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: UPDATE_PITCH_VISIBILITY,
      payload: {
        promise: new apiPromiseWrapper(new PitchesApi(), 'pitchesIDVisibilityPatch', { visibility: visibility }, token, id)
      }
    });

    dispatch(action);
    return action.payload.promise;
  }
}

export function getPitches() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const filters = getState().filters;
    const sort = getState().sort;
    const { sortDirection, sortAttribute, page } = sort;

    const apiFilters = convertReduxFiltersToApiFormat(filters);

    const body = {
      sortAttribute,
      sortDirection,
      page,
      filters: apiFilters
    };

    const action = createAsyncAction({
      type: GET_PITCHES,
      payload: {
        promise: new Promise((resolve, reject) => {
          new paginatedApiWrapper(new PitchesApi(), 'pitchesSearchPost', body, token)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err);
            });
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function patchPitch(pitch) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const pitchId = pitch.id;
    const data = PitchUpdate.constructFromObject(pitch);

    // remove media fields
    delete data.avatar;
    delete data.cover_photo;
    if (data.video !== null && isNaN(data.video)) {
      delete data.video;
    }

    const action = createAsyncAction({
      type: PATCH_PITCH,
      payload: {
        promise: new apiPromiseWrapper(new PitchesApi(), 'pitchesIDPatch', data, token, pitchId)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function createPitchContacts(teamMembers, pitchId) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    teamMembers.forEach(tm => {
      tm.pitch_id = pitchId;
      promises.push(new apiPromiseWrapper(new PitchContactsApi(), 'pitchContactsPost', tm, token))
    });

    const action = createAsyncAction({
      type: CREATE_PITCH_CONTACTS,
      payload: {
        promise: Promise.all(promises)

      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function deletePitchContact(contactId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: DELETE_PITCH_CONTACT,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new PitchContactsApi(), 'pitchContactsIDDelete', null, token, contactId)
          .then(resp => {
            resolve(resp);
          }).catch(err => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  }
}

export function clearGetOrganisationPitches() {
  return {
    type: GET_ORGANISATION_PITCHES + '_clear'
  };
};

export function clearGetPitchVersions() {
  return {
    type: GET_PITCH_VERSIONS + '_clear'
  };
};

export function clearGetPitchesInspect() {
  return {
    type: GET_INSPECT_PITCHES + '_clear'
  };
};

export function clearCreatePitch() {
  return {
    type: CREATE_PITCH + '_clear'
  };
};

export function clearPitchVersions() {
  return {
    type: GET_PITCH_VERSIONS + '_clear'
  }
};

export function clearPitchVersion() {
  return {
    type: GET_PITCH_VERSION + '_clear'
  };
};

export function clearArchivePitch() {
  return {
    type: ARCHIVE_PITCH + '_clear'
  }
};

export function clearCreatePitchContacts() {
  return {
    type: CREATE_PITCH_CONTACTS + '_clear'
  }
};

export function clearPatchPitch() {
  return {
    type: PATCH_PITCH + '_clear'
  }
};

export function clearDeletePitchContact() {
  return {
    type: DELETE_PITCH_CONTACT + '_clear'
  }
};

export function clearGetPitches() {
  return {
    type: GET_PITCHES + '_clear'
  }
};

export function clearGetPitch() {
  return {
    type: GET_PITCH + '_clear'
  }
};

export function clearPitchContacts() {
  return {
    type: GET_PITCH_CONTACTS + '_clear'
  }
};

export function clearUploadPitchVideo() {
  return {
    type: UPLOAD_PITCH_VIDEO + '_clear'
  }
};

export function clearUploadPitchCoverPhoto() {
  return {
    type: UPLOAD_PITCH_COVER + '_clear'
  }
};

export function clearUpdatePitchVisibility() {
  return {
    type: UPDATE_PITCH_VISIBILITY + '_clear'
  }
};
