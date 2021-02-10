/**
 * Convenience method which simply attaches a request ID and the current timestamp to any actions it creates.
 *
 * The requestId is used to identify a particular sequence of actions as belonging to a particular async lifecycle.
 *
 * These timestamps are in turn used by the async action reducer and {@code shouldPerformAsyncAction}.
 *
 * @param {Object} fsa - Should be a Flux Standard Action with a promise property in its payload
 * @param {string} fsa.type - The type of action to be performed
 * @param {Object} fsa.payload - The payload of the fsa, should contain a promise property
 * @param {Promise} fsa.payload.promise - The promise to be excecuted when this action is dispatched
 * @param {Object} [fsa.meta] - Any meta to go along with the action to be performed
 * @returns
 *  The same action it was passed with a timestamp attached.
 */
export function createAsyncAction(fsa) {
  const timestamp = Date.now();
  return {
    ...fsa,
    meta: {
      ...fsa.meta,
      requestId: timestamp,
      timestamp: timestamp
    }
  };
}

/**
 * A default condition for actions handled by {@code asyncActionReducer}. In particular, it ensures an async action is
 * not dispatched whilst still awaiting a response from a previous instance of the action.
 *
 * @param {Object} state - The current state that the action corresponds to to be checked as to whether the action should be performed
 * @param {number} [fetchTimeout=30000] - The time in milliseconds to wait before considering a dispatch of an action as 'timed out'
 * @param {number} [staleDataTimeout=86400000] - The time in milliseconds to keep around stale data before considering refreshing it
 * @returns {boolean}
 */
export function shouldPerformAsyncAction(state, fetchTimeout = 30000, staleDataTimeout = 86400000) {
  if (!state) {
    // State should always be defined already, but if not then do a fetch to initialise it
    return true;
  }

  // Determine whether the last fetch request occurred in the last 30 seconds.
  const now = Date.now();

  const didFetchRecently = now - state.lastFetchTime < fetchTimeout;

  if (state.isFetching && didFetchRecently) {
    // If we are fetching and that fetch occurred recently, then don't fetch again (wait for the old fetch to finish)
    return false;
  } else if (state.consecutiveFailureCount >= 3 && didFetchRecently) {
    // If we have recently failed 3 times or more consecutively, then suppress fetching (to avoid infinite spinning
    // when dealing with broken API endpoints).
    return false;
  } else if (!state.data) {
    // If we don't have data then always fetch
    return true;
  } else if (now - state.lastSuccessTime > staleDataTimeout) {
    // If the data is stale then always fetch
    return true;
  }

  // Otherwise, only fetch if the data we have has been invalidated
  return state.isInvalidated;
}
