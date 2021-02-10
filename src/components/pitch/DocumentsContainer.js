import { connect } from 'react-redux';
import Documents from './Documents';
import {
    getPitchDocuments,
    getPitchDocumentsInspect,
    removePitchDocument,
    clearRemovePitchDocument,
    clearCreatePitchDocuments
} from '../../redux/modules/documentAwards';

const mapStateToProps = ({ documentAwards, auth }) => ({
    documentsState: documentAwards.getPitchDocuments,
    documentsInspectState: documentAwards.getPitchDocumentsInspect,
    removeDocumentState: documentAwards.removePitchDocument,
    meState: auth.me
});

const mapDispatchToProps = (dispatch) => {
    return {
        removeDocument: (id) => {
            dispatch(removePitchDocument(id))
        },
        clearRemoveDocument: () => {
            dispatch(clearRemovePitchDocument());
        },
        clearCreateDocuments: () => {
            dispatch(clearCreatePitchDocuments());
        },
        getDocumentsInspect: (pitchId) => {
            dispatch(getPitchDocumentsInspect(pitchId));
        },
        getDocuments: (pitchId) => {
            dispatch(getPitchDocuments(pitchId));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents);