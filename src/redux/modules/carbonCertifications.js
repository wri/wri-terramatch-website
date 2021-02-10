import { createAsyncAction } from '../conditionalActions';
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';
import {
  CarbonCertificationsApi,
  CarbonCertificationUpdate
} from 'wrm-api';

export const GET_CARBON_CERTIFICATIONS = 'carbon/GET_CARBON_CERTIFICATIONS';
export const GET_CARBON_CERTIFICATIONS_INSPECT  = 'carbon/GET_CARBON_CERTIFICATIONS_INSPECT';
export const CREATE_CARBON_CERTIFICATES = 'carbon/CREATE_CARBON_CERTIFICATES';
export const PATCH_CARBON_CERTIFICATES = 'carbon/PATCH_CARBON_CERTIFICATES';
export const DELETE_CARBON_CERTIFICATE = 'carbon/DELETE_CARBON_CERTIFICATE';

export function getCarbonCertifications(pitchId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_CARBON_CERTIFICATIONS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(
            new CarbonCertificationsApi(),
            'pitchesIDCarbonCertificationsGet',
            null,
            token,
            pitchId
          ).then(resp => {
              resolve(resp);
          }).catch(reject);
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getCarbonCertificationsInspect(pitchId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_CARBON_CERTIFICATIONS_INSPECT,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(
            new CarbonCertificationsApi(),
            'pitchesIDCarbonCertificationsInspectGet',
            null,
            token,
            pitchId
          ).then(resp => {
              resolve(resp);
          }).catch(reject);
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function createCarbonCertificates(carbonArray, pitchId) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    carbonArray.forEach(cert => {
      // If no cert type it means it's been cleared from the select. Do not create.
      if (cert.type) {
        cert.pitch_id = pitchId;
        promises.push(new apiPromiseWrapper(new CarbonCertificationsApi(), 'carbonCertificationsPost', cert, token));
      }
    });

    const action = createAsyncAction({
      type: CREATE_CARBON_CERTIFICATES,
      payload: {
        promise: Promise.all(promises)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function patchCarbonCertificates(carbonArray) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    carbonArray.forEach(cert => {
      const certId = cert.id;
      const data = CarbonCertificationUpdate.constructFromObject(cert);

      promises.push(new apiPromiseWrapper(new CarbonCertificationsApi(),
        'carbonCertificationsIDPatch', data, token, certId));
    });

    const action = createAsyncAction({
      type: PATCH_CARBON_CERTIFICATES,
      payload: {
        promise: Promise.all(promises)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
}

export function deleteCarbonCertificate(certificateId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: DELETE_CARBON_CERTIFICATE,
      payload: {
        promise: new apiPromiseWrapper(new CarbonCertificationsApi(), 'carbonCertificationsIDDelete', null, token, certificateId)
      }
    });

    dispatch(action);

    return action.payload.promise;
  }
}

export function clearCreateCarbonCertificates() {
  return {
    type: CREATE_CARBON_CERTIFICATES + '_clear'
  };
};

export function clearPatchCarbonCertificates() {
  return {
    type: PATCH_CARBON_CERTIFICATES + '_clear'
  }
};

export function clearGetCarbonCertifications() {
  return {
    type: GET_CARBON_CERTIFICATIONS + '_clear'
  };
};

export function clearGetCarbonCertificationsInspect() {
  return {
    type: GET_CARBON_CERTIFICATIONS_INSPECT + '_clear'
  };
};

export function clearDeleteCarbonCertificate() {
  return {
    type: DELETE_CARBON_CERTIFICATE + '_clear'
  };
};
