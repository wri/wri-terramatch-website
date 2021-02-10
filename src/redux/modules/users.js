import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper'
import { UsersApi, UserInvite, UserUpdate } from 'wrm-api';
import { setSearchQuery } from './app';
// Actions
export const CREATE_USER = 'auth/CREATE_USER';
export const INVITE_USER = 'auth/INVITE_USER';
export const GET_ME = 'auth/ME';
export const ACCEPT_USER_INVITE = 'auth/ACCEPT_USER_INVITE';
export const PATCH_USER = "auth/PATCH_USER";

// Action Creators
export function createUser(model) {
  return (dispatch, getState) => {
    delete model.agree_terms;
    delete model.agree_consent;

    const action = createAsyncAction({
      type: CREATE_USER,
      payload: {
        promise: new apiPromiseWrapper(new UsersApi(), 'usersPost', {
          ...model,
          facebook: null,
          instagram: null,
          twitter: null,
          linkedin: null
        })
      }
    });

    dispatch(action);
    dispatch(setSearchQuery(''));

    return action.payload.promise;
  };
};

export function patchUser(user, id, uploadState) {
  return (dispatch, getState) => {
    const body = UserUpdate.constructFromObject(user);
    const token = getState().auth.login.data.token;

    if (uploadState.data && (uploadState.data.id !== undefined || uploadState.data.id !== null)) {
      body.avatar = uploadState.data.id;
    } else {
      delete body.avatar;
    }

    const action = createAsyncAction({
      type: PATCH_USER,
      payload: {
        promise: new apiPromiseWrapper(new UsersApi(), 'usersIDPatch', body, token, id)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function acceptUserInvite(model) {
  return (dispatch, getState) => {
    delete model.agree_terms;
    delete model.agree_consent;

    const action = createAsyncAction({
      type: ACCEPT_USER_INVITE,
      payload: {
        promise: new apiPromiseWrapper(new UsersApi(), 'usersAcceptPost', {
          ...model,
          facebook: null,
          instagram: null,
          twitter: null,
          linkedin: null
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

// Action Creators
export function inviteUser(model) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: INVITE_USER,
      payload: {
        promise: new Promise((resolve, reject) => {
          // Temp fix until BED is up-to-date
          delete model.thumbnail;

          new apiPromiseWrapper(new UsersApi(), 'usersInvitePost', model, token)
          .then(data => {
            resolve(UserInvite.constructFromObject(data));
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

export function clearCreateUser() {
  return {
    type: CREATE_USER + '_clear'
  };
}

export function clearPatchUser() {
  return {
    type: PATCH_USER + '_clear'
  };
}

export function clearInviteUser() {
  return {
    type: INVITE_USER + '_clear'
  };
}

export function clearAcceptUserInvite() {
  return {
    type: ACCEPT_USER_INVITE + '_clear'
  };
}
