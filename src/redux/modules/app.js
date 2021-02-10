// Actions
export const IS_LOGIN_MODAL = 'app/IS_LOGIN_MODAL';
export const SET_SEARCH_QUERY = 'app/SET_SEARCH_QUERY';
export const CLOSE_NOTIFICATION_BAR = 'app/CLOSE_NOTIFICATION_BAR';
export const SHOW_NOTIFICATION_BAR = 'app/SHOW_NOTIFICATION_BAR';

const initialState = {
  isLoginModal: false,
  loginRedirect: '/',
  searchQuery: '',
  notificationBar: {
    visible: false,
    message: '',
    title: '',
    params: null
  },
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case IS_LOGIN_MODAL:
    case SET_SEARCH_QUERY:
    case SHOW_NOTIFICATION_BAR:
    case CLOSE_NOTIFICATION_BAR:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

// Action Creators
export function setSearchQuery(query) {
  return {
    type: SET_SEARCH_QUERY,
    payload: {
      searchQuery: query
    }
  };
};

export function showLoginModal(redirect) {
  return {
    type: IS_LOGIN_MODAL,
    payload: {
      isLoginModal: true,
      loginRedirect: redirect
    }
  };
};

export function hideLoginModal() {
  return {
    type: IS_LOGIN_MODAL,
    payload: {
      isLoginModal: false,
      loginRedirect: '/'
    }
  };
};

export function showNotificationBar(message, title, params) {
  return {
    type: SHOW_NOTIFICATION_BAR,
    payload: {
      notificationBar: {
        visible: true,
        message,
        title,
        params
      }
    }
  };
};

export function closeNotificationBar(message, title, params) {
  return {
    type: CLOSE_NOTIFICATION_BAR,
    payload: {
      notificationBar: {
        visible: false,
        message,
        title,
        params
      }
    }
  };
};
