import { AdminsApi,
         AdminReadAll,
         TasksApi,
         OrganisationReadAll,
         PitchVersionReadAll,
         OrganisationVersionsApi,
         OrganisationDocumentVersionsApi,
         PitchVersionsApi,
         TreeSpeciesVersionsApi,
         RestorationMethodMetricVersionsApi,
         CarbonCertificationVersionsApi,
         PitchDocumentVersionsApi
       } from 'wrm-api';
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';
import { createAsyncAction } from "../conditionalActions";
import { getAllMatchesData } from './matches';

export const GET_ADMINS = 'admins/GET_ADMINS';
export const INVITE_ADMIN = 'admins/INVITE_ADMIN';
export const ACCEPT_ADMIN_INVITE = 'admins/ACCEPT_ADMIN_INVITE';
export const GET_ORGANISATION_TASKS = 'admins/GET_ORGANISATION_TASKS';
export const GET_PITCH_TASKS = 'admins/GET_PITCH_TASKS';
export const GET_MATCH_TASKS = 'admins/GET_MATCH_TASKS';
export const APPROVE_ORGANISATION_TASKS = 'admins/APPROVE_ORGANISATION_TASKS';
export const REJECT_ORGANISATION_TASKS = 'admins/REJECT_ORGANISATION_TASKS';
export const APPROVE_PITCH_TASKS = 'admins/APPROVE_ORGANISATION_TASKS';
export const REJECT_PITCH_TASKS = 'admins/REJECT_ORGANISATION_TASKS';

// Action Creators
export function getAdmins() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ADMINS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new AdminsApi(), 'adminsGet', null, token).then(
            (resp) => {
              resolve(AdminReadAll.constructFromObject(resp, []));
            }
          ).catch(reject)
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

// Action Creators
export function inviteAdmin(email) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: INVITE_ADMIN,
      payload: {
        promise: new apiPromiseWrapper(new AdminsApi(), 'adminsInvitePost',
          {
            email_address: email
          },
        token).then((resp) => {
          dispatch(getAdmins());
          return resp;
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

// Action Creators
export function acceptAdminInvite(model) {
  return (dispatch, getState) => {
    delete model.agree_terms;
    delete model.agree_consent;

    const action = createAsyncAction({
      type: ACCEPT_ADMIN_INVITE,
      payload: {
        promise: new apiPromiseWrapper(new AdminsApi(), 'adminsAcceptPost', model)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getOrganisationTasks() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATION_TASKS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new TasksApi(), 'tasksOrganisationsGet', null, token).then(
            (resp) => {
              resolve(OrganisationReadAll.constructFromObject(resp, []));
            }
          ).catch(reject)
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getPitchTasks() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_PITCH_TASKS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new TasksApi(), 'tasksPitchesGet', null, token).then(
            (resp) => {
              resolve(PitchVersionReadAll.constructFromObject(resp, []));
            }
          ).catch(reject)
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getMatchTasks() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_MATCH_TASKS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new TasksApi(), 'tasksMatchesGet', null, token).then(
            async (resp) => {
              resolve(await getAllMatchesData(resp, token));
            }
          ).catch(reject)
        })
      }
    });
    dispatch(action);
    return action.payload.promise;
  };
};

export function approveOrganisationTasks(approvals) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: APPROVE_ORGANISATION_TASKS,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          // For each thing in the approvals, go through and approve them.
          try {
            if (approvals.organisation) {
              await new apiPromiseWrapper(new OrganisationVersionsApi(), 'organisationVersionsIDApprovePatch', null, token, approvals.organisation.id);
            }
            if (approvals.documents) {
              // For each document, approve.
              await approvals.documents.forEach(async (item) => {
                await new apiPromiseWrapper(
                  new OrganisationDocumentVersionsApi(),
                  item.status === 'pending' ? 'organisationDocumentVersionsIDApprovePatch' : 'organisationDocumentVersionsIDRevivePatch',
                  null,
                  token,
                  item.id
                );
              });
            }

            resolve();
          } catch (err) {
            reject(err);
          }
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
}

