export const SET_FILTERS = 'filters/SET_FILTERS';
export const CLEAR_FILTERS = 'filters/CLEAR_FILTERS';

const initialState = {}

export default function reducer(state = initialState, action = {}) {
    switch(action.type) {
        case SET_FILTERS:
            return {...action.payload};
        case CLEAR_FILTERS:
            return {...initialState};
        default:
            return state;
    }
}

export function setFilters(filter) {
    return {
        type: SET_FILTERS,
        payload: filter
    }
}

export function clearFilters() {
    return {
        type: CLEAR_FILTERS
    }
}
