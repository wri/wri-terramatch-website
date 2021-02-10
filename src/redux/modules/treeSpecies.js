import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';
import {
  TreeSpeciesApi,
  TreeSpeciesUpdate
} from 'wrm-api';

export const CREATE_TREE_SPECIES = 'species/CREATE_TREE_SPECIES';
export const GET_TREE_SPECIES = 'species/GET_TREE_SPECIES';
export const GET_TREE_SPECIES_INSPECT = 'species/GET_TREE_SPECIES_INSPECT';
export const PATCH_TREE_SPECIES = 'species/PATCH_TREE_SPECIES'
export const DELETE_TREE_SPECIES = 'species/DELETE_TREE_SPECIES';

export function createTreeSpecies(treeArray, pitchId) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    treeArray.forEach(specie => {
      specie.pitch_id = pitchId;
      promises.push(new apiPromiseWrapper(new TreeSpeciesApi(), 'treeSpeciesPost', specie, token))
    });

    const action = createAsyncAction({
      type: CREATE_TREE_SPECIES,
      payload: {
        promise: Promise.all(promises)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getTreeSpecies(pitchId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_TREE_SPECIES,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          try {
            const species = await new apiPromiseWrapper(new TreeSpeciesApi(),
              'pitchesIDTreeSpeciesGet', null, token, pitchId);
            resolve(species);
          } catch(err) {
            reject(err);
          }
        })
      }
    });
    dispatch(action);
    return action.payload.promise;
  }
};

export function getTreeSpeciesInspect(pitchId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_TREE_SPECIES_INSPECT,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          try {
            const species = await new apiPromiseWrapper(new TreeSpeciesApi(),
              'pitchesIDTreeSpeciesInspectGet', null, token, pitchId);
            resolve(species);
          } catch(err) {
            reject(err);
          }
        })
      }
    });
    dispatch(action);
    return action.payload.promise;
  }
}

export function patchTreeSpecies(treeArray) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    treeArray.forEach(specie => {
      const treeId = specie.id;
      const data = TreeSpeciesUpdate.constructFromObject(specie);
      
      promises.push(new apiPromiseWrapper(new TreeSpeciesApi(),
        'treeSpeciesIDPatch', data, token, treeId))
    });

    const action = createAsyncAction({
      type: PATCH_TREE_SPECIES,
      payload: {
        promise: Promise.all(promises)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
}

export function deleteTreeSpecies(treeId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: DELETE_TREE_SPECIES,
      payload: {
        promise: new apiPromiseWrapper(new TreeSpeciesApi(), 
          'treeSpeciesIDDelete', null, token, treeId)
      }
    });

    dispatch(action);

    return action.payload.promise;
  }
}

export function clearCreateTreeSpecies() {
  return {
    type: CREATE_TREE_SPECIES + '_clear'
  };
}

export function clearPatchTreeSpecies() {
  return {
    type: PATCH_TREE_SPECIES + '_clear'
  };
};

export function clearGetTreeSpecies() {
  return {
    type: GET_TREE_SPECIES + '_clear'
  };
};

export function clearGetTreeSpeciesInspect() {
  return {
    type: GET_TREE_SPECIES_INSPECT + '_clear'
  };
};

export function clearDeleteTreeSpecies() {
  return {
    type: DELETE_TREE_SPECIES + '_clear'
  };
};