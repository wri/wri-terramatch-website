import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper'
import { TeamMemberRead, TeamMembersApi, UploadsApi, UploadCreate, UsersApi, TeamMemberUpdate } from 'wrm-api';

// Actions
export const CREATE_TEAM_MEMBER = 'teamMember/CREATE_TEAM_MEMBER';
export const PATCH_TEAM_MEMBER = 'teamMember/PATCH_TEAM_MEMBER';
export const REMOVE_TEAM_MEMBER = 'teamMember/REMOVE_TEAM_MEMBER';
export const UPLOAD_TEAM_MEMBER_AVATAR = 'teamMember/UPLOAD_TEAM_MEMBER_AVATAR';
export const UPLOAD_TEAM_MEMBER_COVER = 'teamMember/UPLOAD_TEAM_MEMBER_COVER';
export const GET_TEAM_MEMBERS = 'teamMember/GET_TEAM_MEMBERS';
export const GET_INSPECT_TEAM_MEMBERS = 'teamMember/GET_INSPECT_TEAM_MEMBERS';

// Action Creators
export function createTeamMember(model) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: CREATE_TEAM_MEMBER,
      payload: {
        promise: new Promise((resolve, reject) => {
          model.facebook = null;
          model.twitter = null;
          model.linkedin = null;
          model.instagram = null;

          // Temp fix until BED is up-to-date
          delete model.thumbnail;

          new apiPromiseWrapper(new TeamMembersApi(), 'teamMembersPost', model, token)
          .then(data => {
            resolve(TeamMemberRead.constructFromObject(data));
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

export function patchTeamMember(teamMember, id, uploadState) {
  return (dispatch, getState) => {
    const body = TeamMemberUpdate.constructFromObject(teamMember);
    const token = getState().auth.login.data.token;

    if (uploadState.data && (uploadState.data.id !== undefined || uploadState.data.id !== null)) {
      body.avatar = uploadState.data.id;
    } else {
      delete body.avatar;
    }

    const action = createAsyncAction({
      type: PATCH_TEAM_MEMBER,
      payload: {
        promise: new apiPromiseWrapper(new TeamMembersApi(), 'teamMembersIDPatch', body, token, id)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getTeamMembers(organisationId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_TEAM_MEMBERS,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          try {
            let users = await new apiPromiseWrapper(new UsersApi(), 'organisationsIDUsersGet', null, token, organisationId);
            users = users.map((user) => ({...user, type: 'user'}));
            resolve(users);
          } catch(err) {
            reject(err);
          }
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getInspectTeamMembers(organisationId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_INSPECT_TEAM_MEMBERS,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          try {
            let users = await new apiPromiseWrapper(new UsersApi(), 'organisationsIDUsersInspectGet', null, token, organisationId);
            users = users.map((user) => ({...user, type: 'user'}));
            resolve(users);
          } catch(err) {
            reject(err);
          }
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function removeTeamMember(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: REMOVE_TEAM_MEMBER,
      payload: {
        promise: new apiPromiseWrapper(new TeamMembersApi(), 'teamMembersIDDelete', null, token, id)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};


export function uploadTeamMemberAvatar(attributes) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: UPLOAD_TEAM_MEMBER_AVATAR,
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

export function clearCreateTeamMember() {
  return {
    type: CREATE_TEAM_MEMBER + '_clear'
  };
};

export function clearPatchTeamMember() {
  return {
    type: PATCH_TEAM_MEMBER + '_clear'
  };
};

export function clearRemoveTeamMember() {
  return {
    type: REMOVE_TEAM_MEMBER + '_clear'
  };
};

export function clearTeamMembers() {
  return {
    type: GET_TEAM_MEMBERS + '_clear'
  };
};

export function clearInspectTeamMembers() {
  return {
    type: GET_INSPECT_TEAM_MEMBERS + '_clear'
  };
};
