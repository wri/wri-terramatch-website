export const SET_SORT_ATTRIBUTE = 'sort/SET_SORT_ATTRIBUTE';
export const SET_SORT_DIRECTION = 'sort/SET_SORT_DIRECTION';
export const SET_PAGE = 'sort/SET_PAGE';

export const SORT_CLEAR = 'sort/SORT_CLEAR';
export const SORT_CLEAR_SEARCH = 'sort/SORT_CLEAR_SEARCH'

const initialState = {
    sortDirection: 'desc',
    sortAttribute: 'created_at',
    page: 1
};

const initialSearchState = {
    sortDirection: 'desc',
    sortAttribute: 'compatibility_score',
    page: 1
}

export default function reducer(state = initialState, action = {}) {
    switch(action.type) {
        case SET_SORT_ATTRIBUTE:
        case SET_SORT_DIRECTION:
        case SET_PAGE:
            return Object.assign({}, state, action.payload);
        case SORT_CLEAR:
            return Object.assign({}, state, initialState);
        case SORT_CLEAR_SEARCH:
            return Object.assign({}, state, initialSearchState);
        default:
            return state;
    }
}

export function setSortAttribute(attribute) {
    return {
        type: SET_SORT_ATTRIBUTE,
        payload: {
            sortAttribute: attribute
        }
    }
}

export function setSortDirection(direction) {
    return {
        type: SET_SORT_DIRECTION,
        payload: {
            sortDirection: direction
        }
    }
}

export function setPage(pageNum) {
    return {
        type: SET_PAGE,
        payload: {
            page: pageNum
        } 
    }
}

export function sortClearSearch() {
    return { type: SORT_CLEAR_SEARCH };
}

export function sortClear() {
    return { type: SORT_CLEAR }
}
