import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';

import {
  MatchesApi,
  PitchesApi,
  OffersApi,
  InterestsApi
} from 'wrm-api';

export const GET_MATCHES = 'matches/GET_MATCHES';
export const UNMATCH = 'matches/UNMATCH';

// Action Creators
export function getMatches() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: GET_MATCHES,
      payload: {
        promise: new Promise((resolve, reject) =>
        // Get matches
          new apiPromiseWrapper(new MatchesApi(), 'matchesGet', null, token)
          .then(async (response) => {
            // Then for each match, get the offer and pitch
            resolve(await getAllMatchesData(response, token));
          }).catch(reject)
        )
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};


export function unmatchConnection(interestId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: UNMATCH,
      payload: {
        promise: new apiPromiseWrapper(new InterestsApi(), 'interestsIDDelete', null, token, interestId)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export const getAllMatchesData = (matches, token) => {
  return Promise.all(matches.map(async (match) => {
    const data = await getMatchData(match, token);
    return {
      ...match,
      ...data
    };
  }));
};

const getMatchData = async (match, token) => {
  // Get offer
  const offer = await new apiPromiseWrapper(new OffersApi(), 'offersIDGet', null, token, match.offer_id);

  // Get pitch
  const pitch = await new apiPromiseWrapper(new PitchesApi(), 'pitchesIDGet', null, token, match.pitch_id);

  return { offer, pitch };
};

export function clearGetMatches() {
  return {
    type: GET_MATCHES + '_clear'
  };
};

export function clearUnmatch() {
  return {
    type: UNMATCH + '_clear'
  };
}