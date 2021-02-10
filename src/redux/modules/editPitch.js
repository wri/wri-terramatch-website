export const SET_CARBON_CERTIFICATES = 'editPitch/SET_CARBON_CERTIFICATES';
export const UPDATE_CARBON_CERTIFICATE = 'editPitch/UPDATE_CARBON_CERT';

export const SET_TREE_SPECIES = 'editPitch/SET_TREE_SPECIES';
export const UPDATE_TREE_SPECIES = 'editPitch/UPDATE_TREE_SPECIES';

export const SET_RESTORATION_METRICS = 'editPitch/SET_RESTORATION_METRIC';
export const UPDATE_RESTORATION_METRIC = 'editPitch/UPDATE_RESTORATION_METRIC'

const initialState = {
    carbonCertificates: [],
    treeSpecies: [],
    restorationMetrics: []
};

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case UPDATE_CARBON_CERTIFICATE:
            return {...state, carbonCertificates: state.carbonCertificates.map(cert =>
                cert.id === action.payload.id ? action.payload : cert)}
        case SET_CARBON_CERTIFICATES:
            return {
                ...state,
                carbonCertificates: action.payload
            }
        case UPDATE_TREE_SPECIES:
            return {...state, treeSpecies: state.treeSpecies.map(tree =>
                tree.id === action.payload.id ? action.payload : tree)}
        case SET_TREE_SPECIES:
            return {
                ...state,
                treeSpecies: action.payload
            }
        case UPDATE_RESTORATION_METRIC:
            return {...state, restorationMetrics: state.restorationMetrics.map(metric =>
                metric.id === action.payload.id ? action.payload : metric)}
        case SET_RESTORATION_METRICS:
            return {
                ...state,
                restorationMetrics: action.payload
            }
        default:
            return state
    }
}

export function setCarbonCerts(carbonCerts) {
    return {
        type: SET_CARBON_CERTIFICATES,
        payload: carbonCerts
    }
}

export function updateCarbonCert(carbonCert) {
    return {
        type: UPDATE_CARBON_CERTIFICATE,
        payload: carbonCert
    }
}

export function setTreeSpecies(treeSpecies) {
    return {
        type: SET_TREE_SPECIES,
        payload: treeSpecies
    }
}

export function updateTreeSpecies(treeSpecies) {
    return {
        type: UPDATE_TREE_SPECIES,
        payload: treeSpecies
    }
}

export function setMetrics(metrics) {
    return {
        type: SET_RESTORATION_METRICS,
        payload: metrics
    }
}

export function updateMetric(metric) {
    return {
        type: UPDATE_RESTORATION_METRIC,
        payload: metric
    }
}