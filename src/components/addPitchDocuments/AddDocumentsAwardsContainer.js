import { connect } from 'react-redux';
import AddDocumentsAwards from './AddDocumentsAwards';
import { createPitchDocuments } from '../../redux/modules/documentAwards';

const mapStateToProps = ({ documentAwards }) => ({
  createDocumentAwardsState: documentAwards.createPitchDocuments
});

const mapDispatchToProps = (dispatch) => {
  return {
    createDocumentAwards: (docAwards, pitchId) => {
      dispatch(createPitchDocuments(docAwards, pitchId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocumentsAwards);