export function rejectOrganisationTasks(rejections) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: REJECT_ORGANISATION_TASKS,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          // For each thing in the rejections, go through and approve them.
          const rejectionBody = {
            rejected_reason: rejections.rejection.reason,
            rejected_reason_body: rejections.rejection.reasonBody
          };

          try {
            if (rejections.organisation) {
              await new apiPromiseWrapper(new OrganisationVersionsApi(), 'organisationVersionsIDRejectPatch', rejectionBody, token, rejections.organisation.id);
            }
            if (rejections.documents) {
              // For each document, approve.
              await rejections.documents.forEach(async (item) => {
                await new apiPromiseWrapper(new OrganisationDocumentVersionsApi(), 'organisationDocumentVersionsIDRejectPatch', rejectionBody, token, item.id);
              })
            }

            resolve();
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

export function approvePitchTasks(approvals) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: APPROVE_PITCH_TASKS,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          // For each thing in the approvals, go through and approve them.
          try {
            if (approvals.pitch) {
              await new apiPromiseWrapper(new PitchVersionsApi(), 'pitchVersionsIDApprovePatch', null, token, approvals.pitch.id);
            }

            // For each treeSpecies.
            await approvals.treeSpecies.forEach(async (item) => {
              await new apiPromiseWrapper(
                new TreeSpeciesVersionsApi(),
                item.status === 'pending' ? 'treeSpeciesVersionsIDApprovePatch' : 'treeSpeciesVersionsIDRevivePatch',
                null,
                token,
                item.id
              );
            });

            // restoration methods
            await approvals.restorationMethods.forEach(async (item) => {
              await new apiPromiseWrapper(
                new RestorationMethodMetricVersionsApi(),
                item.status === 'pending' ? 'restorationMethodMetricVersionsIDApprovePatch' : 'restorationMethodMetricVersionsIDRevivePatch',
                null,
                token,
                item.id
              );
            });

            // carbon certs
            await approvals.carbonCerts.forEach(async (item) => {
              await new apiPromiseWrapper(
                new CarbonCertificationVersionsApi(),
                item.status === 'pending' ? 'carbonCertificationVersionsIDApprovePatch' : 'carbonCertificationVersionsIDRevivePatch',
                null,
                token,
                item.id
              );
            });

            // For each document, approve.
            await approvals.documents.forEach(async (item) => {
              await new apiPromiseWrapper(
                new PitchDocumentVersionsApi(),
                item.status === 'pending' ? 'pitchDocumentVersionsIDApprovePatch' : 'pitchDocumentVersionsIDRevivePatch',
                null,
                token,
                item.id
              );
            });

            resolve();
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

export function rejectPitchTasks(rejections) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: REJECT_PITCH_TASKS,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          // For each thing in the rejections, go through and approve them.
          const rejectionBody = {
            rejected_reason: rejections.rejection.reason,
            rejected_reason_body: rejections.rejection.reasonBody
          };

          try {
            if (rejections.pitch) {
              await new apiPromiseWrapper(new PitchVersionsApi(), 'pitchVersionsIDRejectPatch', rejectionBody, token, rejections.pitch.id);
            }

            // For each treeSpecies.
            await rejections.treeSpecies.forEach(async (item) => {
              await new apiPromiseWrapper(new TreeSpeciesVersionsApi(), 'treeSpeciesVersionsIDRejectPatch', rejectionBody, token, item.id);
            })

            // restoration methods
            await rejections.restorationMethods.forEach(async (item) => {
              await new apiPromiseWrapper(new RestorationMethodMetricVersionsApi(), 'restorationMethodMetricVersionsIDRejectPatch', rejectionBody, token, item.id);
            })

            // carbon certs
            await rejections.carbonCerts.forEach(async (item) => {
              await new apiPromiseWrapper(new CarbonCertificationVersionsApi(), 'carbonCertificationVersionsIDRejectPatch', rejectionBody, token, item.id);
            })

            // For each document, approve.
            await rejections.documents.forEach(async (item) => {
              await new apiPromiseWrapper(new PitchDocumentVersionsApi(), 'pitchDocumentVersionsIDRejectPatch', rejectionBody, token, item.id);
            })

            resolve();
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

export function clearAcceptAdminInvite() {
  return {
    type: ACCEPT_ADMIN_INVITE + '_clear'
  };
};

export function clearGetOrganisationTasks() {
  return {
    type: GET_ORGANISATION_TASKS + '_clear'
  };
}

export function clearGetPitchTasks() {
  return {
    type: GET_PITCH_TASKS + '_clear'
  };
}

export function clearApproveOrganisationTasks() {
  return {
    type: APPROVE_ORGANISATION_TASKS + '_clear'
  };
};

export function clearRejectOrganisationTasks() {
  return {
    type: REJECT_ORGANISATION_TASKS + '_clear'
  };
};

export function clearApprovePitchTasks() {
  return {
    type: APPROVE_ORGANISATION_TASKS + '_clear'
  };
};

export function clearRejectPitchTasks() {
  return {
    type: REJECT_PITCH_TASKS + '_clear'
  };
};

export function clearGetAdmins() {
  return {
    type: GET_ADMINS + '_clear'
  };
};
