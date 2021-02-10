import { createAsyncAction } from '../conditionalActions';
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';

import {
    CompatibilityScoresApi
} from 'wrm-api';

export const GET_COMPATIBILITY_SCORE = 'compatibilityScores/GET_COMPATIBILITY_SCORE';

export function getCompatibilityScore(offerId, pitchId, initiator) {
    return (dispatch, getState) => {
        const token = getState().auth.login.data.token;

        const model = {
            offer_id: offerId,
            pitch_id: pitchId,
            initiator
        };

        const action = createAsyncAction({
            type: GET_COMPATIBILITY_SCORE,
            payload: {
                promise: new Promise((resolve, reject) =>
                new apiPromiseWrapper(new CompatibilityScoresApi(), 'compatibilityScoresPost', model , token)
                .then((resp) => {
                    resolve(resp);
                }).catch(reject))
            }
        });

        dispatch(action);
        return action.payload.promise;
    };
};

export function clearGetCompatibilityScore() {
    return {
        type: GET_COMPATIBILITY_SCORE + '_clear'
    };
}
