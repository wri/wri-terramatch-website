import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper'
import jwtDecode from 'jwt-decode';
import { AuthApi } from 'wrm-api';
import { getNotifications } from './notifications';

// Actions
export const LOGIN = 'auth/LOGIN';
export const LOGOUT = 'auth/LOGOUT';
export const REQUEST_PASSWORD_RESET = 'auth/REQUEST_PASSWORD_RESET';
export const CHANGE_PASSWORD = 'auth/CHANGE_PASSWORD';
export const VERIFY = 'auth/VERIFY';
const SET_JWT = 'auth/SET_JWT';
export const GET_ME = 'auth/GET_ME';

// Reducer
export default function reducer(state = null, action = {}) {
  switch (action.type) {
    case SET_JWT:
      return action.payload
    default: return state;
  }
}

// Action Creators
export function login(model) {
  return (dispatch, getState) => {
    const action = createAsyncAction({
      type: LOGIN,
      payload: {
        promise: new apiPromiseWrapper(new AuthApi(), 'authLoginPost', model).then(
          (resp) => {
            const decoded = jwtDecode(resp.token);

            dispatch({
              type: SET_JWT,
              payload: decoded
            });

            return resp;
          }
        )
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function requestPasswordReset(model) {
  return (dispatch) => {
    const action = createAsyncAction({
      type: REQUEST_PASSWORD_RESET,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new AuthApi(), 'authResetPost', model).then(
            (resp) => {
              resolve(resp);
            }
          ).catch(reject);
        })
      }
    });
    dispatch(action);
    return action.payload.promise;
  }
}

export function changePassword(model) {
  return (dispatch) => {
    const action = createAsyncAction({
      type: CHANGE_PASSWORD,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new AuthApi(), 'authChangePatch', model).then(
            (resp) => {
              resolve(resp);
            }
          ).catch(reject);
        })
      }
    });
    dispatch(action);
    return action.payload.promise;
  }
}

export function logout() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: LOGOUT,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new AuthApi(), 'authLogoutGet', null, token).then(
            (resp) => {
              resolve(resp);
            }
          ).catch(reject);
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function clearAuth() {
  return (dispatch) => {
    dispatch({
      type: GET_ME + '_clear'
    });
    dispatch({
      type: LOGIN + '_clear'
    });
    dispatch({
      type: VERIFY + '_clear'
    });
    dispatch({
      type: SET_JWT,
      payload: null
    });
  }
}

export function getMe() {
  return (dispatch, getState) => {
    const state = getState();
    if (state.auth.login.data) {
      const token = getState().auth.login.data.token;
      const action = createAsyncAction({
        type: GET_ME,
        payload: {
          promise: new Promise((resolve, reject) => {
            new apiPromiseWrapper(new AuthApi(), 'authMeGet', null, token).then((data) => {
              dispatch(getNotifications());
              resolve(data);
            }).catch(reject);
          })
        }
      });

      dispatch(action);

      return action.payload.promise;
    }

    return false;
  };
};

export function verify(verifyToken) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: VERIFY,
      payload: {
        promise: new apiPromiseWrapper(new AuthApi(), 'authVerifyPatch', {token: verifyToken}, token).then(()  => {
          dispatch(getMe());
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function clearChangePassword() {
  return {
    type: CHANGE_PASSWORD + '_clear'
  };
}
