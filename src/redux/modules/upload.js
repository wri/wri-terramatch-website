import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';
import {
  UploadsApi,
  UploadCreate
} from 'wrm-api';

// Actions
export const UPLOAD = 'upload/UPLOAD';

export function upload(attributes) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: UPLOAD,
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



export function clearUpload() {
  return {
    type: UPLOAD + '_clear'
  };
}
