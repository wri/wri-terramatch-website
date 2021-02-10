import { connect } from 'react-redux';
import AddDocumentsAwards from './AddDocumentsAwards';
import { createDocumentAwards } from '../../../redux/modules/documentAwards';

const mapStateToProps = ({ documentAwards }) => ({
  createDocumentAwardsState: documentAwards.createDocumentAwards
});

const mapDispatchToProps = (dispatch) => {
  return {
    createDocumentAwards: (docAwards) => {
      dispatch(createDocumentAwards(docAwards));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocumentsAwards);
