import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';
import {
  OrganisationDocumentsApi,
  OrganisationDocumentVersionReadAll,
  PitchDocumentsApi
} from 'wrm-api';

export const CREATE_ORGANISATION_DOCUMENTS_AWARDS = 'documentAwards/CREATE_ORGANISATION_DOCUMENTS_AWARDS';
export const GET_ORGANISATION_DOCUMENTS = 'documentAwards/GET_DOCUMENT_AWARDS';
export const GET_INSPECT_DOCUMENTS = 'documentAwards/GET_INSPECT_DOCUMENTS';
export const REMOVE_ORGANISATION_DOCUMENT = 'documentAwards/REMOVE_ORGANISATION_DOCUMENT';

export const CREATE_PITCH_DOCUMENTS= 'documentAwards/CREATE_PITCH_DOCUMENTS';
export const GET_PITCH_DOCUMENTS = 'documentAwards/GET_PITCH_DOCUMENTS';
export const GET_INSPECT_PITCH_DOCUMENTS = 'documentAwards/GET_INSPECT_PITCH_DOCUMENTS';
export const REMOVE_PITCH_DOCUMENT = 'documentAwards/REMOVE_PITCH_DOCUMENT';

export function createDocumentAwards(docAwards) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    docAwards.forEach(doc => {
      promises.push(new apiPromiseWrapper(new OrganisationDocumentsApi(), 'organisationDocumentsPost', doc, token));
    });

    const action = createAsyncAction({
      type: CREATE_ORGANISATION_DOCUMENTS_AWARDS,
      payload: {
        promise: Promise.all(promises)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getOrganisationDocuments(organisationId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATION_DOCUMENTS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OrganisationDocumentsApi(), 'organisationsIDOrganisationDocumentsGet', null, token, organisationId).then(
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

export function removeOrganisationDocument(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: REMOVE_ORGANISATION_DOCUMENT,
      payload: {
        promise: new apiPromiseWrapper(new OrganisationDocumentsApi(), 'organisationDocumentsIDDelete', null, token, id)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getDocumentsInspect(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_INSPECT_DOCUMENTS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OrganisationDocumentsApi(), 'organisationsIDOrganisationDocumentsInspectGet', null, token, id).then(
          (resp) => {
            resolve(OrganisationDocumentVersionReadAll.constructFromObject(resp, []));
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

export function createPitchDocuments(docs, pitchId) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    docs.forEach(doc => {
      const model = {
        pitch_id: pitchId,
        name: doc.name,
        type: "legal",
        document: doc.id
      };
      promises.push(new apiPromiseWrapper(new PitchDocumentsApi(), 'pitchDocumentsPost', model, token));
    });

    const action = createAsyncAction({
      type: CREATE_PITCH_DOCUMENTS,
      payload: {
        promise: Promise.all(promises)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getPitchDocuments(pitchId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_PITCH_DOCUMENTS,
      payload: {
        promise: new apiPromiseWrapper(new PitchDocumentsApi(), 'pitchesIDPitchDocumentsGet', null, token, pitchId)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getPitchDocumentsInspect(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_INSPECT_PITCH_DOCUMENTS,
      payload: {
        promise: new apiPromiseWrapper(new PitchDocumentsApi(), 'pitchesIDPitchDocumentsInspectGet', null, token, id)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function removePitchDocument(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: REMOVE_PITCH_DOCUMENT,
      payload: {
        promise: new apiPromiseWrapper(new PitchDocumentsApi(), 'pitchDocumentsIDDelete', null, token, id)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function clearCreateDocumentAwards() {
  return {
    type: CREATE_ORGANISATION_DOCUMENTS_AWARDS + '_clear'
  };
};

export function clearGetDocuments() {
  return {
    type: GET_ORGANISATION_DOCUMENTS + '_clear'
  };
};

export function clearRemoveOrganisationDocument() {
  return {
    type: REMOVE_ORGANISATION_DOCUMENT + '_clear'
  };
};

export function clearInspectDocuments() {
  return {
    type: GET_INSPECT_DOCUMENTS + '_clear'
  };
}

export function clearCreatePitchDocuments() {
  return {
    type: CREATE_PITCH_DOCUMENTS + '_clear'
  };
};

export function clearGetPitchDocuments() {
  return {
    type: GET_PITCH_DOCUMENTS + '_clear'
  };
};

export function clearInspectPitchDocuments() {
  return {
    type: GET_INSPECT_PITCH_DOCUMENTS + '_clear'
  };
}

export function clearRemovePitchDocument() {
  return {
    type: REMOVE_PITCH_DOCUMENT + '_clear'
  };
}