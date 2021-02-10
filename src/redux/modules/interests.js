import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';

import {
  InterestsApi,
  OffersApi,
  PitchesApi
} from 'wrm-api';

export const CREATE_INTEREST = 'interests/CREATE_INTEREST';
export const GET_RECIEVED_INTERESTS = 'interests/GET_RECIEVED_INTERESTS';
export const GET_INITIATED_INTERESTS = 'interests/GET_INITIATED_INTERESTS';
// Action Creators
export function createInterest(model) {
  return (dispatch, getState) => {

    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: CREATE_INTEREST,
      payload: {
        promise: new apiPromiseWrapper(new InterestsApi(), 'interestsPost', model, token)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

// Action Creators
export function getRecievedInterests() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: GET_RECIEVED_INTERESTS,
      payload: {
        promise: new Promise((resolve, reject) =>
        // Get matches
          new apiPromiseWrapper(new InterestsApi(), 'interestsReceivedGet', null, token)
          .then(async (response) => {
            // Then for each match, get the offer and pitch
            resolve(await getAllInterestsData(response, token));
          }).catch(reject)
        )
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

// Action Creators
export function getInitiatedInterests() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: GET_INITIATED_INTERESTS,
      payload: {
        promise: new Promise((resolve, reject) =>
        // Get matches
          new apiPromiseWrapper(new InterestsApi(), 'interestsInitiatedGet', null, token)
          .then(async (response) => {
            // Then for each match, get the offer and pitch
            resolve(await getAllInterestsData(response, token));
          }).catch(reject)
        )
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export const getAllInterestsData = (interests, token) => {
  return Promise.all(interests.map(async (match) => {
    const data = await getInterestsData(match, token);
    return {
      ...match,
      ...data
    };
  }));
};

const getInterestsData = async (interest, token) => {
  // Get offer
  const offer = await new apiPromiseWrapper(new OffersApi(), 'offersIDGet', null, token, interest.offer_id);

  // Get pitch
  const pitch = await new apiPromiseWrapper(new PitchesApi(), 'pitchesIDGet', null, token, interest.pitch_id);

  return { offer, pitch };
};

export function clearCreateInterest() {
  return {
    type: CREATE_INTEREST + '_clear'
  };
};

export function clearGetRecievedInterests() {
  return {
    type: GET_RECIEVED_INTERESTS + '_clear'
  };
};

export function clearGetInitiatedInterests() {
  return {
    type: GET_INITIATED_INTERESTS + '_clear'
  };
};
