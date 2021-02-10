import { createAsyncAction } from '../conditionalActions';
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';

import {
    DraftsApi,
    DraftCreate,
    DraftUpdate
} from 'wrm-api';

export const CREATE_DRAFT = 'drafts/CREATE_DRAFT';
export const UPDATE_DRAFT = 'drafts/UPDATE_DRAFT';
export const GET_PITCH_DRAFTS = 'drafts/GET_PITCH_DRAFTS';
export const GET_OFFER_DRAFTS = 'drafts/GET_OFFER_DRAFTS';
export const DELETE_DRAFT = 'drafts/DELETE_DRAFT';
export const PUBLISH_DRAFT = 'drafts/PUBLISH_DRAFT'

export function createDraft(data) {
    return (dispatch, getState) => {
        const token = getState().auth.login.data.token;

        const model = DraftCreate.constructFromObject(data, {});

        const action = createAsyncAction({
            type: CREATE_DRAFT,
            payload: {
              promise:  new Promise(async (resolve, reject) => {
                try {
                  const draft = await new apiPromiseWrapper(new DraftsApi(), 'draftsPost', model , token)
                  resolve(draft);
                } catch (err) {
                  reject(err);
                }
              })
            }
        });

        dispatch(action);
        return action.payload.promise;
    };
};

export function updateDraft(id, data) {
    return (dispatch, getState) => {
        const token = getState().auth.login.data.token;

        const model = DraftUpdate.constructFromObject(data, []);

        const action = createAsyncAction({
            type: UPDATE_DRAFT,
            payload: {
              promise:  new apiPromiseWrapper(new DraftsApi(), 'draftsIDPatch', model, token, id)
            }
        });

        dispatch(action);
        return action.payload.promise;
    };
};

export function publishDraft(id, type) {
    return (dispatch, getState) => {
        const token = getState().auth.login.data.token;

        const action = createAsyncAction({
            type: PUBLISH_DRAFT,
            payload: {
              promise:  new apiPromiseWrapper(new DraftsApi(), 'draftsIDPublishPatch', null, token, id)
            }
        });

        dispatch(action);
        return action.payload.promise;
    };
};

export function deleteDraft(id) {
    return (dispatch, getState) => {
        const token = getState().auth.login.data.token;
        const action = createAsyncAction({
            type: DELETE_DRAFT,
            payload: {
              promise:  new apiPromiseWrapper(new DraftsApi(), 'draftsIDDelete', null, token, id)
            }
        });

        dispatch(action);
        return action.payload.promise;
    };
};

export function getDrafts(type) {
    const actionType = type === 'offer' ? GET_OFFER_DRAFTS : GET_PITCH_DRAFTS;
    const actionMethod = type === 'offer' ? 'draftsOffersGet' : 'draftsPitchesGet';

    return (dispatch, getState) => {
        const token = getState().auth.login.data.token;

        const action = createAsyncAction({
            type: actionType,
            payload: {
              promise:  new apiPromiseWrapper(new DraftsApi(), actionMethod, null, token)
            }
        });

        dispatch(action);
        return action.payload.promise;
    };
};

export function clearGetOfferDrafts() {
  return {
      type: GET_OFFER_DRAFTS + '_clear'
  };
};

export function clearGetPitchDrafts() {
  return {
      type: GET_PITCH_DRAFTS + '_clear'
  };
};

export function clearCreateDraft() {
    return {
        type: CREATE_DRAFT + '_clear'
    };
};

export function clearUpdateDraft() {
    return {
        type: UPDATE_DRAFT + '_clear'
    };
};

export function clearDeleteDraft() {
    return {
        type: DELETE_DRAFT + '_clear'
    };
};

export function clearPublishDraft() {
    return {
        type: PUBLISH_DRAFT + '_clear'
    };
};
