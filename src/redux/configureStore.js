import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { createPromise } from 'redux-promise-middleware';
import reduxConstants from './reduxConstants';
import reducer from './combineReducers';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

export const ACTION_TYPE_CLEAR_TRANSIENT_STATE = 'init/clear_transient_state';

const promiseMiddleware = createPromise({
  promiseTypeSuffixes: [reduxConstants.PENDING_SUFFIX, reduxConstants.SUCCESS_SUFFIX, reduxConstants.FAILURE_SUFFIX]
});

const middleware = [thunk, promiseMiddleware];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore); // apply logger to redux

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
}

const configureStore = (initialState) => {
  const persistedReducer = persistReducer(persistConfig, reducer)
  const store = createStoreWithMiddleware(persistedReducer, initialState)
  return {
    store,
    persistor: persistStore(store)
  }
};
export default configureStore;
