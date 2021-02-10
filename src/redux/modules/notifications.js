import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';
import {
  NotificationsApi,
  NotificationReadAll
} from 'wrm-api';

export const GET_NOTIFICATIONS = 'notifications/GET_NOTIFICATIONS';
export const PATCH_NOTIFICATION = 'notifications/PATCH_NOTIFICATION';

export function getNotifications() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_NOTIFICATIONS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new NotificationsApi(), 'notificationsGet', null, token).then(
          async (resp) => {
            resolve(NotificationReadAll.constructFromObject(resp, []));
          }).catch((err) => {
            reject(err);
          });
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function patchNotification(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: PATCH_NOTIFICATION,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new NotificationsApi(), 'notificationsIDMarkPatch', null, token, id).then(
          async (resp) => {
            dispatch(clearNotificationState());
            dispatch(getNotifications());
            resolve(resp);
          }).catch((err) => {
            reject(err);
          });
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function clearNotificationState() {
  return {
    type: GET_NOTIFICATIONS + '_clear'
  };
}
