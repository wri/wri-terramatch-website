import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';

import {
  UploadsApi,
  UploadCreate
} from 'wrm-api';

const getUploadAction = (type, attributes) => {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: type,
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

export { getUploadAction };
